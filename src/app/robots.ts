import type { MetadataRoute } from "next";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  return "https://myhockeyrecruiting.com";
};

export default function robots(): MetadataRoute.Robots {
  const base = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/auth/",
          "/coach-dashboard/",
          "/parent-dashboard/",
          "/admin-dashboard/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
