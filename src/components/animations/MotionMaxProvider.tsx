"use client";

import { LazyMotion } from "framer-motion";

const loadDomMax = () => import("framer-motion").then((m) => m.domMax);

export default function MotionMaxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LazyMotion features={loadDomMax} strict>
      {children}
    </LazyMotion>
  );
}
