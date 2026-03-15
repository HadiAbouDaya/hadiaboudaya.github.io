"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/types";
import { categoryConfig } from "@/data/eventCategories";
import { Calendar, MapPin, ChevronDown, ArrowUpRight } from "lucide-react";
import { EventExpandedContent } from "./EventExpandedContent";
import { cn } from "@/lib/utils";
import { trackEvent, EVENTS } from "@/lib/analytics";

interface EventCardProps {
  event: Event;
  isExpanded: boolean;
  onToggle: () => void;
}

export function EventCard({ event, isExpanded, onToggle }: EventCardProps) {
  const config = categoryConfig[event.category];
  const CategoryIcon = config.icon;

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "col-span-1 flex flex-col h-full",
        event.tier === "featured" ? "sm:col-span-2 lg:col-span-2" : ""
      )}
    >
      <div
        className={cn(
          "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden flex flex-col h-full group transition-all duration-300 relative shadow-sm",
          !isExpanded && "hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:border-slate-600 hover:-translate-y-1 cursor-pointer"
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
          className="flex flex-col flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl"
        >
          {/* Edge-to-Edge Image Cover */}
          <div className="relative w-full aspect-video sm:aspect-[16/7] overflow-hidden bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
            {event.images?.[0] ? (
              <Image
                src={event.images[0]}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-90">
                <div className={cn("w-20 h-20 rounded-full flex items-center justify-center shadow-inner", config.color)}>
                  <CategoryIcon className="w-10 h-10 opacity-70" />
                </div>
              </div>
            )}

            {/* Overlay Gradient for hover effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

            {/* Hover floating Link icon */}
            <Link
              href={`/events/${event.slug}`}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 shadow-lg backdrop-blur-md hover:bg-primary-600 hover:text-white dark:hover:bg-primary-500 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 z-10"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Open ${event.title}`}
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 pr-16">
              <div className={cn("shadow-sm text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5", config.color)}>
                <CategoryIcon className="w-3.5 h-3.5" />
                <span>{config.label}</span>
              </div>
              {event.role && (
                <div className="backdrop-blur-md bg-slate-900/80 text-white/90 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-slate-700/50">
                  {event.role}
                </div>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="flex flex-col flex-1 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{event.location}</span>
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
              {event.title}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-2 mb-4">
              {event.summary}
            </p>

            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-3">
              {event.organizations && event.organizations.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 items-center">
                  {event.organizations.slice(0, 2).map((org) => (
                    <span
                      key={org}
                      className="text-[10px] sm:text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-md truncate max-w-[120px]"
                    >
                      {org}
                    </span>
                  ))}
                  {event.organizations.length > 2 && (
                    <span className="text-[10px] sm:text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-md">
                      +{event.organizations.length - 2}
                    </span>
                  )}
                </div>
              ) : (
                <div />
              )}

              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors shrink-0 outline outline-1 outline-slate-200 dark:outline-slate-700"
              >
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
              </motion.div>
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
    </motion.div>
  );
}
