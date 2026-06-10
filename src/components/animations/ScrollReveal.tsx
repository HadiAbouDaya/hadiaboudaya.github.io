"use client";

import { m } from "framer-motion";
import { ReactNode } from "react";
import { SPRING, VIEWPORT } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
}

const directionOffset = {
  up: { y: 24, x: 0 },
  down: { y: -24, x: 0 },
  left: { y: 0, x: 24 },
  right: { y: 0, x: -24 },
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // 24px directional travel + SPRING.smooth settle ("up" matches the canonical fadeUp).
  const initial = { opacity: 0, ...directionOffset[direction] };

  return (
    <m.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={VIEWPORT}
      transition={{ ...SPRING.smooth, delay }}
      className={className}
    >
      {children}
    </m.div>
  );
}
