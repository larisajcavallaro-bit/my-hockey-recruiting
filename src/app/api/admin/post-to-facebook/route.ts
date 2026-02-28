import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { notifyZapier } from "@/lib/zapier";

export const dynamic = "force-dynamic";

const schema = z.object({
  message: z.string().min(1, "Message required"),
  link: z.string().url().optional(),
  title: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

/**
 * POST - Send post content to Zapier for Facebook.
 * Requires ZAPIER_WEBHOOK_URL and a Zap with Filter: event = "facebook_post" → Facebook Create Post.
 */
export async function POST(request: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!process.env.ZAPIER_WEBHOOK_URL) {
    return NextResponse.json(
      { error: "Facebook posting not configured. Set ZAPIER_WEBHOOK_URL." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const data = schema.parse(body);
    const imageUrl = data.imageUrl && data.imageUrl !== "" ? data.imageUrl : undefined;

    notifyZapier("facebook_post", {
      message: data.message.trim(),
      link: data.link?.trim(),
      title: data.title?.trim(),
      imageUrl,
    });

    return NextResponse.json({
      success: true,
      message: "Post sent to Zapier. It will post to Facebook when your Zap runs.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
