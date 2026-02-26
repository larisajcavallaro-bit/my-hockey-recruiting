import { NextResponse } from "next/server";
import { verifyZapierAuth } from "@/lib/zapier";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/zapier/contact-messages
 * Zapier-compatible: use Authorization: Bearer <ADMIN_API_KEY>
 * Returns contact messages for Zapier to use in workflows.
 */
export async function GET(request: Request) {
  if (!verifyZapierAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      messages: messages.map((m) => ({
        id: m.id,
        firstName: m.firstName,
        lastName: m.lastName,
        email: m.email,
        topic: m.topic,
        message: m.message,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Zapier contact-messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact messages" },
      { status: 500 }
    );
  }
}
