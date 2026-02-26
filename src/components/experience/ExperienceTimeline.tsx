"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experiences } from "@/data/experience";
import { TimelineCard } from "./TimelineCard";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { cn } from "@/lib/utils";
import { Briefcase, GraduationCap, Layers } from "lucide-react";

const FILTERS = [
  { key: "all", label: "All", icon: Layers },
  { key: "professional", label: "Professional", icon: Briefcase },
  { key: "education", label: "Education", icon: GraduationCap },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function getYearFromDate(dateStr: string): number {
  return new Date(dateStr).getFullYear();
}

type TimelineEntry =
  | { kind: "year"; year: number }
  | {
      kind: "card";
      item: (typeof experiences)[number];
      position: "left" | "right";
    };

export function ExperienceTimeline() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const professional = useMemo(
    () =>
      experiences.filter((e) => e.type === "work" || e.type === "freelance"),
    []
  );
  const education = useMemo(
    () => experiences.filter((e) => e.type === "education"),
    []
  );

  const allSorted = useMemo(() => {
    return [...experiences].sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  }, []);

  const filtered = useMemo(() => {
    if (filter === "professional") return professional;
    if (filter === "education") return education;
    return allSorted;
  }, [filter, professional, education, allSorted]);

  const isDualLane = filter === "all";

  // Build timeline entries with year dividers injected between groups
  const timelineEntries = useMemo(() => {
    const entries: TimelineEntry[] = [];
    let lastYear = 0;
    let cardIndex = 0;

    filtered.forEach((item) => {
      const year = getYearFromDate(item.startDate);
      if (year !== lastYear) {
        entries.push({ kind: "year", year });
        lastYear = year;
      }

      const isEducation = item.type === "education";
      const position: "left" | "right" = isDualLane
        ? isEducation
          ? "right"
          : "left"
        : cardIndex % 2 === 0
        ? "left"
        : "right";

      entries.push({ kind: "card", item, position });
      cardIndex++;
    });

    return entries;
  }, [filtered, isDualLane]);

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
        {/* Center vertical line */}
        <div
          className={cn(
            "absolute top-0 bottom-0 w-0.5",
            "left-4 md:left-1/2 md:-translate-x-1/2",
            "bg-gradient-to-b from-primary-300 via-slate-200 to-slate-100"
          )}
        />

        {/* Entries */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="space-y-4 md:space-y-6"
          >
            {timelineEntries.map((entry) => {
              if (entry.kind === "year") {
                return (
                  <div
                    key={`year-${entry.year}`}
                    className="relative h-10"
                  >
                    <div
                      className={cn(
                        "absolute z-20",
                        "top-1/2 -translate-x-1/2 -translate-y-1/2",
                        "left-4 md:left-1/2"
                      )}
                    >
                      <span className="inline-block bg-slate-800 text-white rounded-full px-5 py-1.5 text-sm font-bold shadow-md">
                        {entry.year}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <ScrollReveal
                  key={entry.item.id}
                  direction={entry.position === "left" ? "left" : "right"}
                  delay={0.05}
                >
                  <TimelineCard
                    item={entry.item}
                    position={entry.position}
                  />
                </ScrollReveal>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
