import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** POST - reset a user's password (admin only). Use for stuck/unverified accounts. */
export async function POST(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const email = (body?.email ?? "").toString().trim().toLowerCase();
    const newPassword = (body?.newPassword ?? "").toString();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
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
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Don't allow resetting admin passwords (safety)
    if (user.role === "ADMIN") {
      return NextResponse.json(
        { error: "Cannot reset admin account passwords from this tool" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({
      ok: true,
      message: `Password reset for ${email}. They can now sign in with the new password.`,
    });
  } catch (error) {
    console.error("Admin reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
