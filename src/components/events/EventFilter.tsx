"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { events } from "@/data/events";
import { categoryConfig, FILTER_GROUPS } from "@/data/eventCategories";
import { EventCard } from "./EventCard";
import { cn } from "@/lib/utils";
import { trackEvent, EVENTS } from "@/lib/analytics";
import type { Event } from "@/types";

function getFilterGroup(event: Event): string {
  return event.filterOverride ?? categoryConfig[event.category].filterGroup;
}

export function EventFilter() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return events;
    return events.filter((e) => getFilterGroup(e) === activeFilter);
  }, [activeFilter]);

  const yearGroups = useMemo(() => {
    const groups: Record<number, typeof events> = {};
    for (const event of filtered) {
      const year = new Date(event.date).getFullYear();
      if (!groups[year]) groups[year] = [];
      groups[year].push(event);
    }
    return Object.entries(groups)
      .map(([year, evts]) => ({
        year: Number(year),
        events: evts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      }))
      .sort((a, b) => b.year - a.year);
  }, [filtered]);

  const handleToggle = (slug: string) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  };

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap justify-center gap-2 mb-8" role="radiogroup" aria-label="Filter events by category">
        {FILTER_GROUPS.map((group) => {
          const count =
            group.key === "all"
              ? events.length
              : events.filter(
                  (e) => getFilterGroup(e) === group.key
                ).length;

          const Icon = group.icon;
          const isActive = activeFilter === group.key;

          return (
            <button
              key={group.key}
              role="radio"
              aria-checked={isActive}
              onClick={() => {
                setActiveFilter(group.key);
                setExpandedSlug(null);
                trackEvent(EVENTS.EVENT_FILTER_CHANGED, { category: group.key });
              }}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-primary-600 text-white shadow-lg scale-105"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 hover:shadow-sm"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {group.label}
              <span
                className={cn(
                  "ml-0.5 text-xs",
                  isActive ? "text-white/70" : "text-slate-400 dark:text-slate-500"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Year-grouped events */}
      <div className="space-y-12">
        <AnimatePresence mode="popLayout">
          {yearGroups.map(({ year, events: yearEvents }) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Sticky year header */}
              <div className="sticky top-20 z-10 flex justify-center mb-6">
                <span className="bg-slate-800 dark:bg-slate-700 text-white rounded-full px-5 py-1.5 text-sm font-bold shadow-lg">
                  {year}
                </span>
              </div>

              {/* Events grid */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                style={{ gridAutoFlow: "dense" }}
              >
                {yearEvents.map((event) => (
                  <EventCard
                    key={event.slug}
                    event={event}
                    isExpanded={expandedSlug === event.slug}
                    onToggle={() => handleToggle(event.slug)}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            No events found for this filter.
          </p>
        </div>
      )}
    </div>
  );
}
