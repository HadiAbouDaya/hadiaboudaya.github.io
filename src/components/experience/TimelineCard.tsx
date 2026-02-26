"use client";

import type { Experience } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import {
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  User,
  ExternalLink,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineCardProps {
  item: Experience;
  position: "left" | "right";
}

const typeConfig = {
  work: {
    icon: Briefcase,
    dotColor: "bg-primary-600",
    ringColor: "ring-primary-200",
    borderColor: "border-t-primary-500",
    accentColor: "text-primary-600",
    bulletColor: "bg-primary-400",
    label: "Professional",
  },
  education: {
    icon: GraduationCap,
    dotColor: "bg-emerald-600",
    ringColor: "ring-emerald-200",
    borderColor: "border-t-emerald-500",
    accentColor: "text-emerald-600",
    bulletColor: "bg-emerald-400",
    label: "Education",
  },
  freelance: {
    icon: User,
    dotColor: "bg-violet-600",
    ringColor: "ring-violet-200",
    borderColor: "border-t-violet-500",
    accentColor: "text-violet-600",
    bulletColor: "bg-violet-400",
    label: "Freelance",
  },
};

function getDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    end.getMonth() -
    start.getMonth();
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${rem} mo`;
  if (rem === 0) return `${years} yr`;
  return `${years} yr ${rem} mo`;
}

export function TimelineCard({ item, position }: TimelineCardProps) {
  const config = typeConfig[item.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative flex items-start",
        position === "left" ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      {/* Timeline dot with colored ring */}
      <div
        className={cn(
          "absolute left-4 md:left-1/2 -translate-x-1/2 mt-6 z-10"
        )}
      >
        <div
          className={cn(
            "w-4 h-4 rounded-full shadow-sm ring-4",
            config.dotColor,
            config.ringColor
          )}
        />
      </div>

      {/* Card container */}
      <div
        className={cn(
          "ml-10 md:ml-0 md:w-[calc(50%-2rem)]",
          position === "left" ? "md:mr-auto" : "md:ml-auto"
        )}
      >
        <div
          className={cn(
            "bg-white rounded-xl border border-slate-200 border-t-[3px] p-5",
            config.borderColor,
            "shadow-sm hover:shadow-lg transition-all duration-300",
            "group"
          )}
        >
          <div className="flex items-start gap-4">
            {/* Company logo */}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
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
              {/* Type label + duration */}
              <div className="flex items-center gap-2 mb-1">
                <Icon
                  className={cn(
                    "w-4 h-4 flex-shrink-0",
                    config.accentColor
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider",
                    config.accentColor
                  )}
                >
                  {config.label}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
                  <Clock className="w-3 h-3" />
                  {getDuration(item.startDate, item.endDate)}
                </span>
              </div>

              {/* Role */}
              <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-primary-700 transition-colors">
                {item.role}
              </h3>

              {/* Company + external link */}
              <div className="flex items-center gap-1.5">
                <p className={cn("font-medium text-sm", config.accentColor)}>
                  {item.company}
                </p>
                {item.companyUrl && (
                  <a
                    href={item.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-primary-500 transition-colors"
                    aria-label={`Visit ${item.company} website`}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Period + location */}
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.period}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {item.location}
                </span>
              </div>

              {/* Description */}
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>

              {/* Bullet points with colored dots */}
              {item.bullets.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {item.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="text-sm text-slate-600 flex items-start gap-2"
                    >
                      <span
                        className={cn(
                          "mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full",
                          config.bulletColor
                        )}
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {/* Technology badges */}
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
        </div>
      </div>
    </div>
  );
}
