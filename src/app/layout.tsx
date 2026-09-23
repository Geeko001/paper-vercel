import type { Metadata } from "next";
import { Instrument_Serif, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSessionUser } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site";
import { GuestProvider } from "@/components/account/GuestProvider";
import { Analytics } from "@vercel/analytics/next";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GEEK — Aashirwad Sharma tinkers and writes",
    template: "%s — GEEK",
  },
  description:
    "AI, Computer Science, Finance and numbers — written down simply as I tinker and learn. Personal notebook by Aashirwad Sharma.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "GEEK — Aashirwad Sharma tinkers and writes",
    description:
      "AI, Computer Science, Finance and numbers — written down simply as I tinker and learn.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GEEK — Aashirwad Sharma tinkers and writes",
    description:
      "AI, Computer Science, Finance and numbers — written down simply as I tinker and learn.",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getSessionUser();

  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-inverse focus:px-3 focus:py-2 focus:text-inverse-foreground"
        >
          Skip to content
        </a>
        <GuestProvider>
          <Header
            user={
              user?.email
                ? {
                    email: user.email,
                    initial: user.email.slice(0, 1).toUpperCase(),
                  }
                : null
            }
          />
          <main id="main" className="flex flex-1 flex-col">
            {children}
          </main>
        </GuestProvider>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
