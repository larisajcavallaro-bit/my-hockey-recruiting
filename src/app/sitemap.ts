import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  return "https://myhockeyrecruiting.com";
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/facilities`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/training`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/teams-and-schools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/subscription`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/terms-of-service`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  ];

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

    const facilityUrls: MetadataRoute.Sitemap = facilities.map((f) => ({
      url: `${base}/facilities/${f.slug}`,
      lastModified: f.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const trainingUrls: MetadataRoute.Sitemap = facilities.map((f) => ({
      url: `${base}/training/${f.slug}`,
      lastModified: f.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const schoolUrls: MetadataRoute.Sitemap = schools.map((s) => ({
      url: `${base}/teams-and-schools/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [...staticPages, ...facilityUrls, ...trainingUrls, ...schoolUrls];
  } catch {
    return staticPages;
  }
}
