import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET - list current user's disputes (coach or parent) with messages */
export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coachProfileId = (session.user as { coachProfileId?: string | null })?.coachProfileId;
    const parentProfileId = (session.user as { parentProfileId?: string | null })?.parentProfileId;

    const [coachDisputes, playerDisputes] = await Promise.all([
      coachProfileId
        ? prisma.coachReviewDispute.findMany({
            where: { coachProfileId },
            include: {
              review: { select: { text: true, rating: true, author: true } },
              messages: { orderBy: { createdAt: "asc" } },
            },
            orderBy: { createdAt: "desc" },
          })
        : [],
      parentProfileId
        ? prisma.playerReviewDispute.findMany({
            where: { parentProfileId },
            include: {
              review: {
                select: {
                  text: true,
                  rating: true,
                  author: true,
                  player: { select: { name: true } },
                },
              },
              messages: { orderBy: { createdAt: "asc" } },
            },
            orderBy: { createdAt: "desc" },
          })
        : [],
    ]);

    const disputes = [
      ...coachDisputes.map((d) => ({ ...d, type: "coach" as const })),
      ...playerDisputes.map((d) => ({ ...d, type: "player" as const })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ disputes });
  } catch (error) {
    console.error("Disputes fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch disputes" },
      { status: 500 }
    );
  }
}
