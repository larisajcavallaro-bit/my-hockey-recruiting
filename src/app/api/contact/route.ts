import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { notifyZapier } from "@/lib/zapier";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  topic: z.string().min(1, "Topic is required"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

function jsonError(error: string, status: number, details?: unknown) {
  return NextResponse.json(
    details ? { error, details } : { error },
    { status, headers: { "Content-Type": "application/json" } }
  );
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const data = contactSchema.parse(body);

    const msg = await prisma.contactMessage.create({
      data: {
        userId: session?.user?.id ?? null,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        topic: data.topic,
        message: data.message,
      },
    });

    notifyZapier("contact_message", {
      id: msg.id,
      firstName: msg.firstName,
      lastName: msg.lastName,
      email: msg.email,
      topic: msg.topic,
      message: msg.message,
      createdAt: msg.createdAt.toISOString(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      const message = firstIssue ? firstIssue.message : "Please check all fields.";
      return jsonError(message, 400);
    }
    console.error("Contact form error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return jsonError(
      msg || "Failed to send message",
      500,
      process.env.NODE_ENV === "development" ? msg : undefined
    );
  }
}
