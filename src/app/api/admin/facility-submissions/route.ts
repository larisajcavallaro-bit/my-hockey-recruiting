import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET - list facility submissions (admin only) */
export async function GET(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // pending | approved | rejected | null

    const where =
      status && ["pending", "approved", "rejected", "removed"].includes(status)
        ? { status }
        : {};

    const submissions = await prisma.facilitySubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Admin facility submissions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch facility submissions" },
      { status: 500 }
    );
  }
}
