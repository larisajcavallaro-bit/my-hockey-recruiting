import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const blockSchema = z.object({
  blockedUserId: z.string().min(1),
});

// GET /api/blocks - list users the current user has blocked
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const blocks = await prisma.block.findMany({
      where: { blockerUserId: session.user.id },
      include: {
        blocked: {
          include: {
            parentProfile: true,
            coachProfile: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const list = blocks.map((b) => {
      const u = b.blocked;
      const role = u.coachProfile ? "Coach" : u.parentProfile ? "Parent" : "User";
      const name = u.name ?? u.email ?? "User";
      const image = u.image ?? null;
      return {
        id: b.id,
        blockedUserId: u.id,
        name,
        role,
        image,
        blockedDate: b.createdAt,
      };
    });

    return NextResponse.json({ blocks: list });
  } catch (err) {
    console.error("[blocks] GET", err);
    return NextResponse.json(
      { error: "Failed to fetch block list" },
      { status: 500 }
    );
  }
}

// POST /api/blocks - block a user
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { blockedUserId } = blockSchema.parse(body);

    if (blockedUserId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot block yourself" },
        { status: 400 }
      );
    }

    const blockedUser = await prisma.user.findUnique({
      where: { id: blockedUserId },
      include: { parentProfile: true, coachProfile: true },
    });
    if (!blockedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existing = await prisma.block.findUnique({
      where: {
        blockerUserId_blockedUserId: {
          blockerUserId: session.user.id,
          blockedUserId,
        },
      },
    });
    if (existing) {
      return NextResponse.json({
        block: { id: existing.id },
        message: "User is already blocked",
      });
    }

    const block = await prisma.block.create({
      data: {
        blockerUserId: session.user.id,
        blockedUserId,
      },
    });

    return NextResponse.json({ block: { id: block.id } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: err.flatten() },
        { status: 400 }
      );
    }
    console.error("[blocks] POST", err);
    return NextResponse.json(
      { error: "Failed to block user" },
      { status: 500 }
    );
  }
}
