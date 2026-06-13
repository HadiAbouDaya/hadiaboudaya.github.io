"use client";

import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Event, EventCategory } from "@/types";
import { categoryConfig } from "@/data/eventCategories";
import { ACCENTS, type Accent } from "@/lib/accents";
import { SPRING } from "@/lib/motion";
import { Calendar, MapPin, ChevronDown, ArrowUpRight } from "lucide-react";
import { EventExpandedContent } from "./EventExpandedContent";
import { cn } from "@/lib/utils";
import { trackEvent, EVENTS } from "@/lib/analytics";

interface EventCardProps {
  event: Event;
  isExpanded: boolean;
  onToggle: () => void;
}

// Category -> accent mapping (blue/teal/emerald/amber/orange only).
const CATEGORY_ACCENT: Record<EventCategory, Accent> = {
  career: "blue",
  education: "blue",
  conference: "teal",
  hackathon: "teal",
  community: "teal",
  achievement: "teal",
  project: "emerald",
  certification: "amber",
  workshop: "orange",
  "knowledge-sharing": "orange",
  training: "orange",
};

export function EventCard({ event, isExpanded, onToggle }: EventCardProps) {
  const config = categoryConfig[event.category];
  const CategoryIcon = config.icon;
  const accent = ACCENTS[CATEGORY_ACCENT[event.category]];
  const isFeatured = event.tier === "featured";

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <m.div
      layout
      initial={{ opacity: 0, scale: 0.96, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -10 }}
      transition={SPRING.smooth}
      className={cn(
        "col-span-1 flex flex-col h-full rounded-card",
        isFeatured ? "sm:col-span-2 lg:col-span-2 featured-ring" : ""
      )}
    >
      <div
        className={cn(
          "card-spotlight bg-surface-raised rounded-card border border-line overflow-hidden flex flex-col h-full group relative shadow-card transition-[transform,border-color,box-shadow] duration-300",
          !isExpanded &&
            cn(
              "cursor-pointer hover:-translate-y-0.5 hover:border-primary-500/30",
              isFeatured ? "hover:shadow-glow" : "hover:shadow-glow-sm"
            )
        )}
      >
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          onClick={() => { trackEvent(EVENTS.EVENT_CARD_TOGGLED, { title: event.title, expanded: !isExpanded }); onToggle(); }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle();
            }
          }}
          className="flex flex-col flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-card"
        >
          {/* Edge-to-Edge Image Cover */}
          <div className="relative w-full aspect-video sm:aspect-[16/7] overflow-hidden bg-surface-sunken border-b border-line shrink-0">
            {event.images?.[0] ? (
              <Image
                src={event.images[0]}
                alt={`${event.title} - event photo`}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                sizes={
                  isFeatured
                    ? "(max-width: 1024px) 100vw, 66vw"
                    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                }
              />
            ) : (
              <div className="absolute inset-0 bg-[image:var(--gradient-brand-soft)] flex items-center justify-center transition-opacity duration-300 group-hover:opacity-90">
                <div className={cn("w-20 h-20 rounded-full flex items-center justify-center shadow-inner", accent.chip)}>
                  <CategoryIcon className="w-10 h-10 opacity-70" />
                </div>
              </div>
            )}

            {/* Overlay Gradient for hover effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

            {/* Hover floating Link icon */}
            <Link
              href={`/events/${event.slug}`}
              className="glass-2 absolute top-4 right-4 p-2.5 rounded-pill text-fg shadow-card hover:bg-primary-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 z-10"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Open ${event.title}`}
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            {/* Single type chip over the cover image: the category icon + accent
                colour carry the event type, the label shows the role (e.g.
                "Workshop Host", "Speaker") or falls back to the category name.
                Frosted glass-2 keeps it readable on any photo / light cert scan. */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 pr-16">
              <div className={cn("glass-2 shadow-card text-xs font-semibold px-2.5 py-1 rounded-pill flex items-center gap-1.5", accent.onImage)}>
                <CategoryIcon className="w-3.5 h-3.5" />
                <span>{event.role ?? config.label}</span>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="flex flex-col flex-1 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-fg-mid mb-3">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{event.location}</span>
              </span>
            </div>

            <h3 className="text-title text-fg mb-3 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-2">
              {event.title}
            </h3>

            <p className="text-sm text-fg-mid leading-relaxed line-clamp-3 sm:line-clamp-2 mb-4">
              {event.summary}
            </p>

            <div className="mt-auto pt-4 border-t border-line flex items-center justify-between gap-3">
              {event.organizations && event.organizations.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 items-center">
                  {event.organizations.slice(0, 2).map((org) => (
                    <span
                      key={org}
                      className="text-[10px] sm:text-xs font-medium px-2 py-1 bg-surface-sunken text-fg-mid rounded-control truncate max-w-[120px]"
                    >
                      {org}
                    </span>
                  ))}
                  {event.organizations.length > 2 && (
                    <span className="text-[10px] sm:text-xs font-medium px-2 py-1 bg-surface-sunken text-fg-mid rounded-control">
                      +{event.organizations.length - 2}
                    </span>
                  )}
                </div>
              ) : (
                <div />
              )}

              <m.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={SPRING.snappy}
                className="w-8 h-8 rounded-pill flex items-center justify-center bg-surface-sunken group-hover:bg-surface-overlay transition-colors shrink-0 border border-line"
              >
                <ChevronDown className="w-4 h-4 text-fg-lo group-hover:text-fg-mid transition-colors" />
              </m.div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0">
              <EventExpandedContent event={event} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </m.div>
  );
}
