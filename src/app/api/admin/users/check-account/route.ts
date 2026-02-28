import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/users/check-account
 * Body: { email: string, password?: string }
 * Admin only. Diagnoses why sign-in might fail (blocked, no password, wrong password, etc.)
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const email = (body?.email ?? "").toString().trim().toLowerCase();
    const password = (body?.password ?? "").toString();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Email query param required" },
        { status: 400 }
      );
    }

    const blocked = await prisma.blockedEmail.findUnique({
      where: { email },
    });

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      include: { parentProfile: true, coachProfile: true },
    });

    if (!user) {
      return NextResponse.json({
        ok: false,
        reason: "NO_USER",
        message: "No account found with this email. Check for typos.",
      });
    }

    if (blocked) {
      return NextResponse.json({
        ok: false,
        reason: "BLOCKED",
        message: "This email is blocked. Unblock in Admin → Users first.",
      });
    }

    if (!user.passwordHash) {
      return NextResponse.json({
        ok: false,
        reason: "NO_PASSWORD",
        message: "Account has no password set. Use Reset password to set one.",
      });
    }

    if (!user.emailVerified && user.role !== "ADMIN" && user.role !== "COACH") {
      return NextResponse.json({
        ok: false,
        reason: "UNVERIFIED",
        message: "Phone not verified. Use Verify button in Admin → Users.",
      });
    }

    if (password) {
      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) {
        return NextResponse.json({
          ok: false,
          reason: "WRONG_PASSWORD",
          message: "Password is incorrect. Use Reset password to set a new one.",
        });
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Account looks good. Sign-in should work.",
      role: user.role,
      emailVerified: !!user.emailVerified,
      hasPassword: !!user.passwordHash,
      ...(password ? { passwordMatch: true } : { hint: "Include password in body to verify it works" }),
    });
  } catch (error) {
    console.error("Check account error:", error);
    return NextResponse.json(
      { error: "Check failed" },
      { status: 500 }
    );
  }
}
