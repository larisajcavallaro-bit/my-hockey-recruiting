import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "My Hockey Recruiting",
  description: "Youth hockey recruiting platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${poppins.variable} font-sans antialiased bg-background text-foreground`}
      >
        <SessionProvider>
          {children}
          <Toaster richColors position="top-center" />
        </SessionProvider>
      </body>
    </html>
  );
}
