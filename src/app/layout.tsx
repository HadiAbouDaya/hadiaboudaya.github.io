import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { SkipToContent } from "@/components/ui/SkipToContent";

import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Hadi Abou Daya | AI Engineer & Consultant",
    template: "%s | Hadi Abou Daya",
  },
  description:
    "Hadi Abou Daya, AI/ML Engineer & Consultant in Paris. Specializing in LLM agents, computer vision, and cloud-scale AI systems. AWS & Azure certified.",
  metadataBase: new URL("https://hadi.aboudaya.com"),
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hadi.aboudaya.com",
    siteName: "Hadi Abou Daya",
    images: [
      { url: "/Media/branding/og-default.jpg", width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hadi Abou Daya | AI Engineer & Consultant",
    description:
      "Hadi Abou Daya, AI/ML Engineer & Consultant in Paris. Specializing in LLM agents, computer vision, and cloud-scale AI systems. AWS & Azure certified.",
    images: ["/Media/branding/og-default.jpg"],
  },
  verification: {
    google: "-8FTmhn4B2a5yeiFTgf6BUxDDoiu3NVZVmUAbnBYVts",
  },
  alternates: {
    canonical: "/",
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme:dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 antialiased">
        <ThemeProvider>
          <SkipToContent />
          <Navbar />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
