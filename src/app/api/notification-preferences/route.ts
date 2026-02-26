import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  eventReminderSmsEnabled: z.boolean(),
});

/** GET - load parent notification preferences */
export async function GET() {
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
        { status: 400 }
      );
    }

    const parent = await prisma.parentProfile.findUnique({
      where: { id: parentProfileId },
      select: { eventReminderSmsEnabled: true },
    });
    if (!parent) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      eventReminderSmsEnabled: parent.eventReminderSmsEnabled,
    });
  } catch (err) {
    console.error("[notification-preferences] GET", err);
    return NextResponse.json(
      { error: "Failed to load preferences" },
      { status: 500 }
    );
  }
}

/** PATCH - save parent notification preferences */
export async function PATCH(request: Request) {
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
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await prisma.parentProfile.update({
      where: { id: parentProfileId },
      data: {
        eventReminderSmsEnabled: parsed.data.eventReminderSmsEnabled,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[notification-preferences] PATCH", err);
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    );
  }
}
