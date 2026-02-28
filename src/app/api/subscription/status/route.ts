import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getSubscriptionForParent,
  getPlayersWithPlanInfo,
} from "@/lib/subscription";

/**
 * GET /api/subscription/status
 * Returns current parent's subscription info (plan, limit, can add player, etc.)
 * Includes per-player plan info for billing UI.
 * Admins get Elite-equivalent status for visibility (FeatureGate, etc.).
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string })?.role;
    const parentProfileId = (session.user as { parentProfileId?: string | null })
      .parentProfileId;

    // Admins get Elite-level visibility/capabilities without needing a ParentProfile
    if (role === "ADMIN" && !parentProfileId) {
      const { getPlanById } = await import("@/constants/subscription");
      const plan = getPlanById("elite");
      return NextResponse.json({
        planId: "elite",
        planName: plan.name,
        canAddPlayer: true,
        playerLimit: 10,
        currentPlayerCount: 0,
        status: "active",
        periodEndAt: null,
        monthlyPrice: plan.monthlyPrice,
        players: [],
      });
    }

    if (!parentProfileId) {
      return NextResponse.json(
        { error: "Parent account required" },
        { status: 403 }
      );
    }

    const [subscription, players] = await Promise.all([
      getSubscriptionForParent(parentProfileId),
      getPlayersWithPlanInfo(parentProfileId),
    ]);
    return NextResponse.json({ ...subscription, players });
  } catch (err) {
    console.error("[subscription/status]", err);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
