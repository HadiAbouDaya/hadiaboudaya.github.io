"use client";

import { m, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { SPRING } from "@/lib/motion";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const MAX_OFFSET = 5;

interface MagneticProps {
  children: ReactNode;
  className?: string;
}

export function Magnetic({ children, className }: MagneticProps) {
  const isTouch = useMediaQuery("(hover: none)");
  const prefersReducedMotion = useReducedMotion();
  const disabled = isTouch || prefersReducedMotion;

  const x = useSpring(useMotionValue(0), SPRING.bouncy);
  const y = useSpring(useMotionValue(0), SPRING.bouncy);

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offsetX)));
    y.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offsetY)));
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      className={className}
      style={{ x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </m.div>
  );
}
