import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  status: z.enum(["resolved", "dismissed"]),
});

const replySchema = z.object({
  message: z.string().min(1, "Message is required"),
});

/** POST - add admin reply to coach dispute */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    const userId = session?.user?.id;
    if (role !== "ADMIN" || !userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { id } = await params;
    const body = await request.json();
    const data = replySchema.parse(body);

    const dispute = await prisma.coachReviewDispute.findUnique({ where: { id } });
    if (!dispute) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const msg = await prisma.coachReviewDisputeMessage.create({
      data: {
        disputeId: id,
        authorType: "admin",
        authorId: userId,
        message: data.message.trim(),
      },
    });
    return NextResponse.json({ reply: msg }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    console.error("Admin coach dispute reply error:", error);
    return NextResponse.json(
      { error: "Failed to add reply" },
      { status: 500 }
    );
  }
}

/** PATCH - update coach review dispute status (admin only) */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = updateSchema.parse(body);

    await prisma.coachReviewDispute.update({
      where: { id },
      data: { status: data.status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid status", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Admin coach dispute update error:", error);
    return NextResponse.json(
      { error: "Failed to update dispute" },
      { status: 500 }
    );
  }
}
