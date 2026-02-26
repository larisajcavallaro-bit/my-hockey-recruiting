import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** POST - unblock an email (admin only). */
export async function POST(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const email = (body?.email ?? "").toString().trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    await prisma.blockedEmail.deleteMany({ where: { email } });

    return NextResponse.json({ ok: true, unblocked: email });
  } catch (error) {
    console.error("Unblock email error:", error);
    return NextResponse.json(
      { error: "Failed to unblock email" },
      { status: 500 }
    );
  }
}
