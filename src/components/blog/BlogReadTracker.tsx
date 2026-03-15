"use client";

import { useEffect, useRef } from "react";
import { trackEvent, EVENTS } from "@/lib/analytics";

interface BlogReadTrackerProps {
  slug: string;
  title: string;
  readingTime: number;
  children: React.ReactNode;
}

const DEPTH_MILESTONES = [25, 50, 75, 100] as const;

export function BlogReadTracker({ slug, title, readingTime, children }: BlogReadTrackerProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef(Date.now());
  const firedDepths = useRef(new Set<number>());
  const completionFired = useRef(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    startTimeRef.current = Date.now();
    firedDepths.current.clear();
    completionFired.current = false;

    function getTimeOnPage() {
      return Math.round((Date.now() - startTimeRef.current) / 1000);
    }

    // Create sentinel elements at each milestone percentage
    const sentinels: HTMLDivElement[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const depth = Number(entry.target.getAttribute("data-depth"));
          if (firedDepths.current.has(depth)) continue;

          firedDepths.current.add(depth);
          const timeOnPage = getTimeOnPage();

          trackEvent(EVENTS.BLOG_SCROLL_DEPTH, {
            slug,
            depth,
            time_on_page: timeOnPage,
          });

          // Read completion: reached 100% + spent at least 30% of estimated reading time
          if (
            depth === 100 &&
            !completionFired.current &&
            timeOnPage >= readingTime * 60 * 0.3
          ) {
            completionFired.current = true;
            trackEvent(EVENTS.BLOG_READ_COMPLETED, {
              slug,
              title,
              reading_time: readingTime,
              actual_time: timeOnPage,
            });
          }

          observer.unobserve(entry.target);
        }
      },
      { threshold: 0 }
    );

    for (const depth of DEPTH_MILESTONES) {
      const sentinel = document.createElement("div");
      sentinel.setAttribute("data-depth", String(depth));
      sentinel.style.height = "1px";
      sentinel.style.pointerEvents = "none";

      // Position sentinel at the corresponding percentage of the content
      const position = Math.min(depth / 100, 1);
      const childNodes = Array.from(el.children);
      const insertIndex = Math.floor(childNodes.length * position);

      if (insertIndex >= childNodes.length) {
        el.appendChild(sentinel);
      } else {
        el.insertBefore(sentinel, childNodes[insertIndex]);
      }

      sentinels.push(sentinel);
      observer.observe(sentinel);
    }

    return () => {
      observer.disconnect();
      sentinels.forEach((s) => s.remove());
    };
  }, [slug, title, readingTime]);

  return <div ref={contentRef}>{children}</div>;
}
