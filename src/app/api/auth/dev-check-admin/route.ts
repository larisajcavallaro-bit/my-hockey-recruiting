/**
 * DEV ONLY: Check if admin user exists and can log in.
 * GET /api/auth/dev-check-admin
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email: { equals: "admin@example.com", mode: "insensitive" } },
    });

    if (!user) {
      return NextResponse.json({
        ok: false,
        error: "Admin user not found",
        hint: "Visit /api/auth/dev-ensure-admin to create it",
      });
    }

    let blocked = false;
    try {
      const b = await prisma.blockedEmail.findUnique({
        where: { email: user.email.toLowerCase() },
      });
      blocked = !!b;
    } catch {
      // Table might not exist
    }

    const passwordValid = user.passwordHash
      ? await verifyPassword("password123", user.passwordHash)
      : null;

    return NextResponse.json({
      ok: true,
      email: user.email,
      hasPasswordHash: !!user.passwordHash,
      passwordValid,
      emailVerified: !!user.emailVerified,
      role: user.role,
      blocked: !!blocked,
    });
  } catch (error) {
    console.error("Dev check admin error:", error);
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
