import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** POST - mark contact message(s) as read. Body: { messageId?: string } to mark one, or omit to mark all */
export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const messageId = body?.messageId;

    const where = messageId
      ? { userId, id: messageId }
      : { userId };

    await prisma.contactMessage.updateMany({
      where,
      data: { userLastReadAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Mark read error:", error);
    return NextResponse.json(
      { error: "Failed to mark as read" },
      { status: 500 }
    );
  }
}
