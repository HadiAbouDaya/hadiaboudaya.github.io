"use client";

import { m, useScroll } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className="fixed top-0 left-0 right-0 h-0.5 origin-left z-[60] bg-gradient-brand opacity-40" />
    );
  }

  return (
    <m.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-0.5 origin-left z-[60] bg-gradient-brand"
    />
  );
}
