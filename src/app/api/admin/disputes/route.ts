import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET - list all disputes: coach review + player review (admin only) */
export async function GET(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "coach" | "player" | null (all)
    const statusFilter = searchParams.get("status"); // "pending" | "resolved" | "dismissed" | null

    if (type === "coach") {
      const where =
        statusFilter && ["pending", "resolved", "dismissed"].includes(statusFilter)
          ? { status: statusFilter }
          : {};
      const disputes = await prisma.coachReviewDispute.findMany({
        where,
        include: {
          review: {
            select: {
              id: true,
              text: true,
              rating: true,
              author: true,
              status: true,
              createdAt: true,
              coachProfile: {
                select: {
                  id: true,
                  team: true,
                  level: true,
                  user: { select: { name: true, email: true } },
                },
              },
            },
          },
          messages: { orderBy: { createdAt: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({
        disputes: disputes.map((d) => ({
          ...d,
          type: "coach" as const,
        })),
      });
    }

    if (type === "player") {
      const where =
        statusFilter && ["pending", "resolved", "dismissed"].includes(statusFilter)
          ? { status: statusFilter }
          : {};
      const disputes = await prisma.playerReviewDispute.findMany({
        where,
        include: {
          review: {
            select: {
              id: true,
              text: true,
              rating: true,
              author: true,
              status: true,
              createdAt: true,
              player: {
                select: {
                  id: true,
                  name: true,
                  parent: {
                    select: {
                      user: { select: { name: true, email: true } },
                    },
                  },
                },
              },
            },
          },
          messages: { orderBy: { createdAt: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({
        disputes: disputes.map((d) => ({
          ...d,
          type: "player" as const,
        })),
      });
    }

    // All disputes
    const [coachDisputes, playerDisputes] = await Promise.all([
      prisma.coachReviewDispute.findMany({
        where:
          statusFilter && ["pending", "resolved", "dismissed"].includes(statusFilter)
            ? { status: statusFilter }
            : {},
        include: {
          review: {
            select: {
              id: true,
              text: true,
              rating: true,
              author: true,
              status: true,
              createdAt: true,
              coachProfile: {
                select: {
                  id: true,
                  team: true,
                  level: true,
                  user: { select: { name: true, email: true } },
                },
              },
            },
          },
          messages: { orderBy: { createdAt: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.playerReviewDispute.findMany({
        where:
          statusFilter && ["pending", "resolved", "dismissed"].includes(statusFilter)
            ? { status: statusFilter }
            : {},
        include: {
          review: {
            select: {
              id: true,
              text: true,
              rating: true,
              author: true,
              status: true,
              createdAt: true,
              player: {
                select: {
                  id: true,
                  name: true,
                  parent: {
                    select: {
                      user: { select: { name: true, email: true } },
                    },
                  },
                },
              },
            },
          },
          messages: { orderBy: { createdAt: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      }),
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
    console.error("Admin disputes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch disputes" },
      { status: 500 }
    );
  }
}
