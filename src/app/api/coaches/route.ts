import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);

    const whereConditions: object[] = [];
    if (search) {
      whereConditions.push({
        OR: [
          { user: { name: { contains: search, mode: "insensitive" } } },
          { team: { contains: search, mode: "insensitive" } },
          { league: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    // Block filter: hide coaches from "Find Coaches" when either has blocked the other
    let excludeCoachUserIds: string[] = [];
    if (session?.user?.id) {
      const blocks = await prisma.block.findMany({
        where: {
          OR: [
            { blockerUserId: session.user.id },
            { blockedUserId: session.user.id },
          ],
        },
      });
      for (const b of blocks) {
        excludeCoachUserIds.push(b.blockerUserId, b.blockedUserId);
      }
      excludeCoachUserIds = [...new Set(excludeCoachUserIds)].filter(
        (id) => id !== session.user.id
      );
      if (excludeCoachUserIds.length > 0) {
        whereConditions.push({ userId: { notIn: excludeCoachUserIds } });
      }
    }

    const coaches = await prisma.coachProfile.findMany({
      where: whereConditions.length > 0 ? { AND: whereConditions } : undefined,
      include: {
        user: { select: { name: true, email: true, image: true } },
        reviews: true,
      },
      take: limit,
    });

    // Add computed rating for each coach
    const coachesWithRating = coaches.map((c) => {
      const avgRating =
        c.reviews.length > 0
          ? c.reviews.reduce((s, r) => s + r.rating, 0) / c.reviews.length
          : null;
      const { reviews, ...coach } = c;
      return { ...coach, rating: avgRating, reviewCount: reviews.length };
    });

    return NextResponse.json({ coaches: coachesWithRating });
  } catch (error) {
    console.error("Coaches list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch coaches" },
      { status: 500 }
    );
  }
}
