import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { format } from "date-fns";

// GET /api/events/upcoming - for coaches: events they created; for parents: events they RSVP'd "going" to
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parentProfileId = (session.user as { parentProfileId?: string | null })
      ?.parentProfileId;
    const coachProfileId = (session.user as { coachProfileId?: string | null })
      ?.coachProfileId;

    // Coach: events they created that are upcoming (Events Management only)
    if (coachProfileId) {
      const coachEvents = await prisma.event.findMany({
        where: {
          coachId: coachProfileId,
          startAt: { gte: new Date() },
          id: { not: { startsWith: "seed-" } },
        },
        include: {
          rsvps: { where: { status: "going" } },
        },
        orderBy: { startAt: "asc" },
      });

      const events = coachEvents.map((e) => ({
        id: e.id,
        title: e.title,
        date: format(e.startAt, "MMM d, yyyy"),
        time: format(e.startAt, "h:mm a"),
        rinkName: e.rinkName ?? undefined,
        location: e.location ?? "",
        attending: e.rsvps.length,
        person: "—",
        status: "Upcoming",
      }));

      return NextResponse.json({ events, count: events.length });
    }

    // Parent: events they've RSVP'd "going" to that are upcoming
    if (!parentProfileId) {
      return NextResponse.json({ events: [], count: 0 });
    }

    const rsvps = await prisma.eventRsvp.findMany({
      where: {
        parentProfileId,
        status: "going",
        event: {
          startAt: { gte: new Date() },
          id: { not: { startsWith: "seed-" } },
        },
      },
      include: {
        event: true,
        player: { select: { id: true, name: true } },
      },
      orderBy: { event: { startAt: "asc" } },
    });

    const events = rsvps.map((r) => ({
      id: r.event.id,
      title: r.event.title,
      date: format(r.event.startAt, "MMM d, yyyy"),
      person: r.player?.name ?? "—",
      status: "Confirmed",
    }));

    return NextResponse.json({ events, count: events.length });
  } catch (err) {
    console.error("[events/upcoming] GET", err);
    return NextResponse.json(
      { error: "Failed to fetch upcoming events" },
      { status: 500 },
    );
  }
}
