import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { createNotification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

const replySchema = z.object({
  message: z.string().min(1, "Message is required"),
});

/** GET - get single contact message with replies (admin only) */
export async function GET(
  _request: Request,
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

    const msg = await prisma.contactMessage.findUnique({
      where: { id },
      include: {
        replies: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!msg) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: msg });
  } catch (error) {
    console.error("Admin contact message fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch message" },
      { status: 500 }
    );
  }
}

/** POST - add admin reply to contact message */
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

    const msg = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!msg) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const reply = await prisma.contactReply.create({
      data: {
        contactMessageId: id,
        authorType: "admin",
        authorId: userId,
        message: data.message.trim(),
      },
    });

    // Notify user if they have an account (userId on the message)
    if (msg.userId) {
      const user = await prisma.user.findUnique({
        where: { id: msg.userId },
        select: {
          parentProfile: { select: { id: true } },
          coachProfile: { select: { id: true } },
        },
      });
      const messagesPath = user?.parentProfile
        ? "/parent-dashboard/messages"
        : "/coach-dashboard/messages";
      await createNotification({
        userId: msg.userId,
        type: "message",
        title: "New reply to your message",
        body: "We've responded to your Contact Us submission.",
        linkUrl: messagesPath,
      }).catch(() => {});
    }

    return NextResponse.json({ reply }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    console.error("Admin contact reply error:", error);
    return NextResponse.json(
      { error: "Failed to add reply" },
      { status: 500 }
    );
  }
}
