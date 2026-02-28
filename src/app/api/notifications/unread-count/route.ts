import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET - count of unread notifications for current user */
export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ count: 0 });
    }

    const count = await prisma.notification.count({
      where: { userId, read: false },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("[notifications/unread-count] GET", error);
    return NextResponse.json({ count: 0 });
  }
}
