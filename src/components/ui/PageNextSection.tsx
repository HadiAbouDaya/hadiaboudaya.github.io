"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Mail,
  Award,
  BookOpen,
} from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { trackEvent, EVENTS } from "@/lib/analytics";

const iconMap = {
  briefcase: Briefcase,
  calendar: Calendar,
  mail: Mail,
  award: Award,
  "book-open": BookOpen,
} as const;

export type PageNextIcon = keyof typeof iconMap;

interface Suggestion {
  label: string;
  description: string;
  href: string;
  icon: PageNextIcon;
}

interface PageNextSectionProps {
  suggestions: Suggestion[];
}

export function PageNextSection({ suggestions }: PageNextSectionProps) {
  return (
    <ScrollReveal>
      <div className="mt-16 pt-12 border-t border-line">
        <p className="text-eyebrow text-fg-lo mb-6 uppercase">
          Continue exploring
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((s) => {
            const Icon = iconMap[s.icon];
            return (
              <Link
                key={s.href}
                href={s.href}
                onClick={() => trackEvent(EVENTS.PAGE_SUGGESTION_CLICKED, { target: s.href, label: s.label })}
                className="group flex items-start gap-3 p-4 rounded-control hover:bg-surface-raised border border-transparent hover:border-line transition-colors duration-300"
              >
                <Icon className="w-5 h-5 mt-0.5 text-fg-lo group-hover:text-primary-500 transition-colors duration-300 shrink-0" />
                <div className="min-w-0">
                  <span className="text-sm font-medium text-fg flex items-center gap-1">
                    {s.label}
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </span>
                  <p className="text-sm text-fg-mid mt-0.5">
                    {s.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </ScrollReveal>
  );
}
