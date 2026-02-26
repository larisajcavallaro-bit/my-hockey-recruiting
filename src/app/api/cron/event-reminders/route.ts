/**
 * Cron: Event reminders — sends SMS 24h before events to parents who RSVP'd "going".
 * Vercel cron hits this route. Requires CRON_SECRET in env.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendSms } from "@/lib/sms";
import { format } from "date-fns";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function ensureE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return phone.startsWith("+") ? phone : `+${digits}`;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    // Window: events starting between 23h and 25h from now
    const windowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const rsvps = await prisma.eventRsvp.findMany({
      where: {
        status: "going",
        playerId: { not: null },
        parent: {
          eventReminderSmsEnabled: true,
          phone: { not: null },
        },
        event: {
          startAt: {
            gte: windowStart,
            lte: windowEnd,
          },
        },
      },
      include: {
        event: true,
        parent: { select: { id: true, phone: true } },
        player: { select: { name: true } },
      },
    });

    const alreadySent = await prisma.eventReminderSent.findMany({
      where: {
        eventRsvpId: { in: rsvps.map((r) => r.id) },
      },
      select: { eventRsvpId: true },
    });
    const sentSet = new Set(alreadySent.map((s) => s.eventRsvpId));

    const toSend = rsvps.filter((r) => !sentSet.has(r.id));
    let sent = 0;
    let failed = 0;

    for (const rsvp of toSend) {
      const phone = rsvp.parent?.phone?.trim();
      if (!phone || !rsvp.player?.name) continue;

      const event = rsvp.event;
      const childName = rsvp.player.name;
      const eventTitle = event.title;
      const startStr = format(event.startAt, "EEEE, MMM d 'at' h:mm a");
      const location = [event.rinkName, event.location].filter(Boolean).join(", ") || "See event details";
      const msg = `Reminder: You RSVP'd ${childName} to ${eventTitle} (${startStr}) at ${location}.`;

      const ok = await sendSms(ensureE164(phone), msg);
      if (ok) {
        await prisma.eventReminderSent.create({
          data: { eventRsvpId: rsvp.id },
        });
        sent++;
      } else {
        failed++;
      }
    }

    return NextResponse.json({
      ok: true,
      sent,
      failed,
      total: toSend.length,
    });
  } catch (err) {
    console.error("[cron/event-reminders]", err);
    return NextResponse.json(
      { error: "Event reminders cron failed" },
      { status: 500 }
    );
  }
}
