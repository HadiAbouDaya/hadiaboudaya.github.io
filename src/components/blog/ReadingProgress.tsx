"use client";

import { useSyncExternalStore } from "react";
import { getReadingProgress, getServerReadingProgress, subscribeReadingProgress } from "@/lib/reading-progress";

export function ReadingProgress() {
  const progress = useSyncExternalStore(subscribeReadingProgress, getReadingProgress, getServerReadingProgress);
  return (
    <div
      aria-hidden="true"
      style={{ transform: `scaleX(${progress})` }}
      className="fixed top-0 left-0 right-0 h-0.5 origin-left z-[60] bg-gradient-brand print:hidden"
    />
  );
}
