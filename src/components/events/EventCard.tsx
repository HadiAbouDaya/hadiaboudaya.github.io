"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ChevronDown, ArrowUpRight } from "lucide-react";
import { categoryConfig, formatEventDate, type EventSummary } from "@/data/eventCategories";
import { ACCENTS } from "@/lib/accents";
import { cn } from "@/lib/utils";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { categoryIcons } from "./EventIcons";
import { EventExpandedContent } from "./EventExpandedContent";

interface EventCardProps {
  event: EventSummary;
  isExpanded: boolean;
  onToggle: () => void;
}

export function EventCard({ event, isExpanded, onToggle }: EventCardProps) {
  const config = categoryConfig[event.category];
  const Icon = categoryIcons[event.category];
  const accent = ACCENTS[config.accent];
  const featured = event.tier === "featured";
  const detailId = `event-preview-${event.slug}`;

  return (
    <article className={cn("col-span-1 flex flex-col rounded-card bg-surface-raised border border-line overflow-hidden shadow-card", featured && "sm:col-span-2 lg:col-span-2 featured-ring")}>
      <Link href={`/events/${event.slug}/`} aria-label={`Read ${event.title}`} className="group relative aspect-video sm:aspect-[16/7] overflow-hidden bg-surface-sunken border-b border-line">
        {event.coverImage ? (
          <Image src={event.coverImage} alt="" fill sizes={featured ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"} className={cn("object-cover transition-transform duration-300 group-hover:scale-[1.03]", event.imagePosition === "top" && "object-top", event.imagePosition === "bottom" && "object-bottom")} />
        ) : (
          <div className={cn("absolute inset-0 flex items-center justify-center", accent.chip)}><Icon className="h-12 w-12" aria-hidden="true" /></div>
        )}
        <span className={cn("absolute top-4 left-4 glass-2 shadow-card text-xs font-semibold px-2.5 py-1 rounded-pill inline-flex items-center gap-1.5", accent.onImage)}><Icon className="w-3.5 h-3.5" aria-hidden="true" />{event.role ?? config.label}</span>
        <span className="absolute top-4 right-4 glass-2 rounded-pill p-2 text-fg"><ArrowUpRight className="h-4 w-4" aria-hidden="true" /></span>
      </Link>
      <div className="p-5 sm:p-6 flex flex-1 flex-col">
        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-fg-mid">
          <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" aria-hidden="true" />{formatEventDate(event, true)}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />{event.location}</span>
        </div>
        <h3 className="text-title text-fg mb-3"><Link href={`/events/${event.slug}/`} className="hover:text-primary-600 dark:hover:text-primary-400">{event.title}</Link></h3>
        <p className={cn("text-sm text-fg-mid leading-relaxed mb-4", !isExpanded && "line-clamp-3")}>{event.summary}</p>
        <div className="mt-auto pt-3 border-t border-line flex flex-wrap items-center justify-between gap-3">
          <Link href={`/events/${event.slug}/`} className="text-sm font-medium text-primary-600 dark:text-primary-400">Read details <span aria-hidden="true">↗</span></Link>
          <button type="button" aria-expanded={isExpanded} aria-controls={detailId} aria-label={`${isExpanded ? "Close" : "Show"} preview: ${event.title}`} onClick={() => { trackEvent(EVENTS.EVENT_CARD_TOGGLED, { title: event.title, expanded: !isExpanded }); onToggle(); }} className="inline-flex items-center gap-2 text-xs text-fg-mid rounded-control px-3 py-2 hover:bg-surface-sunken">
            {isExpanded ? "Less" : "Preview"}<ChevronDown aria-hidden="true" className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
          </button>
        </div>
        <div id={detailId} hidden={!isExpanded}><EventExpandedContent event={event} /></div>
      </div>
    </article>
  );
}
