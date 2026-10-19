"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { staggerContainer, VIEWPORT, DUR, EASE_OUT } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
interface StaggerChildrenProps { children: ReactNode; className?: string; staggerDelay?: number }
export function StaggerChildren({ children, className, staggerDelay = 0.1 }: StaggerChildrenProps) {
  const reduced = useReducedMotion();
  return <m.div data-motion-reveal initial={false} whileInView="visible" viewport={VIEWPORT}
    animate={reduced ? "visible" : undefined} variants={staggerContainer(reduced ? 0 : staggerDelay)}
    className={className}>{children}</m.div>;
}
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <m.div data-motion-reveal initial={false} animate={reduced ? "visible" : undefined}
    variants={{ visible: { opacity: reduced ? 1 : [0.65, 1], y: reduced ? 0 : [24, 0],
      transition: { duration: reduced ? 0 : DUR.base, ease: EASE_OUT } } }} className={className}>{children}</m.div>;
}
