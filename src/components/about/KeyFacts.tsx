"use client";

import { Briefcase, Award, GraduationCap, Globe } from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import { KEY_FACTS } from "@/data/about";

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
              <Card className="text-center group">
                {Icon && (
                  <Icon className="w-8 h-8 text-primary-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                )}
                <p className="text-sm text-slate-500 font-medium">
                  {fact.label}
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {fact.value}
                </p>
                {fact.detail && (
                  <p className="text-xs text-slate-400 mt-2">{fact.detail}</p>
                )}
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerChildren>
    </section>
  );
}
