import { NextResponse } from "next/server";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  return "https://myhockeyrecruiting.com";
};

export function GET() {
  const base = getBaseUrl();

  const txt = `User-agent: *
Allow: /
Disallow: /auth/
Disallow: /coach-dashboard/
Disallow: /parent-dashboard/
Disallow: /admin-dashboard/

Sitemap: ${base}/sitemap.xml
`;

  return new NextResponse(txt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
    },
  });
}
