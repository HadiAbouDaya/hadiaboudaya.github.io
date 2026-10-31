import { DEFAULT_OPEN_GRAPH, DEFAULT_TWITTER } from "@/lib/metadata";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import MotionProvider from "@/components/animations/MotionProvider";
import { SkipToContent } from "@/components/ui/SkipToContent";
import { getSearchIndex } from "@/lib/search-index";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/theme";
import { CONTENT_SECURITY_POLICY } from "@/lib/security";
import { PortfolioAnalytics } from "@/components/analytics/PortfolioAnalytics";

import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Hadi Abou Daya | AI Consultant & Software Engineer",
    template: "%s | Hadi Abou Daya",
  },
  description:
    "Hadi Abou Daya, AI Consultant & Software Engineer in Paris. Client discovery, AI architecture and hands-on delivery, from enterprise knowledge to production agents.",
  metadataBase: new URL("https://hadi.aboudaya.com"),
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large" as const,
    "max-video-preview": -1,
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  referrer: "strict-origin-when-cross-origin",
  openGraph: { ...DEFAULT_OPEN_GRAPH, url: "/" },
  twitter: DEFAULT_TWITTER,
  verification: {
    google: "-8FTmhn4B2a5yeiFTgf6BUxDDoiu3NVZVmUAbnBYVts",
  },
  alternates: {
    canonical: "/",
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { contentRevision } = getSearchIndex();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        {/* GitHub Pages cannot send HTTP headers; deliver the CSP as a
            meta tag. Full header set lives in public/_headers. */}
        <meta httpEquiv="Content-Security-Policy" content={CONTENT_SECURITY_POLICY} />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className="font-sans bg-surface text-fg antialiased min-h-screen flex flex-col">
        <PortfolioAnalytics />
        <ThemeProvider>
          <MotionProvider>
            <SkipToContent />
            <Navbar contentRevision={contentRevision} />
            <main id="main-content" tabIndex={-1} className="flex-1">
              {children}
            </main>
            <Footer />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
