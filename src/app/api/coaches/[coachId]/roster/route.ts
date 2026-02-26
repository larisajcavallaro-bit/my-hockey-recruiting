import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

/** GET: Fetch roster for coach (verified players) + pending verifications. Head coach only for team display. */
export async function GET(
  _request: Request,
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
        { error: "Only coaches can view roster" },
        { status: 403 }
      );
    }

    const { coachId } = await params;
    if (coachId !== coachProfileId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const coach = await prisma.coachProfile.findUnique({
      where: { id: coachId },
      select: {
        team: true,
        level: true,
        birthYear: true,
        coachRole: true,
      },
    });
    if (!coach) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    const isHeadCoach = coach.coachRole === "HEAD_COACH";
    const hasTeam =
      (coach.team?.trim() ?? "") !== "" &&
      (coach.level?.trim() ?? "") !== "" &&
      coach.birthYear != null;

    const cv = (prisma as { coachPlayerVerification?: { findMany: (args: unknown) => Promise<unknown[]> } }).coachPlayerVerification;
    let verifications: { id: string; status: string; player: { id: string; name: string; birthYear: number; position?: string | null; level?: string | null; team?: string | null; league?: string | null; location?: string | null; image?: string | null; status: string; goals?: number | null; assists?: number | null; plusMinus?: number | null; gaa?: number | null; savePct?: string | null } | null }[] = [];

    if (cv && typeof cv.findMany === "function") {
      verifications = (await cv.findMany({
        where: { coachId },
        include: {
          player: {
            select: {
              id: true,
              name: true,
              birthYear: true,
              position: true,
              level: true,
              team: true,
              league: true,
              location: true,
              image: true,
              status: true,
              goals: true,
              assists: true,
              plusMinus: true,
              gaa: true,
              savePct: true,
            },
          },
        },
      })) as typeof verifications;
    } else {
      console.warn("Prisma coachPlayerVerification not found. Run: npx prisma generate");
    }

    const verified = verifications
      .filter((v) => v.status === "APPROVED")
      .map((v) => v.player)
      .filter(Boolean);
    const pending = verifications
      .filter((v) => v.status === "PENDING" && v.player)
      .map((v) => ({ verificationId: v.id, ...v.player }));

    const teamLabel = hasTeam
      ? `${coach.team} ${coach.level} (${coach.birthYear})`
      : null;

    return NextResponse.json({
      coach: {
        team: coach.team,
        level: coach.level,
        birthYear: coach.birthYear,
        coachRole: coach.coachRole,
        isHeadCoach,
        hasTeam,
        teamLabel,
        showTeamPanel: isHeadCoach && hasTeam,
      },
      teams: isHeadCoach && hasTeam ? [{ id: coachId, name: teamLabel ?? "", count: verified.length, active: true }] : [],
      verified,
      pending,
    });
  } catch (error) {
    console.error("Roster fetch error:", error);
    const message =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.message
        : "Failed to fetch roster";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
