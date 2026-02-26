import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const releaseSchema = z.object({
  action: z.enum(["release_only", "new_team", "close_account"]),
  team: z.string().optional(),
  league: z.string().optional(),
  level: z.string().optional(),
  birthYear: z.number().int().optional(),
});

/** POST: Coach releases their team (head coach only) - clears team/level/birthYear for another coach to adopt */
export async function POST(
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
        { error: "Only coaches can release a team" },
        { status: 403 }
      );
    }

    const { coachId } = await params;
    if (coachId !== coachProfileId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const coach = await prisma.coachProfile.findUnique({
      where: { id: coachId },
      select: { coachRole: true, team: true, level: true, birthYear: true },
    });
    if (!coach || coach.coachRole !== "HEAD_COACH") {
      return NextResponse.json(
        { error: "Only head coaches can release a team" },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const data = releaseSchema.parse(body);

    if (data.action === "close_account") {
      return NextResponse.json({
        redirectTo: "/auth/close-account",
        message: "You will be guided through closing your account.",
      });
    }

    if (data.action === "new_team" && data.team && data.level != null && data.birthYear != null) {
      await prisma.coachProfile.update({
        where: { id: coachId },
        data: {
          team: data.team.trim(),
          league: data.league?.trim() || null,
          level: String(data.level).trim(),
          birthYear: data.birthYear,
        },
      });
      return NextResponse.json({
        success: true,
        message: "Team updated. Your new team details have been saved.",
      });
    }

    if (data.action === "release_only" || data.action === "new_team") {
      await prisma.coachProfile.update({
        where: { id: coachId },
        data: {
          team: null,
          league: null,
          level: null,
          birthYear: null,
        },
      });
      return NextResponse.json({
        success: true,
        message:
          data.action === "release_only"
            ? "Team released. Another coach can now adopt this team/level/year."
            : "Team cleared.",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Release team error:", error);
    return NextResponse.json(
      { error: "Failed to release team" },
      { status: 500 }
    );
  }
}
