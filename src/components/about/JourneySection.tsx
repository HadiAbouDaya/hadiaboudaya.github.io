"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { JOURNEY_PARAGRAPHS } from "@/data/about";

export function JourneySection() {
  return (
    <section className="mt-16 lg:mt-20">
      <ScrollReveal>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
          My Journey
        </h2>
      </ScrollReveal>

      <div className="max-w-3xl space-y-6">
        {JOURNEY_PARAGRAPHS.map((paragraph, i) => (
          <ScrollReveal key={i} delay={i * 0.1}>
            <p className="text-slate-600 leading-relaxed">{paragraph}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
