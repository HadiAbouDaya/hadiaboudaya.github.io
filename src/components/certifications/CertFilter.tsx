"use client";

import { REVEAL_FRAGMENT_EVENT, fragmentFromEvent } from "@/lib/fragments";

import { useState, useMemo, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import type { Certification } from "@/types";
import { CertCard } from "./CertCard";
import MotionMaxProvider from "@/components/animations/MotionMaxProvider";
import { FilterPills, type FilterPillOption } from "@/components/ui/FilterPills";
import { trackEvent, EVENTS } from "@/lib/analytics";

const TYPE_TABS = [
  { key: "all", label: "All" },
  { key: "certification", label: "Professional Certifications" },
  { key: "programme", label: "Programmes & Specialisations" },
  { key: "course", label: "Courses" },
  { key: "badge", label: "Enablement & Accreditation Badges" },
] as const;
type TypeTab = (typeof TYPE_TABS)[number]["key"];

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

export function CertFilter({ certifications }: { certifications: Certification[] }) {
  const [activeType, setActiveType] = useState<TypeTab>("all");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const reveal = (hash: string) => {
      cancelAnimationFrame(frame);
      let id: string;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const match = /^cert-(\d+)$/.exec(id);
      const record = match ? certifications.find((item) => item.id === Number(match[1])) : undefined;
      if (!record) return;

      // Look up the canonical record before its card exists in the filtered DOM.
      setActiveType((current) => current === "all" || current === record.type ? current : "all");
      setActiveCategory((current) => current === "All" || current === record.category ? current : "All");
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          const target = document.getElementById(id);
          if (!target || !rootRef.current?.contains(target)) return;
          target.focus({ preventScroll: true });
          target.scrollIntoView({ block: "start", behavior: "instant" });
        });
      });
    };
    const onHashChange = () => {
      cancelAnimationFrame(frame);
      // Next may dispatch while committing a same-route history update.
      // Read the resulting fragment on the next frame, without target polling.
      frame = requestAnimationFrame(() => reveal(window.location.hash));
    };
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin === window.location.origin &&
          destination.pathname.replace(/\/$/, "") === window.location.pathname.replace(/\/$/, "") && destination.hash) {
        reveal(destination.hash);
      }
    };
    const onExplicitFragment = (event: Event) => { const hash = fragmentFromEvent(event); if (hash) reveal(hash); };
    onHashChange();
    window.addEventListener(REVEAL_FRAGMENT_EVENT, onExplicitFragment);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onHashChange);
    // Capture also sees repeated same-fragment Next Link navigation.
    document.addEventListener("click", onClick, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(REVEAL_FRAGMENT_EVENT, onExplicitFragment);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onHashChange);
      document.removeEventListener("click", onClick, true);
    };
  }, [certifications]);

  const typeFiltered = useMemo(() => {
    if (activeType === "all") return certifications;
    return certifications.filter((c) => c.type === activeType);
  }, [activeType, certifications]);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return typeFiltered;
    return typeFiltered.filter((c) => c.category === activeCategory);
  }, [typeFiltered, activeCategory]);

  const typeOptions: FilterPillOption<TypeTab>[] = useMemo(
    () =>
      TYPE_TABS.map(({ key, label }) => ({
        key, label,
        count: key === "all" ? certifications.length : certifications.filter((c) => c.type === key).length,
      })),
    [certifications]
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
      <div ref={rootRef}>
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
          ariaLabel="Filter learning records by topic"
          size="sm"
          groupId="cert-category"
          className="mb-10"
        />

        <p aria-live="polite" className="mb-4 text-sm text-fg-mid">{filtered.length} {filtered.length === 1 ? "record" : "records"}</p>

        {/* Card grid */}
        <m.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {filtered.map((cert) => (
              <CertCard key={cert.id} cert={cert} />
            ))}
          </AnimatePresence>
        </m.div>
      </div>
    </MotionMaxProvider>
  );
}
