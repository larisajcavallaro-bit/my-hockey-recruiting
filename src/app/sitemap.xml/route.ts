import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  return "https://myhockeyrecruiting.com";
};

export async function GET() {
  const base = getBaseUrl();

  const staticUrls = [
    { loc: base, lastmod: new Date().toISOString().slice(0, 10), priority: "1.0", changefreq: "weekly" },
    { loc: `${base}/facilities`, lastmod: new Date().toISOString().slice(0, 10), priority: "0.9", changefreq: "weekly" },
    { loc: `${base}/training`, lastmod: new Date().toISOString().slice(0, 10), priority: "0.9", changefreq: "weekly" },
    { loc: `${base}/teams-and-schools`, lastmod: new Date().toISOString().slice(0, 10), priority: "0.9", changefreq: "weekly" },
    { loc: `${base}/blog`, lastmod: new Date().toISOString().slice(0, 10), priority: "0.8", changefreq: "weekly" },
    { loc: `${base}/about-us`, lastmod: new Date().toISOString().slice(0, 10), priority: "0.7", changefreq: "monthly" },
    { loc: `${base}/contact-us`, lastmod: new Date().toISOString().slice(0, 10), priority: "0.7", changefreq: "monthly" },
    { loc: `${base}/subscription`, lastmod: new Date().toISOString().slice(0, 10), priority: "0.8", changefreq: "monthly" },
    { loc: `${base}/privacy-policy`, lastmod: new Date().toISOString().slice(0, 10), priority: "0.4", changefreq: "yearly" },
    { loc: `${base}/terms-of-service`, lastmod: new Date().toISOString().slice(0, 10), priority: "0.4", changefreq: "yearly" },
  ];

  let urls = [...staticUrls];

  try {
    const [facilities, schools] = await Promise.all([
      prisma.facilitySubmission.findMany({
        where: { status: "approved", slug: { not: null } },
        select: { slug: true, createdAt: true },
      }),
      prisma.schoolSubmission.findMany({
        where: { status: "approved", slug: { not: null } },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const facilityEntries = facilities.map((f) => ({
      loc: `${base}/facilities/${f.slug}`,
      lastmod: f.createdAt.toISOString().slice(0, 10),
      priority: "0.7",
      changefreq: "monthly",
    }));
    const trainingEntries = facilities.map((f) => ({
      loc: `${base}/training/${f.slug}`,
      lastmod: f.createdAt.toISOString().slice(0, 10),
      priority: "0.7",
      changefreq: "monthly",
    }));
    const schoolEntries = schools.map((s) => ({
      loc: `${base}/teams-and-schools/${s.slug}`,
      lastmod: s.updatedAt.toISOString().slice(0, 10),
      priority: "0.7",
      changefreq: "monthly",
    }));

    urls = [...staticUrls, ...facilityEntries, ...trainingEntries, ...schoolEntries];
  } catch {
    // Keep static URLs only
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
