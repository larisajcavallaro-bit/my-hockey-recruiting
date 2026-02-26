import { NextResponse } from "next/server";
import Stripe from "stripe";

// Stripe SDK types may not include all API fields; use explicit shape for subscription objects
type SubscriptionLike = { current_period_end?: number; status?: string; id?: string; metadata?: Record<string, string> };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[webhook] Signature verification failed:", message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  const { prisma } = await import("@/lib/db");

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session & {
          subscription_data?: { metadata?: { planId?: string; intent?: string } };
        };
        const parentProfileId = session.metadata?.parentProfileId;
        const planId = session.metadata?.planId ?? session.subscription_data?.metadata?.planId;
        const intent = session.metadata?.intent ?? session.subscription_data?.metadata?.intent;

        if (!parentProfileId || !planId) {
          console.warn("[webhook] checkout.session.completed missing metadata");
          break;
        }

        const subscriptionId = session.subscription as string | null;
        if (!subscriptionId) break;

        const sub = (await stripe.subscriptions.retrieve(subscriptionId)) as unknown as SubscriptionLike;
        const periodEnd =
          sub.current_period_end != null
            ? new Date(sub.current_period_end * 1000)
            : null;

        if (intent === "addChild" && (planId === "gold" || planId === "elite")) {
          // Per-player: create PlayerSubscription (unassigned slot)
          await prisma.playerSubscription.create({
            data: {
              parentId: parentProfileId,
              planId,
              stripeSubscriptionId: subscriptionId,
              subscriptionStatus: sub.status,
              subscriptionPeriodEndAt: periodEnd,
            },
          });
        } else {
          // Family or legacy single-plan: update ParentProfile
          await prisma.parentProfile.update({
            where: { id: parentProfileId },
            data: {
              planId,
              stripeSubscriptionId: subscriptionId,
              subscriptionStatus: sub.status,
              subscriptionPeriodEndAt: periodEnd,
            },
          });
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as SubscriptionLike;
        const periodEnd =
          sub.current_period_end != null
            ? new Date(sub.current_period_end * 1000)
            : null;

        // Check if this is a PlayerSubscription (per-player)
        const playerSub = await prisma.playerSubscription.findUnique({
          where: { stripeSubscriptionId: sub.id },
        });

        if (playerSub) {
          await prisma.playerSubscription.update({
            where: { id: playerSub.id },
            data: {
              subscriptionStatus: event.type === "customer.subscription.deleted" ? "canceled" : sub.status,
              subscriptionPeriodEndAt: periodEnd,
            },
          });
          if (event.type === "customer.subscription.deleted" && playerSub.playerId) {
            await prisma.player.update({
              where: { id: playerSub.playerId },
              data: { planId: "free" },
            }).catch(() => {});
          }
          break;
        }

        // ParentProfile subscription (Family or legacy)
        const parentProfileId = sub.metadata?.parentProfileId;
        if (!parentProfileId) {
          const parent = await prisma.parentProfile.findFirst({
            where: { stripeSubscriptionId: sub.id },
          });
          if (!parent) break;
          await prisma.parentProfile.update({
            where: { id: parent.id },
            data: {
              planId: "free",
              stripeSubscriptionId: null,
              subscriptionStatus: event.type === "customer.subscription.deleted" ? "canceled" : sub.status,
              subscriptionPeriodEndAt: periodEnd,
            },
          });
          break;
        }

        const planId =
          event.type === "customer.subscription.deleted" ? "free" : (sub.metadata?.planId ?? "free");

        await prisma.parentProfile.update({
          where: { id: parentProfileId },
          data: {
            planId,
            subscriptionStatus: event.type === "customer.subscription.deleted" ? "canceled" : sub.status,
            subscriptionPeriodEndAt: periodEnd,
            ...(event.type === "customer.subscription.deleted" && {
              stripeSubscriptionId: null,
            }),
          },
        });
        break;
      }

      case "invoice.paid":
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string | { id?: string } };
        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id;

        if (!subscriptionId) break;

        const parent = await prisma.parentProfile.findFirst({
          where: { stripeSubscriptionId: subscriptionId },
        });
        if (!parent) break;

        const sub = (await stripe.subscriptions.retrieve(subscriptionId)) as unknown as SubscriptionLike;
        const periodEnd =
          sub.current_period_end != null
            ? new Date(sub.current_period_end * 1000)
            : null;

        await prisma.parentProfile.update({
          where: { id: parent.id },
          data: {
            subscriptionStatus: sub.status,
            subscriptionPeriodEndAt: periodEnd,
          },
        });
        break;
      }

      default:
        // Unhandled event type
        break;
    }
  } catch (err) {
    console.error("[webhook] Error processing event:", event.type, err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
