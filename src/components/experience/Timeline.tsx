"use client";

import { experiences } from "@/data/experience";
import { TimelineCard } from "./TimelineCard";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export function Timeline() {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 md:-translate-x-1/2" />

      <div className="space-y-12">
        {experiences.map((item, index) => (
          <ScrollReveal
            key={item.id}
            direction={index % 2 === 0 ? "left" : "right"}
            delay={0.1}
          >
            <TimelineCard
              item={item}
              position={index % 2 === 0 ? "left" : "right"}
            />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
