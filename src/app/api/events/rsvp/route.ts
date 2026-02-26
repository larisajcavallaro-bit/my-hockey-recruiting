import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const bodySchema = z.object({
  eventId: z.string().min(1),
  playerId: z.string().min(1).optional(),
  status: z.enum(["going", "notGoing"]),
});

// POST /api/events/rsvp - create or update RSVP
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parentProfileId = (session.user as { parentProfileId?: string | null })
      ?.parentProfileId;
    if (!parentProfileId) {
      return NextResponse.json(
        { error: "Parent profile required" },
        { status: 400 },
      );
    }

    const raw = await request.json();
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { eventId, playerId, status } = parsed.data;

    if (status === "notGoing") {
      await prisma.eventRsvp.upsert({
        where: {
          eventId_parentProfileId: { eventId, parentProfileId },
        },
        create: {
          eventId,
          parentProfileId,
          playerId: null,
          status: "notGoing",
        },
        update: { playerId: null, status: "notGoing" },
      });
      return NextResponse.json({ ok: true, rsvp: { status: "notGoing" } });
    }

    // going - require playerId
    if (!playerId) {
      return NextResponse.json(
        { error: "playerId required when going" },
        { status: 400 },
      );
    }

    // Verify player belongs to this parent
    const player = await prisma.player.findFirst({
      where: {
        id: playerId,
        parentId: parentProfileId,
      },
    });
    if (!player) {
      return NextResponse.json(
        { error: "Player not found or not yours" },
        { status: 404 },
      );
    }

    // Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await prisma.eventRsvp.upsert({
      where: {
        eventId_parentProfileId: { eventId, parentProfileId },
      },
      create: {
        eventId,
        parentProfileId,
        playerId,
        status: "going",
      },
      update: { playerId, status: "going" },
    });

    return NextResponse.json({
      ok: true,
      rsvp: { eventId, playerId, playerName: player.name },
    });
  } catch (err) {
    console.error("[events/rsvp] POST", err);
    return NextResponse.json(
      { error: "Failed to update RSVP" },
      { status: 500 },
    );
  }
}
