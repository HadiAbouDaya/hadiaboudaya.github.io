"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { events } from "@/data/events";
import { EventCard } from "./EventCard";
import { cn } from "@/lib/utils";

const FILTERS = [
  "All",
  "career",
  "education",
  "project",
  "achievement",
] as const;

const FILTER_LABELS: Record<(typeof FILTERS)[number], string> = {
  All: "All",
  career: "Career",
  education: "Education",
  project: "Project",
  achievement: "Achievement",
};

type FilterType = (typeof FILTERS)[number];

export function EventFilter() {
  const [active, setActive] = useState<FilterType>("All");

  const filtered =
    active === "All"
      ? events
      : events.filter((e) => e.category === active);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              active === filter
                ? "bg-primary-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {FILTER_LABELS[filter]}
            {filter !== "All" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({events.filter((e) => e.category === filter).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
