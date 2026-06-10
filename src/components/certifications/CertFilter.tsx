"use client";

import { useState, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import { certifications } from "@/data/certifications";
import { CertCard } from "./CertCard";
import MotionMaxProvider from "@/components/animations/MotionMaxProvider";
import { FilterPills, type FilterPillOption } from "@/components/ui/FilterPills";
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

  const typeOptions: FilterPillOption<TypeTab>[] = useMemo(
    () =>
      TYPE_TABS.map((tab) => ({
        key: tab,
        label: tab,
        count:
          tab === "All"
            ? certifications.length
            : certifications.filter(
                (c) =>
                  c.type ===
                  (tab === "Certifications" ? "certification" : "course")
              ).length,
      })),
    []
  );

  const categoryOptions: FilterPillOption<CategoryFilter>[] = useMemo(
    () =>
      CATEGORIES.map((filter) => {
        const count =
          filter === "All"
            ? typeFiltered.length
            : typeFiltered.filter((c) => c.category === filter).length;
        return { key: filter, label: filter, count };
      }).filter((option) => option.key === "All" || option.count > 0),
    [typeFiltered]
  );

  const handleTypeChange = (tab: TypeTab) => {
    setActiveType(tab);
    setActiveCategory("All");
    trackEvent(EVENTS.CERTIFICATION_FILTER_CHANGED, { type: tab });
  };

  const handleCategoryChange = (filter: CategoryFilter) => {
    setActiveCategory(filter);
    trackEvent(EVENTS.CERTIFICATION_FILTER_CHANGED, { category: filter });
  };

  return (
    <MotionMaxProvider>
      <div>
        {/* Type tabs */}
        <FilterPills
          options={typeOptions}
          active={activeType}
          onChange={handleTypeChange}
          ariaLabel="Filter by type"
          groupId="cert-type"
          className="mb-6"
        />

        {/* Category filter pills */}
        <FilterPills
          options={categoryOptions}
          active={activeCategory}
          onChange={handleCategoryChange}
          ariaLabel="Filter certifications by category"
          size="sm"
          groupId="cert-category"
          className="mb-10"
        />

        {/* Card grid */}
        <m.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((cert) => (
              <CertCard key={cert.id} cert={cert} />
            ))}
          </AnimatePresence>
        </m.div>
      </div>
    </MotionMaxProvider>
  );
}
