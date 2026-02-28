/**
 * DEV ONLY: Creates or resets test accounts (parent, coach) for local testing.
 * Only works when NODE_ENV=development.
 * GET /api/auth/dev-ensure-test-accounts
 *
 * After calling this, sign in with:
 * - parent@example.com / password123
 * - coach@example.com / password123
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

    const parentUser = await prisma.user.upsert({
      where: { email: "parent@example.com" },
      update: {
        passwordHash,
        emailVerified: new Date(),
      },
      create: {
        email: "parent@example.com",
        passwordHash,
        name: "Test Parent",
        role: "PARENT",
        emailVerified: new Date(),
      },
    });

    await prisma.parentProfile.upsert({
      where: { userId: parentUser.id },
      update: {},
      create: {
        userId: parentUser.id,
        phone: "+15551234567",
      },
    });

    const coachUser = await prisma.user.upsert({
      where: { email: "coach@example.com" },
      update: {
        passwordHash,
        emailVerified: new Date(),
      },
      create: {
        email: "coach@example.com",
        passwordHash,
        name: "Jake Thompson",
        role: "COACH",
        emailVerified: new Date(),
      },
    });

    const coachProfile = await prisma.coachProfile.findFirst({
      where: { userId: coachUser.id },
    });
    if (!coachProfile) {
      await prisma.coachProfile.create({
        data: {
          userId: coachUser.id,
          coachRole: "HEAD_COACH",
          title: "Head Coach",
          team: "Vegas Golden Knights",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Test accounts ready. Sign in with parent@example.com or coach@example.com / password123",
      accounts: [
        { email: "parent@example.com", password: "password123" },
        { email: "coach@example.com", password: "password123" },
      ],
    });
  } catch (error) {
    console.error("Dev ensure test accounts error:", error);
    return NextResponse.json(
      { error: "Failed to ensure test accounts" },
      { status: 500 }
    );
  }
}
