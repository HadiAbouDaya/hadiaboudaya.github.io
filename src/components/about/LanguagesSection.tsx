"use client";

import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { LANGUAGES } from "@/data/about";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";

export function LanguagesSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="mt-16 lg:mt-24 mb-8">
      <div className="text-center mb-10">
        <h2 className="text-sm font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Languages
        </h2>
      </div>

      <StaggerChildren className="flex justify-between items-center w-full max-w-4xl mx-auto px-4 overflow-x-auto no-scrollbar gap-x-4">
        {LANGUAGES.map((lang) => (
          <StaggerItem key={lang.name} className="flex-shrink-0 flex items-center">
            <div className="flex items-baseline gap-1.5 sm:gap-2 group cursor-default">
              <h3 className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300">
                {lang.name}
              </h3>
              <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide">
                {lang.proficiency}
              </span>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </section>
  );
}
