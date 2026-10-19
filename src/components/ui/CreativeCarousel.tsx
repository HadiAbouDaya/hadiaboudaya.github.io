"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
interface CreativeCarouselProps { images: string[]; alt: string; onImageClick?: (index: number) => void }
interface ScrollState { active: number; left: boolean; right: boolean }

export function CreativeCarousel({ images, alt, onImageClick }: CreativeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const slides = useRef<Array<HTMLDivElement | null>>([]);
  const requested = useRef<number | null>(null);
  const active = useRef(0);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, setState] = useState<ScrollState>({ active: 0, left: false, right: false });
  const reduced = useReducedMotion();
  const sourceKey = JSON.stringify(images);

  const measure = useCallback((settle = false) => {
    const el = scrollRef.current;
    if (!el) return;
    const settlingIndex = settle ? requested.current : null;
    if (settle) requested.current = null;
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    const rect = el.getBoundingClientRect();
    const positions = slides.current.slice(0, images.length).map(slide => slide
      ? Math.max(0, Math.min(max, slide.getBoundingClientRect().left - rect.left + el.scrollLeft - el.clientLeft)) : 0);
    let nearest = 0;
    let distance = Infinity;
    positions.forEach((position, index) => {
      const nextDistance = Math.abs(position - el.scrollLeft);
      if (nextDistance < distance - 0.5 || (Math.abs(nextDistance - distance) <= 0.5 && index === active.current)) {
        distance = nextDistance;
        nearest = index;
      }
    });
    if (settlingIndex !== null && Math.abs(positions[settlingIndex] - el.scrollLeft) <= 1) nearest = settlingIndex;
    else if (max > 1 && el.scrollLeft >= max - 1 && requested.current === null) nearest = images.length - 1;
    const nextActive = requested.current ?? nearest;
    active.current = Math.max(0, Math.min(nextActive, images.length - 1));
    const next = { active: active.current, left: el.scrollLeft > 1, right: el.scrollLeft < max - 1 };
    setState(old => old.active === next.active && old.left === next.left && old.right === next.right ? old : next);
  }, [images.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const clearTimer = () => { if (settleTimer.current !== null) clearTimeout(settleTimer.current); settleTimer.current = null; };
    const settle = () => { clearTimer(); measure(true); };
    const onScroll = () => {
      measure();
      clearTimer();
      // scrollend is not available in every supported browser.
      settleTimer.current = setTimeout(settle, 160);
    };
    const interrupt = () => {
      requested.current = null;
      clearTimer();
      // Cancel any in-flight smooth scroll before accepting direct manipulation.
      el.scrollTo({ left: el.scrollLeft, behavior: "instant" });
      measure(true);
    };
    const onResize = () => { interrupt(); };
    measure(true);
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("scrollend", settle);
    el.addEventListener("pointerdown", interrupt, { passive: true });
    el.addEventListener("wheel", interrupt, { passive: true });
    el.addEventListener("keydown", interrupt);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    observer?.observe(el);
    slides.current.forEach(slide => { if (slide) observer?.observe(slide); });
    window.addEventListener("resize", onResize);
    return () => {
      clearTimer(); observer?.disconnect(); requested.current = null;
      el.removeEventListener("scroll", onScroll); el.removeEventListener("scrollend", settle);
      el.removeEventListener("pointerdown", interrupt); el.removeEventListener("wheel", interrupt);
      el.removeEventListener("keydown", interrupt); window.removeEventListener("resize", onResize);
    };
  }, [measure, sourceKey]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    requested.current = null;
    active.current = 0;
    el.scrollTo({ left: 0, behavior: "instant" });
    measure(true);
  }, [sourceKey, measure]);

  const navigateTo = (index: number) => {
    const el = scrollRef.current;
    const slide = slides.current[index];
    if (!el || !slide) return;
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    const left = Math.max(0, Math.min(max, slide.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft - el.clientLeft));
    requested.current = index;
    active.current = index;
    setState(old => ({ ...old, active: index }));
    el.scrollTo({ left, behavior: reduced ? "instant" : "smooth" });
    if (settleTimer.current !== null) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => { settleTimer.current = null; measure(true); }, reduced ? 0 : 600);
  };

  if (!images.length) return null;
  return <div className="relative my-8 group" role="region" aria-label={`${alt} gallery`}>
    <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-2 [scrollbar-width:thin]">
      {images.map((src, index) => <div key={`${src}-${index}`} ref={node => { slides.current[index] = node; }}
        className="relative shrink-0 snap-start group/card w-[min(320px,85vw)] sm:w-[360px]">
        <button type="button" onClick={() => onImageClick?.(index)} aria-label={`Open ${alt}, image ${index + 1} of ${images.length}`}
          className="relative block w-full h-96 sm:h-[400px] rounded-card-lg overflow-hidden shadow-card hover:shadow-card-hover transition-shadow">
          <Image src={src} alt={`${alt} - image ${index + 1} of ${images.length}`} fill className="object-cover"
            sizes="(max-width: 640px) 85vw, 360px" />
          <span className="absolute top-4 right-4 w-10 h-10 rounded-full glass-2 flex items-center justify-center text-fg"><Maximize2 className="w-5 h-5" /></span>
          <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-pill glass-2 text-xs font-semibold text-fg">{index + 1} / {images.length}</span>
        </button>
      </div>)}
    </div>
    <div className="flex items-center justify-center gap-2 mt-3">
      <button type="button" disabled={!state.left} onClick={() => navigateTo(Math.max(0, active.current - 1))}
        className="shrink-0 w-11 h-11 rounded-pill border border-line bg-surface-raised text-fg disabled:opacity-40" aria-label="Scroll left"><ChevronLeft className="w-5 h-5 mx-auto" /></button>
      <div className="flex flex-wrap justify-center gap-1 min-w-0" aria-label="Choose image">
        {images.map((src, index) => <button key={`${src}-${index}`} type="button" onClick={() => navigateTo(index)}
          className="w-9 h-9 flex items-center justify-center rounded-pill" aria-label={`Go to image ${index + 1}`}
          aria-current={state.active === index ? "true" : undefined}>
          <span className={`rounded-full ${state.active === index ? "w-3 h-3 bg-primary-600 ring-2 ring-primary-500/30" : "w-2 h-2 bg-fg-lo"}`} />
        </button>)}
      </div>
      <button type="button" disabled={!state.right} onClick={() => navigateTo(Math.min(images.length - 1, active.current + 1))}
        className="shrink-0 w-11 h-11 rounded-pill border border-line bg-surface-raised text-fg disabled:opacity-40" aria-label="Scroll right"><ChevronRight className="w-5 h-5 mx-auto" /></button>
    </div>
    <p className="sr-only" aria-live="polite">Image {state.active + 1} of {images.length}</p>
  </div>;
}
