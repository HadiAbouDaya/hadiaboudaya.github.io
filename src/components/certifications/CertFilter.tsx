"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { certifications } from "@/data/certifications";
import { CertCard } from "./CertCard";
import { cn } from "@/lib/utils";
import { trackEvent, EVENTS } from "@/lib/analytics";

const TYPE_TABS = ["All", "Certifications", "Courses"] as const;
type TypeTab = (typeof TYPE_TABS)[number];

const CATEGORIES = [
  "All",
  "AWS",
  "Azure",
  "AI/ML",
  "Data Science",
  "Software Engineering",
  "Security",
  "Business",
] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

export function CertFilter() {
  const [activeType, setActiveType] = useState<TypeTab>("All");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");

  const typeFiltered = useMemo(() => {
    if (activeType === "All") return certifications;
    const type = activeType === "Certifications" ? "certification" : "course";
    return certifications.filter((c) => c.type === type);
  }, [activeType]);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return typeFiltered;
    return typeFiltered.filter((c) => c.category === activeCategory);
  }, [typeFiltered, activeCategory]);

  const handleTypeChange = (tab: TypeTab) => {
    setActiveType(tab);
    setActiveCategory("All");
    trackEvent(EVENTS.CERTIFICATION_FILTER_CHANGED, { type: tab });
  };

  return (
    <div>
      {/* Type tabs */}
      <div className="flex justify-center gap-2 mb-6" role="tablist" aria-label="Filter by type">
        {TYPE_TABS.map((tab) => {
          const isActive = activeType === tab;
          const count =
            tab === "All"
              ? certifications.length
              : certifications.filter((c) =>
                  c.type === (tab === "Certifications" ? "certification" : "course")
                ).length;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTypeChange(tab)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-semibold transition-all",
                isActive
                  ? "bg-primary-600 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              )}
            >
              {tab}
              <span className="ml-1.5 text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10" role="radiogroup" aria-label="Filter certifications by category">
        {CATEGORIES.map((filter) => {
          const isActive = activeCategory === filter;
          const count =
            filter === "All"
              ? typeFiltered.length
              : typeFiltered.filter((c) => c.category === filter).length;
          if (filter !== "All" && count === 0) return null;
          return (
            <button
              key={filter}
              role="radio"
              aria-checked={isActive}
              onClick={() => { setActiveCategory(filter); trackEvent(EVENTS.CERTIFICATION_FILTER_CHANGED, { category: filter }); }}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                isActive
                  ? "bg-primary-600 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              )}
            >
              {filter}
              {filter !== "All" && (
                <span className="ml-1.5 text-xs opacity-70">({count})</span>
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
