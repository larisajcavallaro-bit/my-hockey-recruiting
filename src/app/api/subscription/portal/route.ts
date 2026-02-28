import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

/**
 * Create a Stripe Customer Portal session for managing subscription.
 * User can update payment method, cancel, etc.
 * Body: { subscriptionId?: string } - when provided, opens that specific subscription.
 */
export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey?.startsWith("sk_")) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }
  const stripe = new Stripe(secretKey);

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const parentProfileId = (session.user as { parentProfileId?: string | null })
      .parentProfileId;
    if (!parentProfileId) {
      return NextResponse.json(
        { error: "Parent account required" },
        { status: 403 }
      );
    }

    let subscriptionId: string | undefined;
    try {
      const body = await request.json();
      subscriptionId = body?.subscriptionId;
    } catch {
      // no body or invalid json - use default flow
    }

    const parent = await prisma.parentProfile.findUnique({
      where: { id: parentProfileId },
      select: { stripeCustomerId: true, stripeSubscriptionId: true },
    });

    if (!parent?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No billing account. Subscribe first from the pricing page." },
        { status: 400 }
      );
    }

    // Verify subscriptionId belongs to this parent (PlayerSubscription or ParentProfile)
    if (subscriptionId) {
      const ownsSub =
        parent.stripeSubscriptionId === subscriptionId ||
        (await prisma.playerSubscription.findFirst({
          where: {
            parentId: parentProfileId,
            stripeSubscriptionId: subscriptionId,
          },
        }));
      if (!ownsSub) {
        return NextResponse.json(
          { error: "Subscription not found" },
          { status: 400 }
        );
      }
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const returnUrl = `${baseUrl}/parent-dashboard/setting?tab=subscription`;

    const createParams: Stripe.BillingPortal.SessionCreateParams = {
      customer: parent.stripeCustomerId,
      return_url: returnUrl,
    };

    if (subscriptionId) {
      createParams.flow_data = {
        type: "subscription_update",
        subscription_update: { subscription: subscriptionId },
      };
    }

    const portalSession = await stripe.billingPortal.sessions.create(createParams);

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error("[subscription/portal]", err);
    return NextResponse.json(
      { error: "Failed to open billing portal" },
      { status: 500 }
    );
  }
}
