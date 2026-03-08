"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experiences } from "@/data/experience";
import { TimelineCard, typeConfig } from "./TimelineCard";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { cn } from "@/lib/utils";
import { Briefcase, GraduationCap, Layers } from "lucide-react";
import type { Experience } from "@/types";

const FILTERS = [
  { key: "all", label: "All", icon: Layers },
  { key: "professional", label: "Professional", icon: Briefcase },
  { key: "education", label: "Education", icon: GraduationCap },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function getYearFromDate(dateStr: string): number {
  return new Date(dateStr).getFullYear();
}

function sortByStartDesc(a: Experience, b: Experience): number {
  const startDiff =
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  if (startDiff !== 0) return startDiff;
  const aEnd = a.endDate ? new Date(a.endDate).getTime() : Date.now();
  const bEnd = b.endDate ? new Date(b.endDate).getTime() : Date.now();
  return bEnd - aEnd;
}

type SingleEntry =
  | { kind: "year"; year: number }
  | { kind: "card"; item: Experience; position: "left" | "right" };

export function ExperienceTimeline() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const activeExperiences = useMemo(() => {
    const now = new Date();
    return experiences.filter((e) => new Date(e.startDate) <= now);
  }, []);

  const professional = useMemo(
    () =>
      [...activeExperiences]
        .filter((e) => e.type === "work" || e.type === "freelance")
        .sort(sortByStartDesc),
    [activeExperiences]
  );

  const education = useMemo(
    () =>
      [...activeExperiences]
        .filter((e) => e.type === "education")
        .sort(sortByStartDesc),
    [activeExperiences]
  );

  const allSorted = useMemo(
    () => [...activeExperiences].sort(sortByStartDesc),
    [activeExperiences]
  );

  const filtered = useMemo(() => {
    if (filter === "professional") return professional;
    if (filter === "education") return education;
    return allSorted;
  }, [filter, professional, education, allSorted]);

  const isDualLane = filter === "all";

  // --- Single-lane entries (used for filtered views + mobile "All") ---
  const singleLaneEntries = useMemo(() => {
    const entries: SingleEntry[] = [];
    let lastYear = 0;
    filtered.forEach((item, index) => {
      const year = getYearFromDate(item.startDate);
      if (year !== lastYear) {
        entries.push({ kind: "year", year });
        lastYear = year;
      }
      entries.push({
        kind: "card",
        item,
        position: index % 2 === 0 ? "left" : "right",
      });
    });
    return entries;
  }, [filtered]);

  // --- Dual-lane: all years + left column entries ---
  const allYears = useMemo(() => {
    const years = activeExperiences.map((e) => getYearFromDate(e.startDate));
    const min = Math.min(...years);
    const max = Math.max(...years);
    return Array.from({ length: max - min + 1 }, (_, i) => max - i);
  }, [activeExperiences]);

  // --- Dual-lane: left entries by year, education groups for grid spanning ---
  const leftByYear = useMemo(() => {
    const map = new Map<number, Experience[]>();
    professional.forEach((p) => {
      const y = getYearFromDate(p.startDate);
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(p);
    });
    return map;
  }, [professional]);

  const educationGroups = useMemo(() => {
    const sorted = [...education].sort((a, b) => {
      const aEnd = a.endDate ? new Date(a.endDate).getTime() : Date.now();
      const bEnd = b.endDate ? new Date(b.endDate).getTime() : Date.now();
      return bEnd - aEnd;
    });
    const groups: {
      items: Experience[];
      endYear: number;
      startYear: number;
    }[] = [];
    sorted.forEach((item) => {
      const endY = item.endDate
        ? getYearFromDate(item.endDate)
        : new Date().getFullYear();
      const startY = getYearFromDate(item.startDate);
      const last = groups[groups.length - 1];
      if (last && endY >= last.startYear) {
        last.items.push(item);
        last.startYear = Math.min(last.startYear, startY);
      } else {
        groups.push({ items: [item], endYear: endY, startYear: startY });
      }
    });
    return groups;
  }, [education]);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {FILTERS.map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                filter === f.key
                  ? "bg-primary-600 text-white shadow-lg scale-105"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-sm"
              )}
            >
              <Icon className="w-4 h-4" />
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Lane legend (dual mode, desktop only) */}
      {isDualLane && (
        <div className="hidden md:flex justify-center gap-6 mb-10 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary-600 ring-2 ring-primary-200" />
            <span className="text-slate-500">Professional</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-violet-600 ring-2 ring-violet-200" />
            <span className="text-slate-500">Freelance</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600 ring-2 ring-emerald-200" />
            <span className="text-slate-500">Education</span>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            {/* ========== DESKTOP DUAL LANE (CSS Grid) ========== */}
            {isDualLane && (
              <div
                className="hidden md:grid relative pt-4 pb-16"
                style={{
                  gridTemplateColumns: "1fr 1fr",
                  gridTemplateRows: allYears
                    .flatMap(() => ["auto", "minmax(0, auto)"])
                    .join(" "),
                }}
              >
                {/* Center line */}
                <div className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-300 via-slate-200 to-slate-100 left-1/2 -translate-x-1/2 z-0" />

                {/* Year markers — span both columns */}
                {allYears.map((year, i) => (
                  <div
                    key={`year-${year}`}
                    style={{ gridRow: 2 * i + 1, gridColumn: "1 / -1" }}
                    className="sticky top-24 h-10 flex items-center justify-center my-4 z-30"
                  >
                    <span className="inline-block bg-slate-800 text-white rounded-full px-5 py-1.5 text-sm font-bold shadow-lg">
                      {year}
                    </span>
                  </div>
                ))}

                {/* Left column — professional cards in their year's content row */}
                {allYears.map((year, i) => {
                  const items = leftByYear.get(year);
                  if (!items?.length) return null;
                  return (
                    <div
                      key={`left-${year}`}
                      style={{ gridRow: 2 * i + 2, gridColumn: 1 }}
                      className="pr-8 relative z-10"
                    >
                      {items.map((item) => (
                        <div key={item.id} className="relative w-full mb-10">
                          <ScrollReveal direction="left" delay={0.05}>
                            <TimelineCard
                              item={item}
                              position="left"
                              isDualLane
                            />
                          </ScrollReveal>
                        </div>
                      ))}
                    </div>
                  );
                })}

                {/* Right column — education groups spanning their date range */}
                {educationGroups.map((group, gi) => {
                  const startRowIdx = allYears.indexOf(group.endYear);
                  const endRowIdx = allYears.indexOf(group.startYear);
                  if (startRowIdx === -1 || endRowIdx === -1) return null;
                  return (
                    <div
                      key={`edu-group-${gi}`}
                      style={{
                        gridRow: `${2 * startRowIdx + 2} / ${2 * endRowIdx + 3}`,
                        gridColumn: 2,
                      }}
                      className="pl-8 relative z-20"
                    >
                      {group.items.map((item) => (
                        <div
                          key={item.id}
                          className="sticky top-28 z-20 mb-10"
                        >
                          <ScrollReveal direction="right" delay={0.15}>
                            <TimelineCard
                              item={item}
                              position="right"
                              isDualLane
                            />
                          </ScrollReveal>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ========== SINGLE LANE (desktop filtered) + MOBILE ALL ========== */}
            <div
              className={cn(
                "relative space-y-4 md:space-y-6",
                isDualLane ? "md:hidden" : "block"
              )}
            >
              {/* Center line */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-300 via-slate-200 to-slate-100 left-4 md:left-1/2 md:-translate-x-1/2 z-0" />

              {singleLaneEntries.map((entry) => {
                if (entry.kind === "year") {
                  return (
                    <div
                      key={`year-${entry.year}`}
                      className="relative h-10"
                    >
                      <div className="absolute z-20 top-1/2 -translate-x-1/2 -translate-y-1/2 left-4 md:left-1/2">
                        <span className="inline-block bg-slate-800 text-white rounded-full px-5 py-1.5 text-sm font-bold shadow-md">
                          {entry.year}
                        </span>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={entry.item.id} className="relative z-10 w-full">
                    <ScrollReveal
                      direction={
                        entry.position === "left" ? "left" : "right"
                      }
                      delay={0.05}
                    >
                      <TimelineCard
                        item={entry.item}
                        position={entry.position}
                      />
                    </ScrollReveal>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
