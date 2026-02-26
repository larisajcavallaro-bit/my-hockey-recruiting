import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const replySchema = z.object({
  message: z.string().min(1, "Message is required"),
});

/** POST - coach adds reply to their own dispute */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const coachProfileId = (session?.user as { coachProfileId?: string | null })?.coachProfileId;
    if (!userId || !coachProfileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = replySchema.parse(body);

    const dispute = await prisma.coachReviewDispute.findUnique({ where: { id } });
    if (!dispute) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (dispute.coachProfileId !== coachProfileId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const msg = await prisma.coachReviewDisputeMessage.create({
      data: {
        disputeId: id,
        authorType: "disputant",
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
    console.error("Coach dispute reply error:", error);
    return NextResponse.json(
      { error: "Failed to add reply" },
      { status: 500 }
    );
  }
}
