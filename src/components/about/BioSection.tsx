"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BIO } from "@/data/about";

export function BioSection() {
  return (
    <section>
      <SectionHeading title="About Me" subtitle="AI/ML Engineer based in Paris, France" />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 items-center">
        <ScrollReveal direction="left" className="md:col-span-3">
          <p className="text-lg text-fg-mid leading-relaxed">{BIO}</p>
        </ScrollReveal>

        <ScrollReveal direction="right" className="md:col-span-2 flex justify-center">
          <div className="relative w-56 h-72 lg:w-64 lg:h-80 rounded-card overflow-hidden ring-1 ring-slate-900/10 dark:ring-white/10 shadow-card-hover">
            <ImageWithFallback
              src="/Media/profile/headshot.webp"
              alt="Headshot of Hadi Abou Daya"
              width={320}
              height={400}
              priority
              sizes="(min-width: 1024px) 16rem, 14rem"
              fallbackText="HA"
              className="w-full h-full object-cover object-[center_20%]"
              fallbackClassName="w-full h-full rounded-card text-3xl"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
