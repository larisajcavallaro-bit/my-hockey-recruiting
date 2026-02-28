import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { sendVerification, ensureE164 } from "@/lib/verify";

const signUpSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  userType: z.enum(["coach", "parent"]),
  phone: z.string().min(10, "Phone number is required for text verification"),
  // Coach-specific (required when userType is coach)
  league: z.string().optional(),
  level: z.string().optional(),
  team: z.string().optional(),
  birthYear: z
    .union([z.number(), z.string().min(1)])
    .optional()
    .transform((v) => (v === "" || v == null ? undefined : typeof v === "string" ? parseInt(v, 10) : v)),
  coachRole: z.enum(["HEAD_COACH", "ASSISTANT_COACH"]).optional(),
}).refine(
  (data) => {
    if (data.userType !== "coach") return true;
    return !!(
      data.league?.trim() &&
      data.level?.trim() &&
      data.team?.trim() &&
      data.birthYear != null &&
      data.coachRole
    );
  },
  { message: "Coaches must provide league, level, team, birth year, and coaching role" }
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = signUpSchema.parse(body);

    const email = data.email.trim().toLowerCase();
    const blocked = await prisma.blockedEmail.findUnique({
      where: { email },
    });
    if (blocked) {
      return NextResponse.json(
        { error: "This email address cannot create an account." },
        { status: 403 }
      );
    }
    const existing = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    let passwordHash: string;
    try {
      passwordHash = await hashPassword(data.password);
    } catch (e) {
      console.error("Hash error:", e);
      return NextResponse.json(
        { error: "Password hashing failed. Please try again." },
        { status: 500 }
      );
    }
    const role = data.userType === "coach" ? "COACH" : "PARENT";

    // Coach-only: validate head coach uniqueness (1 head coach per team/level/birthYear)
    if (role === "COACH") {
      const league = (data.league ?? "").trim();
      const level = (data.level ?? "").trim();
      const team = (data.team ?? "").trim();
      const birthYear = data.birthYear;
      const coachRole = data.coachRole as "HEAD_COACH" | "ASSISTANT_COACH";
      if (!league || !level || !team || birthYear == null || !coachRole) {
        return NextResponse.json(
          { error: "Coaches must provide league, level, team, birth year, and coaching role" },
          { status: 400 }
        );
      }
      if (coachRole === "HEAD_COACH") {
        const existingHead = await prisma.coachProfile.findFirst({
          where: {
            league: { equals: league, mode: "insensitive" },
            team: { equals: team, mode: "insensitive" },
            level: { equals: level, mode: "insensitive" },
            birthYear,
            coachRole: "HEAD_COACH",
          },
        });
        if (existingHead) {
          return NextResponse.json(
            {
              error:
                "A head coach is already registered for this team, level, and birth year. " +
                "If you believe this is a mistake, please use the Contact Us form to submit a dispute.",
              code: "HEAD_COACH_TAKEN",
            },
            { status: 409 }
          );
        }
      }
    }

    let user;
    try {
      user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name: data.name,
          role,
          verificationCode: "pending", // Placeholder; Twilio Verify handles the actual code
          verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
    } catch (dbError) {
      console.error("DB create user error:", dbError);
      throw dbError;
    }

    // Send verification code via Twilio Verify (pre-approved templates)
    const sendResult = await sendVerification(data.phone);

    if (!sendResult.ok && process.env.NODE_ENV === "development") {
      console.log(`[DEV] Twilio Verify not configured. Add TWILIO_VERIFY_SERVICE_SID to .env.local`);
    }
    if (!sendResult.ok && process.env.NODE_ENV === "production") {
      console.error("[sign-up] Twilio Verify send failed:", sendResult.twilioCode, sendResult.twilioMessage);
    }

    // Create role-specific profile
    try {
      const phoneE164 = ensureE164(data.phone);
      if (role === "PARENT") {
        await prisma.parentProfile.create({
          data: {
            userId: user.id,
            phone: phoneE164,
          },
        });
      } else {
        const league = (data.league ?? "").trim();
        const level = (data.level ?? "").trim();
        const team = (data.team ?? "").trim();
        const birthYear = data.birthYear!;
        const coachRole = data.coachRole as "HEAD_COACH" | "ASSISTANT_COACH";
        const title = coachRole === "HEAD_COACH" ? "Head Coach" : "Assistant Coach";
        await prisma.coachProfile.create({
          data: {
            userId: user.id,
            phone: phoneE164,
            league,
            level,
            team,
            birthYear,
            coachRole,
            title,
          },
        });
      }
    } catch (profileError) {
      console.error("Create profile error:", profileError);
      // Rollback: delete the user we just created
      await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
      throw profileError;
    }

    const payload: Record<string, unknown> = {
      success: true,
      needVerification: true,
      email: user.email,
      phone: data.phone,
    };
    if (!sendResult.ok && sendResult.twilioCode === 21608) {
      payload._verificationWarning =
        "Phone verification couldn't be sent (SMS provider trial limit). Use Contact Us and we'll help you verify.";
    } else if (!sendResult.ok) {
      payload._verificationWarning =
        "We couldn't send the verification code. Try Resend on the next page, or contact us if it keeps happening.";
    }
    return NextResponse.json(payload, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Sign-up error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create account";
    return NextResponse.json(
      {
        error: process.env.NODE_ENV === "development" ? message : "Failed to create account",
      },
      { status: 500 }
    );
  }
}
