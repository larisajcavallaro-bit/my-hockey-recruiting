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
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parentProfileId = (session.user as { parentProfileId?: string | null })
      .parentProfileId;
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
