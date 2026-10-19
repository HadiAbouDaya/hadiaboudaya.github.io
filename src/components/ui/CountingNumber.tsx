"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
interface CountingNumberProps { value: number; suffix?: string; duration?: number }
export function CountingNumber({ value, suffix = "", duration = 2000 }: CountingNumberProps) {
  const [display, setDisplay] = useState({ target: value, value });
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || duration <= 0 || !ref.current || !("IntersectionObserver" in window)) return;
    let frame = 0;
    let cancelled = false;
    let started = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (cancelled || started || !entry.isIntersecting) return;
      started = true;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const progress = Math.min((now - start) / duration, 1);
        setDisplay({ target: value, value: Math.round((1 - Math.pow(1 - progress, 3)) * value) });
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    observer.observe(ref.current);
    return () => { cancelled = true; observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value, duration, reduced]);
  return <span ref={ref}><span className="sr-only">{value}{suffix}</span>
    <span aria-hidden="true">{reduced || duration <= 0 ? value : display.target === value ? display.value : value}{suffix}</span></span>;
}
