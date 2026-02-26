import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { format } from "date-fns";

/**
 * GET /api/events/[id]/rsvps
 * Coach only: returns event info + players who RSVP'd "going"
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const coachProfileId = (session.user as { coachProfileId?: string | null }).coachProfileId;
    if (!coachProfileId) {
      return NextResponse.json({ error: "Coach access required" }, { status: 403 });
    }

    const { id: eventId } = await params;
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        rsvps: {
          where: { status: "going", playerId: { not: null } },
          include: {
            player: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    if (event.coachId !== coachProfileId) {
      return NextResponse.json({ error: "You can only view RSVPs for your own events" }, { status: 403 });
    }

    const players = event.rsvps
      .filter((r) => r.player)
      .map((r) => r.player!);

    return NextResponse.json({
      event: {
        id: event.id,
        title: event.title,
        date: format(event.startAt, "MMM d, yyyy"),
        eventType: event.eventType,
        rinkName: event.rinkName,
        location: event.location,
      },
      players: players.map((p) => ({
        id: p.id,
        name: p.name,
        birthYear: p.birthYear,
        position: p.position ?? null,
        level: p.level ?? null,
        team: p.team ?? null,
        league: p.league ?? null,
        goals: p.goals ?? null,
        assists: p.assists ?? null,
        plusMinus: p.plusMinus ?? null,
        gaa: p.gaa ?? null,
        savePct: p.savePct ?? null,
        gender: p.gender ?? null,
        location: p.location ?? null,
        status: p.status,
        image: p.image ?? null,
        socialLink: p.socialLink ?? null,
      })),
    });
  } catch (err) {
    console.error("[events/:id/rsvps] GET", err);
    return NextResponse.json(
      { error: "Failed to fetch RSVPs" },
      { status: 500 }
    );
  }
}
