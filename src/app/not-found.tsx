import { LUNA_CONTENT_SECURITY_POLICY } from "@/lib/security";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <meta httpEquiv="Content-Security-Policy" content={LUNA_CONTENT_SECURITY_POLICY} />
      <main style={{ minHeight: "100svh", display: "grid", placeItems: "center", padding: "2rem", fontFamily: "system-ui, sans-serif", color: "#243546", background: "#e9eef6" }}>
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <p style={{ fontSize: "1rem" }}>404</p>
          <h1 style={{ fontSize: "2rem", fontWeight: 500 }}>Page not found</h1>
          <p style={{ lineHeight: 1.7 }}>Check the address and try again.</p>
          <Link href="/" style={{ display: "inline-block", color: "inherit", padding: ".8rem" }}>Go home</Link>
        </div>
      </main>
    </>
  );
}
