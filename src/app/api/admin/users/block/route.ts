import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** POST - block an email (admin only). Prevents sign-up and sign-in. */
export async function POST(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    const adminId = (session?.user as { id?: string })?.id;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const email = (body?.email ?? "").toString().trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    await prisma.blockedEmail.upsert({
      where: { email },
      create: {
        email,
        blockedBy: adminId ?? undefined,
        reason: (body?.reason ?? "").toString().trim() || undefined,
      },
      update: {
        blockedBy: adminId ?? undefined,
        reason: (body?.reason ?? "").toString().trim() || undefined,
      },
    });

    return NextResponse.json({ ok: true, blocked: email });
  } catch (error) {
    console.error("Block email error:", error);
    return NextResponse.json(
      { error: "Failed to block email" },
      { status: 500 }
    );
  }
}
