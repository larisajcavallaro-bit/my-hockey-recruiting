import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const submitSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  zipCode: z.string().min(5),
  phone: z.string().optional(),
  website: z.string().url().or(z.literal("")),
  description: z.string().min(10),
});

/** POST - submit new school/program request (anyone) */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = submitSchema.parse(body);

    const session = await auth();
    const submittedBy = session?.user?.id ?? null;

    await prisma.schoolSubmission.create({
      data: {
        name: data.name.trim(),
        address: data.address.trim(),
        city: data.city.trim(),
        zipCode: data.zipCode.trim(),
        phone: data.phone?.trim() || null,
        website: data.website?.trim() || null,
        description: data.description.trim(),
        submittedBy,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    console.error("School submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit" },
      { status: 500 }
    );
  }
}
