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
          <p className="text-lg text-slate-600 leading-relaxed">{BIO}</p>
        </ScrollReveal>

        <ScrollReveal direction="right" className="md:col-span-2 flex justify-center">
          <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-2xl overflow-hidden shadow-xl">
            <ImageWithFallback
              src="/Media/profile/headshot.jpg"
              alt="Hadi Abou Daya"
              width={320}
              height={320}
              fallbackText="HA"
              className="w-full h-full object-cover"
              fallbackClassName="w-full h-full rounded-2xl text-3xl"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
