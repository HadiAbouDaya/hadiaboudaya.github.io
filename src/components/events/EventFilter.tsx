"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { events } from "@/data/events";
import { categoryConfig, FILTER_GROUPS } from "@/data/eventCategories";
import { EventCard } from "./EventCard";
import { cn } from "@/lib/utils";

export function EventFilter() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return events;
    return events.filter((e) => {
      const config = categoryConfig[e.category];
      return config.filterGroup === activeFilter;
    });
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
      {/* Stats */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8">
        <span className="text-sm text-slate-500">
          <span className="font-semibold text-slate-800">{events.length}</span>{" "}
          Events
        </span>
        <span className="text-sm text-slate-500">
          <span className="font-semibold text-slate-800">
            {events.filter((e) => e.category === "workshop").length}
          </span>{" "}
          Workshops Hosted
        </span>
        <span className="text-sm text-slate-500">
          <span className="font-semibold text-slate-800">
            {events.filter((e) => e.category === "hackathon").length}
          </span>{" "}
          Hackathons
        </span>
        <span className="text-sm text-slate-500">
          <span className="font-semibold text-slate-800">
            {events.filter((e) => e.category === "certification").length}
          </span>{" "}
          Certifications
        </span>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {FILTER_GROUPS.map((group) => {
          const count =
            group.key === "all"
              ? events.length
              : events.filter(
                  (e) => categoryConfig[e.category].filterGroup === group.key
                ).length;

          const Icon = group.icon;
          const isActive = activeFilter === group.key;

          return (
            <button
              key={group.key}
              onClick={() => {
                setActiveFilter(group.key);
                setExpandedSlug(null);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-primary-600 text-white shadow-lg scale-105"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-sm"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {group.label}
              <span
                className={cn(
                  "ml-0.5 text-xs",
                  isActive ? "text-white/70" : "text-slate-400"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Showing count */}
      <p className="text-xs text-slate-400 text-center mb-6">
        Showing {filtered.length} event{filtered.length !== 1 ? "s" : ""}
      </p>

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
                <span className="bg-slate-800 text-white rounded-full px-5 py-1.5 text-sm font-bold shadow-lg">
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
          <p className="text-slate-400 text-sm">
            No events found for this filter.
          </p>
        </div>
      )}
    </div>
  );
}
