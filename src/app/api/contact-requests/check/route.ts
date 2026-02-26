import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// GET /api/contact-requests/check?coachProfileId=&parentProfileId=&playerId=
// Returns { hasAccess: boolean } - whether the current user can see the other party's contact info
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const coachProfileId = searchParams.get("coachProfileId");
    const parentProfileId = searchParams.get("parentProfileId");
    const playerId = searchParams.get("playerId"); // optional, for coach->parent

    const viewerParentId = (session.user as { parentProfileId?: string | null })?.parentProfileId;
    const viewerCoachId = (session.user as { coachProfileId?: string | null })?.coachProfileId;

    if (!coachProfileId || !parentProfileId) {
      return NextResponse.json({ hasAccess: false });
    }

    const isViewerCoach = viewerCoachId === coachProfileId;
    const isViewerParent = viewerParentId === parentProfileId;
    if (!isViewerCoach && !isViewerParent) {
      return NextResponse.json({ hasAccess: false });
    }

    const contactReq = await prisma.contactRequest.findFirst({
      where: {
        coachProfileId,
        parentProfileId,
        playerId: playerId || null,
      },
      orderBy: { createdAt: "desc" },
    });

    const hasAccess = contactReq?.status === "approved";
    const status = contactReq ? contactReq.status : "none";
    return NextResponse.json({ hasAccess, status });
  } catch (err) {
    console.error("[contact-requests/check] GET", err);
    return NextResponse.json({ hasAccess: false });
  }
}
