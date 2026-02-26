import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import {
  getStripePriceId,
  SUBSCRIPTION_PLANS,
  type PlanId,
} from "@/constants/subscription";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || !secretKey.startsWith("sk_")) {
    console.error("[subscription/checkout] Missing or invalid STRIPE_SECRET_KEY");
    return NextResponse.json(
      {
        error:
          "Stripe is not configured. Add STRIPE_SECRET_KEY to your .env.local (see STRIPE-SETUP.md)",
      },
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
        { error: "Parent account required for subscriptions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { planId, billingPeriod = "monthly", intent = "subscribe" } = body as {
      planId: string;
      billingPeriod?: "monthly" | "annual";
      intent?: "subscribe" | "addChild";
    };

    if (!planId || planId === "free") {
      return NextResponse.json(
        { error: "Select a paid plan to subscribe" },
        { status: 400 }
      );
    }

    const validPlanIds = Object.keys(SUBSCRIPTION_PLANS) as PlanId[];
    if (!validPlanIds.includes(planId as PlanId)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // addChild: only gold or elite (per-player plans)
    if (intent === "addChild" && planId !== "gold" && planId !== "elite") {
      return NextResponse.json(
        { error: "Add child requires Gold or Elite plan. Or choose Family for one price for all." },
        { status: 400 }
      );
    }

    const priceId = getStripePriceId(planId as PlanId, billingPeriod);
    if (!priceId) {
      return NextResponse.json(
        { error: "Plan not configured. Please add Stripe Price IDs to your environment." },
        { status: 400 }
      );
    }

    const parent = await prisma.parentProfile.findUnique({
      where: { id: parentProfileId },
      include: { user: { select: { email: true } } },
    });
    if (!parent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    }

    const { origin } = new URL(request.url);
    const successUrl =
      intent === "addChild"
        ? `${origin}/parent-dashboard/players?addChild=1&planId=${planId}`
        : `${origin}/parent-dashboard/setting?tab=subscription&success=1`;
    const cancelUrl =
      intent === "addChild"
        ? `${origin}/parent-dashboard/players`
        : `${origin}/subscription`;

    let stripeCustomerId = parent.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: parent.user?.email ?? undefined,
        metadata: { parentProfileId },
      });
      stripeCustomerId = customer.id;
      await prisma.parentProfile.update({
        where: { id: parentProfileId },
        data: { stripeCustomerId },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        parentProfileId,
        planId,
        billingPeriod,
        intent: intent ?? "subscribe",
      },
      subscription_data: {
        metadata: { parentProfileId, planId, intent: intent ?? "subscribe" },
        trial_period_days: 30, // 30-day free trial as per marketing copy
      },
    });

    return NextResponse.json({
      url: checkoutSession.url,
    });
  } catch (err) {
    console.error("[subscription/checkout]", err);

    let errorMessage = "Failed to create checkout session";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    // Stripe SDK errors
    if (err && typeof err === "object" && "message" in err) {
      errorMessage = String((err as { message?: string }).message);
    }

    return NextResponse.json(
      {
        error:
          errorMessage ||
          "Check that STRIPE_SECRET_KEY and all STRIPE_PRICE_* variables are set in .env.local (see STRIPE-SETUP.md).",
      },
      { status: 500 }
    );
  }
}
