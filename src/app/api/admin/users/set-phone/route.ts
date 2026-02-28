import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ensureE164 } from "@/lib/verify";

export const dynamic = "force-dynamic";

/** POST - set a user's phone number (admin only). Use when phone is invalid/missing and user can't get verification codes. */
export async function POST(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const email = (body?.email ?? "").toString().trim().toLowerCase();
    const phone = (body?.phone ?? "").toString().trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const phoneE164 = ensureE164(phone);
    if (!phoneE164) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit phone number (e.g. 555-123-4567)" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      include: { parentProfile: true, coachProfile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.parentProfile) {
      await prisma.parentProfile.update({
        where: { id: user.parentProfile.id },
        data: { phone: phoneE164 },
      });
    } else if (user.coachProfile) {
      await prisma.coachProfile.update({
        where: { id: user.coachProfile.id },
        data: { phone: phoneE164 },
      });
    } else {
      return NextResponse.json(
        { error: "User has no parent or coach profile" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: `Phone updated for ${email}. They can now receive verification codes.`,
    });
  } catch (error) {
    console.error("Admin set-phone error:", error);
    return NextResponse.json(
      { error: "Failed to update phone" },
      { status: 500 }
    );
  }
}
