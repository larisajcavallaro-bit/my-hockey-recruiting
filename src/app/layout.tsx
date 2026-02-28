import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import SessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";

// Load Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // include common weights
  variable: "--font-poppins",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXTAUTH_URL ??
  "https://myhockeyrecruiting.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "My Hockey Recruiting | Youth Hockey Recruiting Platform for Parents & Coaches",
    template: "%s | My Hockey Recruiting",
  },
  description:
    "Connect youth hockey players with college and club coaches. Build your hockey recruiting profile, discover training facilities, find teams and schools, and get noticed. The #1 platform for youth hockey recruiting.",
  keywords: [
    "youth hockey recruiting",
    "hockey recruiting",
    "hockey recruitment",
    "youth hockey",
    "hockey players",
    "college hockey recruiting",
    "hockey coaches",
    "hockey parents",
    "hockey training facilities",
    "hockey teams",
    "hockey schools",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "My Hockey Recruiting",
    title: "My Hockey Recruiting | Youth Hockey Recruiting Platform",
    description:
      "Connect youth hockey players with coaches. Build your recruiting profile, discover training facilities, and get noticed.",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Hockey Recruiting | Youth Hockey Recruiting Platform",
    description:
      "Connect youth hockey players with coaches. Build your recruiting profile and get noticed.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="overflow-x-hidden">
      <body
        className={`${poppins.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden min-w-0`}
      >
        <SessionProvider>
          {children}
          <Toaster richColors position="top-center" />
        </SessionProvider>
      </body>
    </html>
  );
}
