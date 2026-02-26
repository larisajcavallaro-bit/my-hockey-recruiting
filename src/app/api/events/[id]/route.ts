import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  eventType: z.string().optional().nullable(),
  ageGroup: z.string().optional().nullable(),
  rinkName: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  startAt: z.string().optional(),
  endAt: z.string().optional().nullable(),
  websiteLink: z.string().optional().nullable(),
  socialMediaLink: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

// GET - fetch single event (for edit form)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: { rsvps: true },
    });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    const coachProfileId = (session.user as { coachProfileId?: string | null }).coachProfileId;
    if (event.coachId && event.coachId !== coachProfileId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({
      ...event,
      startAt: event.startAt.toISOString(),
      endAt: event.endAt?.toISOString() ?? null,
    });
  } catch (err) {
    console.error("[events/:id] GET", err);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

// PATCH - update event (coach only, own events)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const coachProfileId = (session.user as { coachProfileId?: string | null }).coachProfileId;
    if (!coachProfileId) {
      return NextResponse.json(
        { error: "Only coaches can update events" },
        { status: 403 }
      );
    }
    const { id } = await params;
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    if (existing.coachId !== coachProfileId) {
      return NextResponse.json({ error: "You can only edit your own events" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateEventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.eventType !== undefined) updateData.eventType = data.eventType || null;
    if (data.ageGroup !== undefined) updateData.ageGroup = data.ageGroup || null;
    if (data.rinkName !== undefined) updateData.rinkName = data.rinkName || null;
    if (data.location !== undefined) updateData.location = data.location || null;
    if (data.websiteLink !== undefined) updateData.websiteLink = data.websiteLink?.trim() || null;
    if (data.socialMediaLink !== undefined) updateData.socialMediaLink = data.socialMediaLink?.trim() || null;
    if (data.description !== undefined) updateData.description = data.description || null;
    if (data.image !== undefined) updateData.image = data.image || null;
    if (data.startAt !== undefined) updateData.startAt = new Date(data.startAt);
    if (data.endAt !== undefined) updateData.endAt = data.endAt ? new Date(data.endAt) : null;

    const event = await prisma.event.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.event.update>[0]["data"],
    });
    return NextResponse.json({ event });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[events/:id] PATCH", err);
    return NextResponse.json(
      { error: "Failed to update event", detail: message },
      { status: 500 }
    );
  }
}
