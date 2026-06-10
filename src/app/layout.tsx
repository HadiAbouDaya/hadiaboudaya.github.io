import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import MotionProvider from "@/components/animations/MotionProvider";
import { SkipToContent } from "@/components/ui/SkipToContent";
import { getAllPostSearchItems } from "@/lib/mdx";

import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Hadi Abou Daya | AI/ML Consultant & Software Engineer",
    template: "%s | Hadi Abou Daya",
  },
  description:
    "Hadi Abou Daya, AI/ML Engineer & Consultant in Paris. LLM agents, cloud architecture & orchestration, computer vision. Azure & AWS certified. Let's talk.",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Hadi Abou Daya",
    images: [
      { url: "/Media/branding/og-default.jpg", width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/Media/branding/og-default.jpg"],
  },
  verification: {
    google: "-8FTmhn4B2a5yeiFTgf6BUxDDoiu3NVZVmUAbnBYVts",
  },
  alternates: {
    canonical: "/",
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||(!t&&window.matchMedia("(prefers-color-scheme:light)").matches)){return}document.documentElement.classList.add("dark")}catch(e){document.documentElement.classList.add("dark")}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const blogPosts = getAllPostSearchItems();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans bg-surface text-fg antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <MotionProvider>
            <SkipToContent />
            <Navbar blogPosts={blogPosts} />
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
