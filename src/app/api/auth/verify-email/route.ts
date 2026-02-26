import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { checkVerification } from "@/lib/verify";
import crypto from "node:crypto";

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().min(4, "Code must be at least 4 digits").max(10, "Code must be at most 10 digits"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email: rawEmail, code } = verifySchema.parse(body);
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

    if (user.emailVerified) {
      return NextResponse.json(
        { success: true, message: "Already verified" },
        { status: 200 }
      );
    }

    const phone = user.parentProfile?.phone ?? user.coachProfile?.phone ?? null;
    if (!phone) {
      return NextResponse.json(
        { error: "No phone number on file. Please sign up again." },
        { status: 400 }
      );
    }

    // Validate code via Twilio Verify (or fallback to DB for legacy)
    const verifyConfigured = !!process.env.TWILIO_VERIFY_SERVICE_SID;
    let isValid = false;

    if (verifyConfigured) {
      const result = await checkVerification(phone, code);
      isValid = result.ok;
      if (!result.ok && result.twilioCode === 60623) {
        return NextResponse.json(
          { error: "This code has expired or was already used. Please request a new one." },
          { status: 400 }
        );
      }
      if (!result.ok && result.twilioCode === 60202) {
        return NextResponse.json(
          { error: "Too many attempts. Please wait a few minutes and request a new code." },
          { status: 400 }
        );
      }
    } else if (user.verificationCode && user.verificationCodeExpiresAt) {
      // Fallback: our own DB-stored code (legacy / dev)
      if (new Date() > user.verificationCodeExpiresAt) {
        return NextResponse.json(
          { error: "Verification code expired. Please request a new one." },
          { status: 400 }
        );
      }
      isValid = user.verificationCode === code;
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // One-time token for auto sign-in (valid 5 min)
    const oneTimeToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          verificationCode: null,
          verificationCodeExpiresAt: null,
          oneTimeSignInToken: oneTimeToken,
          oneTimeSignInTokenExpiresAt: tokenExpiresAt,
        },
      });
    } catch (dbError) {
      console.error("[verify-email] DB update failed after Twilio approved:", dbError);
      return NextResponse.json(
        { error: "Verification succeeded but we couldn't complete sign-in. Please try signing in with your password." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verified! Signing you in...",
      oneTimeToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Verify email error:", error);
    return NextResponse.json(
      { error: "Failed to verify" },
      { status: 500 }
    );
  }
}
