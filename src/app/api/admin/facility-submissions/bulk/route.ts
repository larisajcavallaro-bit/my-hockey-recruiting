import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";

const rowSchema = z.object({
  facilityName: z.string().min(2).transform((s) => s.trim()),
  address: z.string().min(5).transform((s) => s.trim()),
  city: z.string().min(2).transform((s) => s.trim()),
  zipCode: z.string().min(5).transform((s) => s.trim()),
  phone: z.string().optional().transform((s) => s?.trim() || null),
  website: z.string().optional().transform((s) => s?.trim() || null),
  description: z.string().min(10).transform((s) => s.trim()),
  hours: z.string().optional().transform((s) => s?.trim() || null),
  amenities: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((a) => (Array.isArray(a) ? a : String(a ?? "").split(/[;,]/).map((s) => s.trim()).filter(Boolean))),
});

/** POST - bulk import facility submissions (admin only) */
export async function POST(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    const userId = session?.user?.id;
    if (role !== "ADMIN" || !userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const rows = Array.isArray(body) ? body : body.rows ?? [];

    const results = { created: 0, errors: [] as string[] };

    for (let i = 0; i < rows.length; i++) {
      const parsed = rowSchema.safeParse(rows[i]);
      if (!parsed.success) {
        results.errors.push(`Row ${i + 1}: ${parsed.error.message}`);
        continue;
      }
      const data = parsed.data;
      try {
        await prisma.facilitySubmission.create({
          data: {
            facilityName: data.facilityName,
            address: data.address,
            city: data.city,
            zipCode: data.zipCode,
            phone: data.phone,
            website: data.website,
            description: data.description,
            hours: data.hours,
            amenities: data.amenities ?? [],
            submittedBy: userId,
            status: "pending",
          },
        });
        results.created++;
      } catch (e) {
        results.errors.push(`Row ${i + 1} (${data.facilityName}): ${String(e)}`);
      }
    }

    return NextResponse.json({
      success: true,
      created: results.created,
      errors: results.errors,
      total: rows.length,
    });
  } catch (error) {
    console.error("Admin facility submissions bulk import error:", error);
    return NextResponse.json(
      { error: "Failed to import facility submissions" },
      { status: 500 }
    );
  }
}
