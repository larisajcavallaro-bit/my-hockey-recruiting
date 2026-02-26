/**
 * DEV ONLY: Creates or resets the admin user for local testing.
 * Only works when NODE_ENV=development.
 * GET /api/auth/dev-ensure-admin
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const passwordHash = await hashPassword("password123");

    const admin = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {
        passwordHash,
        role: "ADMIN",
        emailVerified: new Date(),
      },
      create: {
        email: "admin@example.com",
        passwordHash,
        name: "Admin User",
        role: "ADMIN",
        emailVerified: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin user ready. Sign in with admin@example.com / password123",
      email: admin.email,
    });
  } catch (error) {
    console.error("Dev ensure admin error:", error);
    return NextResponse.json(
      { error: "Failed to ensure admin user" },
      { status: 500 }
    );
  }
}
