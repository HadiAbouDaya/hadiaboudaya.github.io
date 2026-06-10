"use client";

import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { LANGUAGES } from "@/data/about";
import { m } from "framer-motion";
import { VIEWPORT, fadeUp, staggerContainer } from "@/lib/motion";
import { Fragment } from "react";

export function LanguagesSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="mt-16 lg:mt-24 mb-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-eyebrow text-fg-lo">
          Languages
        </h2>
      </div>

      <div className="flex justify-center">
        <m.div
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={VIEWPORT}
          variants={staggerContainer()}
          className="flex flex-col sm:flex-row bg-surface-raised backdrop-blur-sm border border-line rounded-card sm:rounded-pill shadow-card hover:shadow-card-hover transition-shadow duration-300 w-full sm:w-auto max-w-3xl mx-auto overflow-hidden"
        >
          {LANGUAGES.map((lang, idx) => (
            <Fragment key={lang.name}>
              <m.div
                variants={fadeUp}
                className="flex justify-between sm:justify-center items-center gap-4 sm:gap-3 px-6 sm:px-8 py-4 sm:py-3.5 group cursor-default w-full sm:w-auto hover:bg-surface-sunken/50 transition-colors flex-1"
              >
                <span className="text-base sm:text-lg font-bold text-fg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {lang.name}
                </span>
                <span className="text-sm flex-shrink-0 font-medium text-fg-mid bg-surface-sunken sm:bg-transparent px-3 py-1 sm:p-0 rounded-pill transition-colors group-hover:bg-primary-50 dark:group-hover:bg-primary-900/40 sm:group-hover:bg-transparent sm:dark:group-hover:bg-transparent sm:group-hover:text-primary-500 sm:dark:group-hover:text-primary-400">
                  {lang.proficiency}
                </span>
              </m.div>

              {/* Divider */}
              {idx < LANGUAGES.length - 1 && (
                <div className="w-full sm:w-px h-px sm:h-auto self-stretch bg-line flex-shrink-0" />
              )}
            </Fragment>
          ))}
        </m.div>
      </div>
    </section>
  );
}
