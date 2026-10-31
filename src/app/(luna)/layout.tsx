import type { Metadata } from "next";
import MotionProvider from "@/components/animations/MotionProvider";
import { VaultProvider } from "@/components/luna/VaultProvider";
import { LUNA_CONTENT_SECURITY_POLICY } from "@/lib/security";
import "./private.css";

export const metadata: Metadata = {
  title: { default: "A little space", template: "%s" },
  description: "An encrypted personal space.",
  metadataBase: new URL("https://hadi.aboudaya.com"),
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  referrer: "no-referrer",
  icons: { icon: "/luna-mark.svg" },
};

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Security-Policy" content={LUNA_CONTENT_SECURITY_POLICY} />
      </head>
      <body className="private-space">
        <a className="private-skip" href="#private-content">Skip to content</a>
        <MotionProvider>
          <VaultProvider>
            <main id="private-content" tabIndex={-1}>{children}</main>
          </VaultProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
