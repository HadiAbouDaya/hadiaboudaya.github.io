"use client";

import { useEffect, useRef } from "react";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { observeArticleReading } from "@/lib/reading-progress";

interface BlogReadTrackerProps {
  slug: string;
  title: string;
  readingTime: number;
  children: React.ReactNode;
}

export function BlogReadTracker({ slug, readingTime, children }: BlogReadTrackerProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prose = contentRef.current?.querySelector<HTMLElement>("[data-article-body]");
    if (!prose) return;
    return observeArticleReading(prose, readingTime, ({ depths, complete, activeSeconds }) => {
      for (const depth of depths) {
        trackEvent(EVENTS.BLOG_SCROLL_DEPTH, { slug, depth, time_on_page: activeSeconds });
      }
      if (complete) {
        trackEvent(EVENTS.BLOG_READ_COMPLETED, {
          slug, reading_time: readingTime, actual_time: activeSeconds,
        });
      }
    });
  }, [slug, readingTime]);

  return <div ref={contentRef}>{children}</div>;
}
