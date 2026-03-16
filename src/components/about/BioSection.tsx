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
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{BIO}</p>
        </ScrollReveal>

        <ScrollReveal direction="right" className="md:col-span-2 flex justify-center">
          <div className="relative w-56 h-72 lg:w-64 lg:h-80 rounded-2xl overflow-hidden shadow-xl">
            <ImageWithFallback
              src="/Media/profile/headshot.webp"
              alt="Hadi Abou Daya"
              width={320}
              height={400}
              priority
              fallbackText="HA"
              className="w-full h-full object-cover object-[center_20%]"
              fallbackClassName="w-full h-full rounded-2xl text-3xl"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
