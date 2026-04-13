"use client";

import dynamic from "next/dynamic";

const CanvasGlobe = dynamic(
  () => import("@/components/hero/CanvasGlobe").then((mod) => mod.CanvasGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full" style={{ background: "linear-gradient(to bottom, #0a0f1a, #111827)" }} />
    ),
  }
);

export function GlobeWrapper() {
  return (
    <div aria-hidden="true" className="w-full h-full" style={{ background: "linear-gradient(to bottom, #0a0f1a, #111827)" }}>
      <CanvasGlobe />
    </div>
  );
}
