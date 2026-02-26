import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Hadi Abou Daya | AI Engineer & Consultant",
    template: "%s | Hadi Abou Daya",
  },
  description:
    "AI/ML Engineer & Consultant based in Paris. Building intelligent systems from edge to cloud.",
  metadataBase: new URL("https://hadiaboudaya.github.io"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hadiaboudaya.github.io",
    siteName: "Hadi Abou Daya",
    images: [
      { url: "/Media/branding/og-default.jpg", width: 1200, height: 630 },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans bg-white text-slate-900 antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
