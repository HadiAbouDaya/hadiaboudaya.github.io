"use client";

import type { Experience } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import {
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  User,
} from "lucide-react";

interface TimelineCardProps {
  item: Experience;
  position: "left" | "right";
}

const typeIcons = {
  work: Briefcase,
  education: GraduationCap,
  freelance: User,
};

const typeColors = {
  work: "bg-primary-600",
  education: "bg-emerald-600",
  freelance: "bg-violet-600",
};

export function TimelineCard({ item, position }: TimelineCardProps) {
  const Icon = typeIcons[item.type];

  return (
    <div
      className={`relative flex items-start gap-6 md:gap-0 ${
        position === "left" ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Timeline dot */}
      <div
        className={`absolute left-4 md:left-1/2 w-3 h-3 rounded-full ${typeColors[item.type]} ring-4 ring-white md:-translate-x-1/2 -translate-x-1/2 mt-6 z-10`}
      />

      {/* Card */}
      <div
        className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${
          position === "left" ? "md:mr-auto md:pr-0" : "md:ml-auto md:pl-0"
        }`}
      >
        <Card className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-slate-100">
              <ImageWithFallback
                src={item.logoPath}
                alt={item.company}
                width={48}
                height={48}
                fallbackText={item.company.slice(0, 2).toUpperCase()}
                className="w-full h-full object-contain p-1"
                fallbackClassName="w-full h-full text-xs"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {item.type === "education"
                    ? "Education"
                    : item.type === "freelance"
                    ? "Freelance"
                    : "Work"}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {item.role}
              </h3>
              <p className="text-primary-600 font-medium text-sm">
                {item.company}
              </p>

              <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.period}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.location}
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>

              {item.bullets.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {item.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="text-sm text-slate-600 flex items-start gap-2"
                    >
                      <span className="text-primary-500 mt-1.5 flex-shrink-0">
                        &bull;
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {item.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.technologies.map((tech) => (
                    <Badge key={tech} variant="primary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
