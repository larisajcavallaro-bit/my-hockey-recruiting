import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { z } from "zod";

// GET /api/events - list events. ?mine=1 for coach returns only their events.
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parentProfileId = (session.user as { parentProfileId?: string | null })
      ?.parentProfileId;
    const coachProfileId = (session.user as { coachProfileId?: string | null })
      ?.coachProfileId;
    const { searchParams } = new URL(request.url);
    const mine = searchParams.get("mine") === "1";

    const from = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const where: { startAt: { gte: Date }; coachId?: string } = { startAt: { gte: from } };
    if (mine && coachProfileId) {
      where.coachId = coachProfileId;
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startAt: "asc" },
      include: {
        rsvps: {
          where: { parentProfileId: parentProfileId ?? "none" },
          include: { player: { select: { id: true, name: true } } },
        },
      },
    });

    // Resolve coach profiles (team, level, birthYear for Organized By)
    const coachIds = [...new Set(events.map((e) => e.coachId).filter(Boolean))] as string[];
    const coaches =
      coachIds.length > 0
        ? await prisma.coachProfile.findMany({
            where: { id: { in: coachIds } },
            include: { user: { select: { name: true } } },
          })
        : [];
    const coachMap = new Map(
      coaches.map((c) => [
        c.id,
        {
          name: c.user?.name ?? "Coach",
          team: c.team,
          level: c.level,
          birthYear: c.birthYear,
          teamLogo: c.teamLogo,
        },
      ])
    );

    const formatted = events.map((e) => {
      const rsvp = Array.isArray(e.rsvps) && e.rsvps.length > 0 ? e.rsvps[0] : null;
      const coach = e.coachId ? coachMap.get(e.coachId) : null;
      const coachName = coach?.name ?? "Event Organizer";
      const organizedBy = coach
        ? [coach.team, coach.level, coach.birthYear].filter(Boolean).join(" · ")
        : "";
      return {
        id: e.id,
        title: e.title,
        description: e.description ?? "",
        image: e.image ?? null,
        websiteLink: e.websiteLink ?? null,
        socialMediaLink: e.socialMediaLink ?? null,
        date: format(e.startAt, "MMM d, yyyy"),
        startAt: e.startAt.toISOString(),
        endAt: e.endAt?.toISOString() ?? null,
        eventType: e.eventType ?? null,
        rinkName: e.rinkName ?? null,
        location: e.location ?? "",
        time: e.endAt
          ? `${format(e.startAt, "h:mm a")}-${format(e.endAt, "h:mm a")}`
          : format(e.startAt, "h:mm a"),
        ageGroup: e.ageGroup ?? "",
        teamLogo: e.image ?? coach?.teamLogo ?? "/newasset/event/demoLogo1.png",
        coachName,
        organizedBy,
        rsvp: rsvp?.status === "notGoing" ? "notGoing" : rsvp ? "going" : null,
        rsvpPlayerId: rsvp?.status === "going" ? rsvp?.player?.id ?? null : null,
        rsvpPlayerName: rsvp?.status === "going" ? rsvp?.player?.name ?? null : null,
        rsvpPlayerFirstName: rsvp?.status === "going" && rsvp?.player?.name
          ? rsvp.player.name.split(" ")[0] ?? rsvp.player.name
          : null,
      };
    });

    return NextResponse.json({ events: formatted });
  } catch (err) {
    console.error("[events] GET", err);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  eventType: z.string().optional(),
  ageGroup: z.string().optional(),
  rinkName: z.string().optional(),
  location: z.string().optional(),
  startAt: z.string().min(1, "Start date is required"),
  endAt: z.string().optional().nullable(),
  websiteLink: z.string().optional(),
  socialMediaLink: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

// POST /api/events - coach creates event
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = (session.user as { role?: string }).role;
    const coachProfileId = (session.user as { coachProfileId?: string | null }).coachProfileId;
    if (role !== "COACH" || !coachProfileId) {
      return NextResponse.json(
        { error: "Only coaches can create events" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const parsed = createEventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const data = parsed.data;

    const startAt = new Date(data.startAt);
    const endAt = data.endAt ? new Date(data.endAt) : null;

    const event = await prisma.event.create({
      data: {
        coachId: coachProfileId,
        title: data.title,
        eventType: data.eventType || null,
        ageGroup: data.ageGroup || null,
        rinkName: data.rinkName || null,
        location: data.location || null,
        startAt,
        endAt,
        websiteLink: data.websiteLink?.trim() || null,
        socialMediaLink: data.socialMediaLink?.trim() || null,
        description: data.description?.trim() || null,
        image: data.image?.trim() || null,
      },
    });
    return NextResponse.json({ event }, { status: 201 });
  } catch (err) {
    console.error("[events] POST", err);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}
