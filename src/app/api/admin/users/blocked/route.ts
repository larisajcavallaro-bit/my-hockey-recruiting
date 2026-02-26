import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET - list blocked emails (admin only) */
export async function GET() {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const blocked = await prisma.blockedEmail.findMany({
      orderBy: { blockedAt: "desc" },
    });
    const emails = blocked.map((b) => b.email);

    return NextResponse.json({ emails, blocked });
  } catch (error) {
    console.error("Blocked emails error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blocked emails" },
      { status: 500 }
    );
  }
}
