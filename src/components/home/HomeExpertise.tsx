import { Bot, Cloud, Eye, Lightbulb, FlaskConical, ChevronDown } from "lucide-react";
import { HOMEPAGE_EXPERTISE } from "@/data/about";

const ICON_MAP = { Bot, Cloud, Eye, Lightbulb, FlaskConical } as const;

export function HomeExpertise() {
  return (
    <section className="pb-16 bg-slate-900 dark:bg-slate-950">
      <div className="container-main px-4 sm:px-6 lg:px-8 max-w-3xl">
        <details className="group">
          <summary className="flex items-center gap-4 cursor-pointer list-none justify-center select-none">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-700" />
            <span className="text-xs tracking-wide uppercase text-slate-500 group-hover:text-slate-300 transition-colors flex items-center gap-2">
              Explore my expertise
              <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-open:rotate-180" />
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-700" />
          </summary>

          <div className="mt-8 space-y-3">
            {HOMEPAGE_EXPERTISE.map((section) => {
              const Icon = ICON_MAP[section.icon];
              return (
                <div
                  key={section.heading}
                  className="flex gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300"
                >
                  <Icon className="w-5 h-5 text-primary-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200 mb-1.5">
                      {section.heading}
                    </h3>
                    <div className="space-y-2 text-sm leading-relaxed text-slate-500">
                      {section.text.split("\n\n").map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      </div>
    </section>
  );
}
