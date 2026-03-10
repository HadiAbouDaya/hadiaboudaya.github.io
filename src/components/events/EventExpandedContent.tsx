"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { CreativeCarousel } from "@/components/ui/CreativeCarousel";
import { ExternalLink, ArrowRight, ChevronLeft, ChevronRight, Github, Globe } from "lucide-react";

function ImageCarousel({ images, title, onImageClick }: { images: string[]; title: string; onImageClick?: (index: number) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="mb-4 relative group" onClick={(e) => e.stopPropagation()}>
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-2 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => onImageClick?.(i)}
            className="relative w-40 h-28 sm:w-48 sm:h-32 rounded-lg overflow-hidden shrink-0 snap-start cursor-zoom-in"
          >
            <Image
              src={img}
              alt={`${title} ${i + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 160px, 192px"
            />
          </button>
        ))}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

interface EventExpandedContentProps {
  event: Event;
}

export function EventExpandedContent({ event }: EventExpandedContentProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          {event.description}
        </p>

        {event.organizations && event.organizations.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Organizations
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {event.organizations.map((org) => (
                <span
                  key={org}
                  className="text-xs px-2.5 py-1 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700"
                >
                  {org}
                </span>
              ))}
            </div>
          </div>
        )}

        {event.images && event.images.length > 1 && (
          <ImageLightbox images={event.images} alt={event.title}>
            {(openAt) =>
              event.images!.length > 3 ? (
                <div className="mx-4 sm:mx-0">
                  <CreativeCarousel
                    images={event.images!}
                    alt={event.title}
                    onImageClick={openAt}
                  />
                </div>
              ) : (
                <ImageCarousel images={event.images!} title={event.title} onImageClick={openAt} />
              )
            }
          </ImageLightbox>
        )}

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {event.tags.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          {event.linkedinUrl && (
            <a
              href={event.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
              LinkedIn
            </a>
          )}
          {event.githubUrl && (
            <a
              href={event.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="w-3 h-3" />
              GitHub
            </a>
          )}
          {event.websiteUrl && (
            <a
              href={event.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe className="w-3 h-3" />
              Case Study
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
