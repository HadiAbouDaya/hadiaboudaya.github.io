"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { JOURNEY_PARAGRAPHS } from "@/data/about";

export function JourneySection() {
  return (
    <section className="mt-20 lg:mt-32 relative">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start relative">
        {/* Sticky Left Column */}
        <div className="w-full lg:w-5/12 lg:sticky lg:top-24 z-10">
          <ScrollReveal className="mb-8 lg:mb-10">
            <h2 className="text-headline text-gradient">
              My Journey
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="left">
            <div className="relative max-w-md mx-auto">
              {/* Subtle brand glow behind the portrait (no blob) */}
              <div className="absolute -inset-4 rounded-card-lg bg-[image:var(--gradient-brand-soft)] blur-2xl -z-10" />

              {/* Framed feature image — static, no hover motion */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card-lg ring-1 ring-slate-900/10 dark:ring-white/10 shadow-card-hover">
                <ImageWithFallback
                  src="/Media/profile/journey.webp"
                  alt="Portrait of Hadi Abou Daya"
                  width={400}
                  height={500}
                  sizes="(min-width: 1024px) 28rem, (min-width: 640px) 28rem, 100vw"
                  fallbackText="HA"
                  className="w-full h-full object-cover"
                  fallbackClassName="w-full h-full rounded-card-lg text-5xl bg-surface-sunken flex items-center justify-center font-bold text-fg-lo"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Text Column */}
        <div className="w-full lg:w-7/12 relative">
          <div className="space-y-8 lg:space-y-12">
            {JOURNEY_PARAGRAPHS.map((paragraph, i) => (
              <ScrollReveal key={i} delay={i * 0.1} direction="up">
                <div className="relative pl-6 lg:pl-10 before:absolute before:left-0 before:top-2 before:bottom-[-2rem] lg:before:bottom-[-3rem] last:before:bottom-0 before:w-px before:bg-[image:var(--gradient-rail)]">
                  {/* Timeline dot */}
                  <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-primary-500 ring-4 ring-white dark:ring-slate-900"></div>

                  <p className="text-base lg:text-lg leading-relaxed tracking-wide text-fg-mid">
                    {paragraph}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
