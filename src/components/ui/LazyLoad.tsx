"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface LazyLoadProps {
  children: ReactNode;
  fallback: ReactNode;
  rootMargin?: string;
}

export function LazyLoad({
  children,
  fallback,
  rootMargin = "200px",
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          setIsVisible(true);
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReducedMotion, rootMargin]);

  if (!isVisible) {
    return <div ref={ref}>{fallback}</div>;
  }

  return (
    <div className={prefersReducedMotion ? undefined : "animate-lazy-fade-in"}>
      {children}
    </div>
  );
}
