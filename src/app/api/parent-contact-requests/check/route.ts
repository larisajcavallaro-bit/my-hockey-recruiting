import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// GET /api/parent-contact-requests/check?targetParentId=&playerId=
// When a parent views another parent's player profile
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ status: "none" });
    }

    const requestingParentId = (session.user as { parentProfileId?: string | null })?.parentProfileId;
    if (!requestingParentId) return NextResponse.json({ status: "none" });

    const { searchParams } = new URL(request.url);
    const targetParentId = searchParams.get("targetParentId");
    const playerId = searchParams.get("playerId");

    if (!targetParentId || !playerId) return NextResponse.json({ status: "none" });

    // If viewing own child, they have access
    if (requestingParentId === targetParentId) {
      return NextResponse.json({ status: "approved", hasAccess: true });
    }

    const req = await prisma.parentContactRequest.findUnique({
      where: {
        requestingParentId_targetParentId_playerId: {
          requestingParentId,
          targetParentId,
          playerId,
        },
      },
    });

    const status = req?.status ?? "none";
    const hasAccess = status === "approved";
    return NextResponse.json({ status, hasAccess });
  } catch (err) {
    console.error("[parent-contact-requests/check]", err);
    return NextResponse.json({ status: "none" });
  }
}
