import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { checkVerification } from "@/lib/verify";
import crypto from "node:crypto";

const schema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email: rawEmail, code } = schema.parse(body);
    const email = rawEmail.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      include: { parentProfile: true, coachProfile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    const phone = user.parentProfile?.phone ?? user.coachProfile?.phone ?? null;
    if (!phone) {
      return NextResponse.json(
        { error: "No phone number on file." },
        { status: 400 }
      );
    }

    const result = await checkVerification(phone, code);
    if (!result.ok) {
      if (result.twilioCode === 60623) {
        return NextResponse.json(
          { error: "This code has expired or was already used. Please request a new one." },
          { status: 400 }
        );
      }
      if (result.twilioCode === 60202) {
        return NextResponse.json(
          { error: "Too many attempts. Please wait a few minutes and request a new code." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: resetToken,
          passwordResetTokenExpiresAt: tokenExpiresAt,
        },
      });
    } catch (dbError) {
      const message = dbError instanceof Error ? dbError.message : String(dbError);
      console.error("[forgot-password-verify] DB update failed after Twilio approved:", message, dbError);
      // In dev, surface the actual error to help debug (e.g. missing columns on production DB)
      const hint = process.env.NODE_ENV === "development" ? ` (${message})` : "";
      return NextResponse.json(
        { error: `Verification succeeded but we couldn't save your reset link. Please try again.${hint}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verified. Create your new password.",
      resetToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Forgot password verify error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
