import { ImageResponse } from "next/og";
import { createElement as h } from "react";
import { PROFILE } from "@/data/profile";

export const dynamic = "force-static";
export function GET() {
  return new ImageResponse(h("div", { style: { width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px", background: "#081626", color: "#fff", fontFamily: "sans-serif" } },
    h("div", { style: { fontSize: 24, color: "#7dd3fc", letterSpacing: 5, marginBottom: 36 } }, "PARIS, FRANCE"),
    h("div", { style: { fontSize: 76, fontWeight: 700, marginBottom: 24 } }, PROFILE.name),
    h("div", { style: { fontSize: 44, color: "#93c5fd", marginBottom: 35 } }, "AI Consultant & Software Engineer"),
    h("div", { style: { fontSize: 28, maxWidth: 900, lineHeight: 1.5 } }, "Client discovery. Solution design. Hands-on AI delivery."),
    h("div", { style: { fontSize: 23, color: "#94a3b8", marginTop: 45 } }, "hadi.aboudaya.com")
  ), { width: 1200, height: 630 });
}
