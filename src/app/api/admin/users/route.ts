import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";

export const dynamic = "force-dynamic";

/** GET - list users (admin only) */
export async function GET(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get("role"); // PARENT | COACH | ADMIN | null
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "100", 10), 10000);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    const where =
      roleFilter && ["PARENT", "COACH", "ADMIN"].includes(roleFilter)
        ? { role: roleFilter as UserRole }
        : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          parentProfile: {
            select: {
              id: true,
              planId: true,
              phone: true,
              players: { select: { id: true, name: true } },
            },
          },
          coachProfile: {
            select: {
              id: true,
              team: true,
              level: true,
              phone: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({ users, total });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
