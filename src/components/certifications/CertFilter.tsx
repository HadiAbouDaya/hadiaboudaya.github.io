"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { certifications } from "@/data/certifications";
import { CertCard } from "./CertCard";
import { cn } from "@/lib/utils";
import { trackEvent, EVENTS } from "@/lib/analytics";

const FILTERS = [
  "All",
  "AWS",
  "Azure",
  "AI/ML",
  "Data Science",
  "Software Engineering",
  "Security",
  "Business",
] as const;

type FilterType = (typeof FILTERS)[number];

export function CertFilter() {
  const [active, setActive] = useState<FilterType>("All");

  const filtered =
    active === "All"
      ? certifications
      : certifications.filter((c) => c.category === active);

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10" role="radiogroup" aria-label="Filter certifications by category">
        {FILTERS.map((filter) => {
          const isActive = active === filter;
          return (
            <button
              key={filter}
              role="radio"
              aria-checked={isActive}
              onClick={() => { setActive(filter); trackEvent(EVENTS.CERTIFICATION_FILTER_CHANGED, { category: filter }); }}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                isActive
                  ? "bg-primary-600 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              )}
            >
              {filter}
              {filter !== "All" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({certifications.filter((c) => c.category === filter).length})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Card grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((cert) => (
            <CertCard key={cert.id} cert={cert} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
