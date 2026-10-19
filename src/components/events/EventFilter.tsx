"use client";

import { useState, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import { FILTER_GROUPS, getEventFilterGroup, type EventSummary } from "@/data/eventCategories";
import { filterIcons } from "./EventIcons";
import { EventCard } from "./EventCard";
import { FilterPills, type FilterPillOption } from "@/components/ui/FilterPills";
import MotionMaxProvider from "@/components/animations/MotionMaxProvider";
import { fadeUp } from "@/lib/motion";
import { trackEvent, EVENTS } from "@/lib/analytics";

type EventFilterKey = "all" | (typeof FILTER_GROUPS)[number]["key"];

export function EventFilter({ events }: { events: EventSummary[] }) {
  const [activeFilter, setActiveFilter] = useState<EventFilterKey>("all");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return events;
    return events.filter((e) => getEventFilterGroup(e) === activeFilter);
  }, [activeFilter, events]);

  const filterOptions = useMemo<FilterPillOption<EventFilterKey>[]>(
    () =>
      FILTER_GROUPS.map((group) => ({
        key: group.key,
        label: group.label,
        icon: filterIcons[group.key],
        count:
          group.key === "all"
            ? events.length
            : events.filter((e) => getEventFilterGroup(e) === group.key).length,
      })),
    [events]
  );

  const yearGroups = useMemo(() => {
    const groups: Record<number, typeof events> = {};
    for (const event of filtered) {
      const year = Number(event.date.slice(0, 4));
      if (!groups[year]) groups[year] = [];
      groups[year].push(event);
    }
    return Object.entries(groups)
      .map(([year, evts]) => ({
        year: Number(year),
        events: evts.sort(
          (a, b) => b.date.localeCompare(a.date)
        ),
      }))
      .sort((a, b) => b.year - a.year);
  }, [filtered]);

  const handleToggle = (slug: string) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  };

  const handleFilterChange = (key: EventFilterKey) => {
    setActiveFilter(key);
    setExpandedSlug(null);
    trackEvent(EVENTS.EVENT_FILTER_CHANGED, { category: key });
  };

  return (
    <MotionMaxProvider>
      <div>
        {/* Filter bar */}
        <FilterPills
          options={filterOptions}
          active={activeFilter}
          onChange={handleFilterChange}
          ariaLabel="Filter events by category"
          groupId="events"
          className="mb-8"
        />

        {/* Year-grouped events */}
        <div className="space-y-12">
          <AnimatePresence initial={false} mode="popLayout">
            {yearGroups.map(({ year, events: yearEvents }) => {
              return (
                <m.div
                  key={year}
                  variants={fadeUp}
                  initial={false}
                  animate="visible"
                  exit={{ opacity: 0 }}
                >
                  {/* Sticky year header */}
                  <div className="sticky top-20 z-10 flex justify-center mb-6">
                    <span className="bg-surface-overlay glass-2 text-fg rounded-pill px-5 py-1.5 text-sm font-bold shadow-card">
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
                </m.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-fg-lo text-sm">No events found for this filter.</p>
          </div>
        )}
      </div>
    </MotionMaxProvider>
  );
}
