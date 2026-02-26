import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET - count contact threads with admin replies the user hasn't seen */
export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ count: 0 });
    }

    const messages = await prisma.contactMessage.findMany({
      where: { userId },
      include: {
        replies: {
          where: { authorType: "admin" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    let count = 0;
    for (const m of messages) {
      const latestAdminReply = m.replies[0];
      if (!latestAdminReply) continue;
      const replyTime = new Date(latestAdminReply.createdAt).getTime();
      const lastRead = m.userLastReadAt
        ? new Date(m.userLastReadAt).getTime()
        : 0;
      if (replyTime > lastRead) count++;
    }

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Unread count error:", error);
    return NextResponse.json({ count: 0 });
  }
}
