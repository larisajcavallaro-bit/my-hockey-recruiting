import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { isTestAccount } from "@/constants/test-accounts";

const experienceSchema = z.object({
  title: z.string().min(1, "Role is required"),
  team: z.string().optional(),
  years: z.string().optional(),
  description: z.string().optional(),
});

const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  number: z.string().optional(),
  expiresAt: z.string().optional(), // ISO date string
});

const updateCoachSchema = z.object({
  title: z.string().optional(),
  team: z.string().optional(),
  teamLogo: z.string().optional(),
  league: z.string().optional(),
  level: z.string().optional(),
  birthYear: z.number().int().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
  philosophy: z.string().optional(),
  image: z.string().optional(),
  experience: z.array(experienceSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  specialties: z.array(z.string().min(1)).max(3).optional(), // top 3, must match rating criteria
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ coachId: string }> }
) {
  try {
    const { coachId } = await params;
    const session = await auth();

    const coach = await prisma.coachProfile.findUnique({
      where: { id: coachId },
      include: {
        user: { select: { name: true, email: true, image: true } },
        certifications: true,
        experience: true,
        specialties: true,
        reviews: {
          where: { status: "visible" },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!coach) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    if (isTestAccount(coach.user?.email)) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    // Block check: hide coach profile when blocker/blocked relationship exists
    if (session?.user?.id) {
      const blockExists = await prisma.block.findFirst({
        where: {
          OR: [
            { blockerUserId: session.user.id, blockedUserId: coach.userId },
            { blockerUserId: coach.userId, blockedUserId: session.user.id },
          ],
        },
      });
      if (blockExists) {
        return NextResponse.json({ error: "Coach not found" }, { status: 404 });
      }
    }

    // Average and count ALL visible reviews (exclude disputed)
    const reviewStats = await prisma.coachReview.aggregate({
      where: { coachId, status: "visible" },
      _count: true,
      _avg: { rating: true },
    });
    const avgRating =
      reviewStats._count > 0 && reviewStats._avg.rating != null
        ? reviewStats._avg.rating
        : null;
    const reviewCount = reviewStats._count;

    // For logged-in parents: has the current user already reviewed this coach?
    let currentUserHasReviewed = false;
    if (session?.user?.id) {
      const myReview = await prisma.coachReview.findFirst({
        where: { coachId, authorId: session.user.id },
        select: { id: true },
      });
      currentUserHasReviewed = !!myReview;
    }

    return NextResponse.json({
      ...coach,
      rating: avgRating,
      reviewCount,
      currentUserHasReviewed,
    });
  } catch (error) {
    console.error("Coach detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch coach" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ coachId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coachProfileId = (session.user as { coachProfileId?: string | null })
      .coachProfileId;
    if (!coachProfileId) {
      return NextResponse.json(
        { error: "Only coaches can update coach profiles" },
        { status: 403 }
      );
    }

    const { coachId } = await params;
    if (coachId !== coachProfileId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch (parseErr) {
      const msg = parseErr instanceof Error ? parseErr.message : "Invalid JSON";
      return NextResponse.json(
        {
          error:
            process.env.NODE_ENV === "development"
              ? `Failed to parse request body: ${msg}. Large images can cause this—try a smaller photo.`
              : "Request body too large or invalid. Try a smaller profile photo.",
        },
        { status: 413 }
      );
    }
    const data = updateCoachSchema.parse(body);

    // Fetch current coach to merge with updates
    const currentCoach = await prisma.coachProfile.findUnique({
      where: { id: coachId },
      select: { team: true, league: true, level: true, birthYear: true, title: true, coachRole: true },
    });
    if (!currentCoach) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    const league = (data.league ?? currentCoach.league ?? "").trim();
    const team = (data.team ?? currentCoach.team ?? "").trim();
    const level = (data.level ?? currentCoach.level ?? "").trim();
    const birthYear = data.birthYear ?? currentCoach.birthYear;
    const newTitle = data.title ?? currentCoach.title ?? "";

    // If claiming Head Coach, enforce uniqueness: 1 head coach per league/team/level/birthYear
    const isClaimingHeadCoach =
      newTitle.toLowerCase() === "head coach";
    if (isClaimingHeadCoach && league && team && level && birthYear != null) {
      const existingHead = await prisma.coachProfile.findFirst({
        where: {
          league: { equals: league, mode: "insensitive" },
          team: { equals: team, mode: "insensitive" },
          level: { equals: level, mode: "insensitive" },
          birthYear,
          coachRole: "HEAD_COACH",
          id: { not: coachId }, // exclude self
        },
      });
      if (existingHead) {
        return NextResponse.json(
          {
            error:
              "A head coach is already registered for this league, team, level, and birth year. " +
              "If you believe this is a mistake, please use the Contact Us form to submit a dispute.",
            code: "HEAD_COACH_TAKEN",
          },
          { status: 409 }
        );
      }
    }

    // Derive coachRole from title for consistency
    const coachRole =
      newTitle.toLowerCase() === "head coach"
        ? "HEAD_COACH"
        : newTitle.toLowerCase() === "assistant coach"
          ? "ASSISTANT_COACH"
          : undefined;

    const coach = await prisma.coachProfile.update({
      where: { id: coachId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(coachRole !== undefined && { coachRole }),
        ...(data.team !== undefined && { team: data.team }),
        ...(data.teamLogo !== undefined && { teamLogo: data.teamLogo }),
        ...(data.league !== undefined && { league: data.league }),
        ...(data.level !== undefined && { level: data.level }),
        ...(data.birthYear !== undefined && { birthYear: data.birthYear }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.about !== undefined && { about: data.about }),
        ...(data.philosophy !== undefined && { philosophy: data.philosophy }),
        ...(data.image !== undefined && { image: data.image }),
      },
    });

    // Replace experience if provided
    if (data.experience !== undefined) {
      await prisma.coachExperience.deleteMany({
        where: { coachId },
      });
      if (data.experience.length > 0) {
        await prisma.coachExperience.createMany({
          data: data.experience.map((exp) => ({
            coachId,
            title: exp.title,
            team: exp.team?.trim() || null,
            years: exp.years?.trim() || null,
            description: exp.description?.trim() || null,
          })),
        });
      }
    }

    // Replace certifications if provided
    if (data.certifications !== undefined) {
      await prisma.coachCertification.deleteMany({
        where: { coachId },
      });
      if (data.certifications.length > 0) {
        await prisma.coachCertification.createMany({
          data: data.certifications.map((cert) => {
            let expiresAt: Date | null = null;
            if (cert.expiresAt) {
              const d = new Date(cert.expiresAt);
              expiresAt = isNaN(d.getTime()) ? null : d;
            }
            return {
              coachId,
              name: cert.name.trim(),
              number: cert.number?.trim() || null,
              expiresAt,
            };
          }),
        });
      }
    }

    // Replace specialties if provided (top 3, must match rating criteria from lookups)
    if (data.specialties !== undefined) {
      await prisma.coachSpecialty.deleteMany({
        where: { coachId },
      });
      if (data.specialties.length > 0) {
        const trimmed = data.specialties.slice(0, 3).map((s) => s.trim()).filter(Boolean);
        if (trimmed.length > 0) {
          await prisma.coachSpecialty.createMany({
            data: trimmed.map((name) => ({ coachId, name })),
          });
        }
      }
    }

    const updated = await prisma.coachProfile.findUnique({
      where: { id: coachId },
      include: { experience: true, certifications: true, specialties: true },
    });

    return NextResponse.json({ coach: updated ?? coach });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Coach update error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? message
            : "Failed to update profile",
      },
      { status: 500 }
    );
  }
}
