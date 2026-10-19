"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { VIEWPORT, DUR, EASE_OUT } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
interface ScrollRevealProps { children: ReactNode; direction?: "up" | "down" | "left" | "right"; delay?: number; className?: string }
const offsets = { up: { x: 0, y: 24 }, down: { x: 0, y: -24 }, left: { x: 24, y: 0 }, right: { x: -24, y: 0 } };
export function ScrollReveal({ children, direction = "up", delay = 0, className }: ScrollRevealProps) {
  const reduced = useReducedMotion();
  const offset = offsets[direction];
  // SSR is visible. Viewport entry enhances it without replacing the subtree or hiding essential content.
  return <m.div data-motion-reveal initial={false}
    animate={reduced ? { opacity: 1, x: 0, y: 0 } : undefined}
    whileInView={reduced ? { opacity: 1, x: 0, y: 0 } : { opacity: [0.65, 1], x: [offset.x, 0], y: [offset.y, 0] }}
    viewport={VIEWPORT} transition={{ duration: reduced ? 0 : DUR.base, ease: EASE_OUT, delay: reduced ? 0 : delay }}
    className={className}>{children}</m.div>;
}
