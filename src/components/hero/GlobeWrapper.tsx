"use client";

import dynamic from "next/dynamic";

const GlobeScene = dynamic(
  () => import("@/components/hero/GlobeScene").then((mod) => mod.GlobeScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gradient-to-b from-slate-950 to-slate-900" />
    ),
  }
);

export function GlobeWrapper() {
  return <GlobeScene />;
}
