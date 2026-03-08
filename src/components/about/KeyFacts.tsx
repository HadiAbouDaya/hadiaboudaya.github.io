"use client";

import { Briefcase, Award, GraduationCap, Globe } from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import { CountingNumber } from "@/components/ui/CountingNumber";
import { KEY_FACTS } from "@/data/about";

function parseCountable(value: string): { number: number; suffix: string } | null {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return null;
  return { number: parseInt(match[1], 10), suffix: match[2] };
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  Award,
  GraduationCap,
  Globe,
};

export function KeyFacts() {
  return (
    <section className="mt-16 lg:mt-20">
      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {KEY_FACTS.map((fact) => {
          const Icon = iconMap[fact.icon];
          return (
            <StaggerItem key={fact.label}>
              <Card className="text-center group h-full">
                {Icon && (
                  <Icon className="w-8 h-8 text-primary-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                )}
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {fact.label}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {(() => {
                    const parsed = parseCountable(fact.value);
                    if (parsed) return <CountingNumber value={parsed.number} suffix={parsed.suffix} />;
                    return fact.value;
                  })()}
                </p>
                {fact.detail && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{fact.detail}</p>
                )}
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerChildren>
    </section>
  );
}
