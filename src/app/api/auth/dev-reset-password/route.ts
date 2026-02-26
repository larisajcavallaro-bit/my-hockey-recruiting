/**
 * DEV ONLY: Reset a user's password for testing.
 * Only works when NODE_ENV=development.
 * POST { "email": "user@example.com", "newPassword": "newpassword123" }
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const newPassword = String(body.newPassword || "");

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email and newPassword are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with that email" },
        { status: 404 }
      );
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({
      success: true,
      message: `Password reset for ${user.email}. You can now sign in with the new password.`,
    });
  } catch (error) {
    console.error("Dev reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
