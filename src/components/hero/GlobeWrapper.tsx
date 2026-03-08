"use client";

import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

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
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div aria-hidden="true" className="w-full h-full">
      {isDesktop ? (
        <GlobeScene />
      ) : (
        <div className="w-full h-full bg-gradient-to-b from-slate-950 to-slate-900" />
      )}
    </div>
  );
}
