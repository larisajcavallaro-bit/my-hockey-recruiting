/**
 * Replace facility images with correct ones from Static_Lists_businesses_filled.numbers
 * Uses images extracted by ROW from the "Photo to Use" column.
 *
 * Set ALPHABETICAL_MAPPING=true if the spreadsheet is sorted A-Z (same as the site).
 * Then we assign by position: 1st facility A-Z gets 1st image A-Z, etc.
 *
 * Prerequisite: Run the Python extraction first:
 *   python3 scripts/extract-facility-images-from-numbers.py
 *
 * Run: npm run update:facility-images
 */
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const IMAGES_DIR = path.join(process.cwd(), "scripts", "facility-images-by-row");
const OUTPUT_DIR = path.join(process.cwd(), "public", "newasset", "facilities", "card");
const ALPHABETICAL_MAPPING = process.env.ALPHABETICAL_MAPPING === "true";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    || "facility";
}

/** Normalize name for matching (handles O' vs O-, trailing spaces) */
function norm(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/['']/g, "-")
    .replace(/\s+/g, " ");
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(
      "Images not found. First run the Python extraction:\n" +
      "  python3 scripts/extract-facility-images-from-numbers.py"
    );
    process.exit(1);
  }

  const prisma = new PrismaClient();

  const imageFiles = fs.readdirSync(IMAGES_DIR)
    .filter((f) => f.endsWith(".png") && f.startsWith("row"))
    .sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ""), 10) || 0;
      const numB = parseInt(b.replace(/\D/g, ""), 10) || 0;
      return numA - numB;
    });

  console.log(`Found ${imageFiles.length} images in facility-images-by-row/`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const approvedFacilities = await prisma.facilitySubmission.findMany({
    where: { status: "approved" },
    select: { id: true, facilityName: true, slug: true, imageUrl: true },
    orderBy: { facilityName: "asc" },
  });

  const nameToFacility = new Map(
    approvedFacilities.map((f) => [norm(f.facilityName), f])
  );

  let updated = 0;
  let skipped = 0;
  const pairs: { facility: (typeof approvedFacilities)[0]; srcFile: string }[] = [];

  if (ALPHABETICAL_MAPPING) {
    const imagesByAlpha = [...imageFiles]
      .filter((f) => /^row\d+_(.+)\.png$/.test(f))
      .sort((a, b) => {
        const [, nameA] = a.match(/^row\d+_(.+)\.png$/) ?? ["", ""];
        const [, nameB] = b.match(/^row\d+_(.+)\.png$/) ?? ["", ""];
        return norm(nameA).localeCompare(norm(nameB));
      });
    for (let i = 0; i < Math.min(approvedFacilities.length, imagesByAlpha.length); i++) {
      pairs.push({ facility: approvedFacilities[i], srcFile: imagesByAlpha[i] });
    }
    console.log("Using ALPHABETICAL_MAPPING (site order = spreadsheet order)");
  } else {
    for (const imageFile of imageFiles) {
      const match = imageFile.match(/^row\d+_(.+)\.png$/);
      if (!match) continue;
      const businessNameFromFile = match[1];
      const facility = nameToFacility.get(norm(businessNameFromFile))
        ?? approvedFacilities.find((f) => norm(f.facilityName) === norm(businessNameFromFile))
        ?? approvedFacilities.find((f) => toSlug(f.facilityName) === toSlug(businessNameFromFile));
      if (facility) pairs.push({ facility, srcFile: imageFile });
      else { console.log(`Skip: No facility for "${businessNameFromFile}"`); skipped++; }
    }
  }

  for (const { facility, srcFile } of pairs) {
    const srcPath = path.join(IMAGES_DIR, srcFile);
    const baseSlug = facility.slug || toSlug(facility.facilityName);
    const destFilename = `${baseSlug}.png`;
    const destPath = path.join(OUTPUT_DIR, destFilename);

    try {
      fs.copyFileSync(srcPath, destPath);
      const imageUrl = `/newasset/facilities/card/${destFilename}`;

      await prisma.facilitySubmission.update({
        where: { id: facility.id },
        data: { imageUrl },
      });

      console.log(`Updated: ${facility.facilityName} -> ${imageUrl}`);
      updated++;
    } catch (e) {
      console.error(`Failed: ${facility.facilityName}`, e);
    }
  }

  console.log(`\nDone. Updated ${updated}, skipped ${skipped}.`);
  await prisma.$disconnect();
}

main();
