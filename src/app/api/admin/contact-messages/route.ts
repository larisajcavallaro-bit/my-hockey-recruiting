import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET - list contact messages (admin only) */
export async function GET(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "100", 10), 10000);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          replies: { orderBy: { createdAt: "asc" } },
        },
      }),
      prisma.contactMessage.count(),
    ]);

    return NextResponse.json({ messages, total });
  } catch (error) {
    console.error("Admin contact messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact messages" },
      { status: 500 }
    );
  }
}
