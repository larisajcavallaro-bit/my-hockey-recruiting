import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const replySchema = z.object({
  message: z.string().min(1, "Message is required"),
});

/** POST - add user reply to their own contact thread */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = replySchema.parse(body);

    const msg = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!msg) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (msg.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const reply = await prisma.contactReply.create({
      data: {
        contactMessageId: id,
        authorType: "user",
        authorId: userId,
        message: data.message.trim(),
      },
    });

    return NextResponse.json({ reply }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    console.error("Message reply error:", error);
    return NextResponse.json(
      { error: "Failed to add reply" },
      { status: 500 }
    );
  }
}
