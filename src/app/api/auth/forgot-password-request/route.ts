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
      return NextResponse.json(
        { error: "No account found with that email" },
        { status: 404 }
      );
    }

    const phone = user.parentProfile?.phone ?? user.coachProfile?.phone ?? null;
    if (!phone) {
      return NextResponse.json(
        { error: "No phone number on file. Please contact support." },
        { status: 400 }
      );
    }

    const sendResult = await sendVerification(phone);
    if (!sendResult.ok) {
      if (sendResult.twilioMessage?.toLowerCase().includes("invalid phone")) {
        return NextResponse.json(
          { error: "We don't have a valid phone number on file for your account. Please contact us through the Contact Us page so we can help." },
          { status: 400 }
        );
      }
      if (sendResult.twilioCode === 21608) {
        return NextResponse.json(
          { error: "Phone verification is not available for this number. Please contact us through the Contact Us page so we can help." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Failed to send verification code. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your phone.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Forgot password request error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
