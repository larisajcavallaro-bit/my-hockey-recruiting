/**
 * Load teams and schools from 1MHR_All_Teams_Expanded.csv into SchoolSubmission.
 * Marks each as "school" or "team" based on name/league patterns.
 * Run: npm run load-teams
 */
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseAddress(addr: string): { address: string; city: string; zipCode: string } {
  const raw = (addr || "").trim();
  if (!raw) return { address: "Address TBD", city: "TBD", zipCode: "00000" };

  // Full: "55 Locust St, Woburn, MA 01801" or "15 Hillside Ave, Berlin, NH 03570"
  const fullMatch = raw.match(/^(.+),\s*([^,]+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/);
  if (fullMatch)
    return { address: fullMatch[1].trim(), city: fullMatch[2].trim(), zipCode: fullMatch[4] };

  // "Address City ST 12345" (no comma) e.g. "65 North St Canton MA 02021"
  const endMatch = raw.match(/\s+([A-Z]{2})\s+(\d{5})$/);
  if (endMatch) {
    const before = raw.slice(0, -endMatch[0].length).trim();
    const lastSpace = before.lastIndexOf(" ");
    if (lastSpace > 0) {
      return {
        address: before.slice(0, lastSpace).trim(),
        city: before.slice(lastSpace + 1).trim(),
        zipCode: endMatch[2],
      };
    }
  }

  // "City ST" or "City ST 12345" e.g. "Berlin NH", "Concord NH", "Portland, ME"
  const cityStateZip = raw.match(/^(.+?),?\s*([A-Z]{2})\s*(\d{5})?$/);
  if (cityStateZip)
    return {
      address: raw,
      city: cityStateZip[1].trim(),
      zipCode: cityStateZip[3] || "00000",
    };

  // "Town ST" e.g. "Hanover NH", "Lovell ME"
  const townState = raw.match(/^([^,\d]+)\s+([A-Z]{2})$/);
  if (townState)
    return { address: raw, city: townState[1].trim(), zipCode: "00000" };

  // Multi-location: "Massachusetts", "Canton/Bridgewater/Foxboro MA"
  return { address: raw, city: raw.split("/")[0].trim() || "TBD", zipCode: "00000" };
}

function isSchool(row: Record<string, string>): boolean {
  const name = (row["Team Name"] || "").toLowerCase();
  const leagues = `${row["Boys Leagues"] || ""} ${row["Girls Leagues"] || ""}`.toLowerCase();
  if (
    name.includes("school") ||
    name.includes("academy") ||
    name.includes(" prep") ||
    name.includes("abbey") ||
    leagues.includes("nepsac") ||
    leagues.includes("isl") ||
    leagues.includes("prep") ||
    leagues.includes("faa")
  )
    return true;
  return false;
}

function parseLeagues(s: string): string[] {
  if (!s || !s.trim()) return [];
  return s
    .split(/[,;]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function parseAgeBrackets(boysAges: string, girlsAges: string): { from: string | null; to: string | null } {
  const ages = `${boysAges || ""} ${girlsAges || ""}`;
  const uMatch = ages.match(/U(\d+)/g);
  if (!uMatch || uMatch.length === 0) return { from: null, to: null };
  const nums = uMatch.map((x) => parseInt(x.replace("U", ""), 10));
  const from = Math.min(...nums);
  const to = Math.max(...nums);
  return { from: `U${from}`, to: `U${to}` };
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let j = 0; j < line.length; j++) {
    const c = line[j];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (inQuotes) {
      cur += c;
    } else if (c === ",") {
      values.push(cur.replace(/^"|"$/g, "").trim());
      cur = "";
    } else {
      cur += c;
    }
  }
  values.push(cur.replace(/^"|"$/g, "").trim());
  return values;
}

function parseCsv(content: string): Record<string, string>[] {
  const lines = content.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = (values[idx] || "").trim();
    });
    if (row["Team Name"]) rows.push(row);
  }
  return rows;
}

async function main() {
  const csvPath = path.join(process.cwd(), "docs", "1MHR_All_Teams_Expanded.csv");
  const content = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCsv(content);
  console.log(`Loaded ${rows.length} rows from CSV`);

  let added = 0;
  let updated = 0;

  for (const row of rows) {
    const name = row["Team Name"]?.trim();
    if (!name) continue;

    const slug = toSlug(name);
    const type = isSchool(row) ? "school" : "team";
    const { address, city, zipCode } = parseAddress(row["Address"] || "");
    const phone = row["Phone #"]?.trim() || null;
    const boysWebsite = row["Boys Website"]?.trim() || null;
    const girlsWebsite = row["Girls Website"]?.trim() || null;
    const boysLeagues = parseLeagues(row["Boys Leagues"] || "");
    const girlsLeagues = parseLeagues(row["Girls Leagues"] || "");
    const allLeagues = [...new Set([...boysLeagues, ...girlsLeagues])];
    const { from: ageFrom, to: ageTo } = parseAgeBrackets(
      row["Boys Ages"] || "",
      row["Girls Ages"] || ""
    );

    const hasBoys = !!(boysWebsite || boysLeagues.length);
    const hasGirls = !!(girlsWebsite || girlsLeagues.length);
    const gender: string[] = [];
    if (hasBoys) gender.push("Male");
    if (hasGirls) gender.push("Female");
    if (gender.length === 0) gender.push("Co-ed");

    const description =
      type === "school"
        ? `Prep school hockey program. You can update this description in Admin → Schools.`
        : `Youth hockey program. You can update this description in Admin → Schools.`;

    // Logos: CSV has "team-logos/logo-XXX.png" — copied to public/newasset/teams/ and served at /newasset/teams/
    const logoPath = row["Logo"]?.trim();
    const imageUrl: string | null =
      logoPath && logoPath.startsWith("team-logos/")
        ? `/newasset/teams/${logoPath
            .replace("team-logos/", "")
            .toLowerCase()
            .replace(/-+/g, "-")}` // normalize double hyphens (e.g. Jr.) to single
        : null;

    const data = {
      type,
      name,
      address,
      city,
      zipCode,
      phone,
      description,
      status: "approved" as const,
      slug,
      imageUrl,
      gender,
      league: allLeagues,
      boysWebsite,
      girlsWebsite,
      boysLeague: boysLeagues,
      girlsLeague: girlsLeagues,
      ageBracketFrom: ageFrom,
      ageBracketTo: ageTo,
    };

    try {
      const existing = await prisma.schoolSubmission.findUnique({ where: { slug } });
      if (existing) {
        await prisma.schoolSubmission.update({
          where: { slug },
          data: {
            type: data.type,
            name: data.name,
            address: data.address,
            city: data.city,
            zipCode: data.zipCode,
            phone: data.phone,
            description: data.description,
            status: data.status,
            imageUrl: data.imageUrl,
            gender: data.gender,
            league: data.league,
            boysWebsite: data.boysWebsite,
            girlsWebsite: data.girlsWebsite,
            boysLeague: data.boysLeague,
            girlsLeague: data.girlsLeague,
            ageBracketFrom: data.ageBracketFrom,
            ageBracketTo: data.ageBracketTo,
          },
        });
        updated++;
      } else {
        await prisma.schoolSubmission.create({ data });
        added++;
      }
    } catch (err) {
      console.error(`Failed for ${name} (${slug}):`, (err as Error).message);
    }
  }

  console.log(`Done. Added: ${added}, Updated: ${updated}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
