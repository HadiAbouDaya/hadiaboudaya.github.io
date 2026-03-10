"use client";

import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { LANGUAGES } from "@/data/about";
import { motion } from "framer-motion";
import { Fragment } from "react";

export function LanguagesSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="mt-16 lg:mt-24 mb-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-sm font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Languages
        </h2>
      </div>

      <div className="flex justify-center">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-full shadow-sm hover:shadow-md transition-shadow duration-300 w-full sm:w-auto max-w-3xl mx-auto overflow-hidden"
        >
          {LANGUAGES.map((lang, idx) => (
            <Fragment key={lang.name}>
              <div className="flex justify-between sm:justify-center items-center gap-4 sm:gap-3 px-6 sm:px-8 py-4 sm:py-3.5 group cursor-default w-full sm:w-auto hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors flex-1">
                <span className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {lang.name}
                </span>
                <span className="text-sm flex-shrink-0 font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 sm:bg-transparent sm:dark:bg-transparent px-3 py-1 sm:p-0 rounded-full transition-colors group-hover:bg-primary-50 dark:group-hover:bg-primary-900/40 sm:group-hover:bg-transparent sm:dark:group-hover:bg-transparent sm:group-hover:text-primary-500 sm:dark:group-hover:text-primary-400">
                  {lang.proficiency}
                </span>
              </div>

              {/* Divider */}
              {idx < LANGUAGES.length - 1 && (
                <div className="w-full sm:w-px h-px sm:h-auto self-stretch bg-slate-200/60 dark:bg-slate-800/80 flex-shrink-0" />
              )}
            </Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
