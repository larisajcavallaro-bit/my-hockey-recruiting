import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendVerification } from "@/lib/verify";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email: rawEmail } = schema.parse(body);
    const email = rawEmail.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      include: { parentProfile: true, coachProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Already verified. Please sign in." },
        { status: 400 }
      );
    }

    const phone =
      user.parentProfile?.phone ?? user.coachProfile?.phone ?? null;
    if (!phone) {
      return NextResponse.json(
        { error: "No phone number on file. Please sign up again." },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: "pending",
        verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    const sent = await sendVerification(phone);

    return NextResponse.json({
      success: true,
      ...(process.env.NODE_ENV === "development" && !sent && {
        _devCode: "(Twilio Verify required - add TWILIO_VERIFY_SERVICE_SID)",
      }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Resend code error:", error);
    return NextResponse.json(
      { error: "Failed to resend code" },
      { status: 500 }
    );
  }
}
