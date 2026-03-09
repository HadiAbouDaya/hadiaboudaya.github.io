"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { JOURNEY_PARAGRAPHS } from "@/data/about";

export function JourneySection() {
  return (
    <section className="mt-20 lg:mt-32 relative">
      <ScrollReveal className="mb-12 lg:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
          My Journey
        </h2>
      </ScrollReveal>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start relative">
        {/* Sticky Image Column */}
        <div className="w-full lg:w-5/12 lg:sticky lg:top-32 z-10">
          <ScrollReveal direction="left">
            <div className="relative group">
              {/* Decorative background blobs */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 via-purple-500 to-cyan-400 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur-2xl transition-all duration-700 ease-in-out"></div>

              {/* Image Container with inner shadow and subtle border */}
              <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 dark:border-slate-800/50 transform transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/60 z-10 transition-opacity duration-300"></div>

                <ImageWithFallback
                  src="/Media/profile/journey.webp"
                  alt="Hadi Abou Daya"
                  width={400}
                  height={500}
                  fallbackText="HA"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  fallbackClassName="w-full h-full rounded-[2rem] text-5xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400"
                />

                {/* Decorative Elements overlaid on image */}
                <div className="absolute bottom-6 left-6 right-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-white font-medium tracking-wide">Always learning</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Text Column */}
        <div className="w-full lg:w-7/12 relative">
          <div className="space-y-8 lg:space-y-12">
            {JOURNEY_PARAGRAPHS.map((paragraph, i) => (
              <ScrollReveal key={i} delay={i * 0.1} direction="up">
                <div className="relative pl-6 lg:pl-10 before:absolute before:left-0 before:top-2 before:bottom-[-2rem] lg:before:bottom-[-3rem] last:before:bottom-0 before:w-px before:bg-gradient-to-b before:from-blue-500/50 before:to-transparent">
                  {/* Timeline dot */}
                  <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] ring-4 ring-white dark:ring-slate-900"></div>

                  <p className={`leading-relaxed tracking-wide ${i === 0
                    ? 'text-lg lg:text-xl font-medium text-slate-800 dark:text-slate-200'
                    : 'text-base lg:text-lg text-slate-600 dark:text-slate-400'
                    }`}>
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
