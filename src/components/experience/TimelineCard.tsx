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
import { ACCENTS, type Accent } from "@/lib/accents";

interface TimelineCardProps {
  item: Experience;
  position: "left" | "right";
  showDot?: boolean;
  isDualLane?: boolean;
}

export const typeConfig: Record<
  Experience["type"],
  { icon: typeof Briefcase; accent: Accent; label: string }
> = {
  work: { icon: Briefcase, accent: "blue", label: "Professional" },
  education: { icon: GraduationCap, accent: "teal", label: "Education" },
  freelance: { icon: User, accent: "emerald", label: "Freelance" },
};

function getDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    end.getMonth() -
    start.getMonth() +
    1;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${rem} mo`;
  if (rem === 0) return `${years} yr`;
  return `${years} yr ${rem} mo`;
}

export function TimelineCard({ item, position, showDot = true, isDualLane = false }: TimelineCardProps) {
  const config = typeConfig[item.type];
  const Icon = config.icon;
  const accent = ACCENTS[config.accent];

  return (
    <div
      id={`exp-${item.id}`}
      className={cn(
        "relative flex items-start w-full scroll-mt-24",
        !isDualLane && (position === "left" ? "md:flex-row" : "md:flex-row-reverse")
      )}
    >
      {/* Mobile dot */}
      {showDot && (
        <div className="md:hidden absolute left-4 -translate-x-1/2 mt-6 z-10">
          <div className={cn("w-4 h-4 rounded-full ring-4 ring-surface", accent.dot)} />
        </div>
      )}

      {/* Desktop dot */}
      {showDot && (
        <div
          className={cn(
            "hidden md:block absolute mt-6 z-10",
            !isDualLane && "left-1/2 -translate-x-1/2",
            isDualLane && position === "left" && "-right-8 translate-x-[50%]",
            isDualLane && position === "right" && "-left-8 -translate-x-[50%]"
          )}
        >
          <div className={cn("w-4 h-4 rounded-full ring-4 ring-surface", accent.dot)} />
        </div>
      )}

      {/* Horizontal connector from center line to card edge */}
      {showDot && (
        <div
          className={cn(
            "hidden md:block absolute top-[2.125rem] border-t-[3px] border-dashed border-line-strong -z-10",
            "w-8",
            isDualLane && position === "left" && "-right-8",
            isDualLane && position === "right" && "-left-8",
            !isDualLane && position === "left" && "left-[calc(50%-2rem)]",
            !isDualLane && position === "right" && "left-1/2"
          )}
        />
      )}

      {/* Card container */}
      <div
        className={cn(
          "ml-10 md:ml-0 relative z-10 w-full",
          !isDualLane && "md:w-[calc(50%-2rem)]",
          !isDualLane && (position === "left" ? "md:mr-auto" : "md:ml-auto")
        )}
      >
        <div
          className={cn(
            "bg-surface-raised rounded-card border border-line border-t-[4px] p-6",
            accent.border,
            "card-spotlight shadow-card transition-[box-shadow,border-color,transform] duration-300",
            "hover:shadow-glow-sm hover:-translate-y-0.5",
            "group"
          )}
        >
          <div className="flex items-start gap-4">
            {/* Company logo */}
            <div className="flex-shrink-0 w-12 h-12 rounded-control overflow-hidden bg-slate-50 dark:bg-slate-200 border border-slate-100 dark:border-slate-300">
              <ImageWithFallback
                src={item.logoPath}
                alt={`${item.company} logo`}
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
                    accent.text
                  )}
                />
                <span
                  className={cn(
                    "text-eyebrow uppercase",
                    accent.text
                  )}
                >
                  {config.label}
                </span>
                <span className="text-xs text-fg-lo flex items-center gap-1 ml-auto">
                  <Clock className="w-3 h-3" />
                  {getDuration(item.startDate, item.endDate)}
                </span>
              </div>

              {/* Role */}
              <h3 className="text-title text-fg leading-tight group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                {item.role}
              </h3>

              {/* Company + external link */}
              <div className="flex items-center gap-1.5">
                <p className={cn("font-medium text-sm", accent.text)}>
                  {item.company}
                </p>
                {item.companyUrl && (
                  <a
                    href={item.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg-lo hover:text-primary-500 transition-colors"
                    aria-label={`Visit ${item.company} website`}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Period + location */}
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-fg-mid">
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
              <p className="mt-3 text-sm text-fg-mid leading-relaxed">
                {item.description}
              </p>

              {/* Bullet points with colored dots */}
              {item.bullets.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {item.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="text-sm text-fg-mid flex items-start gap-2"
                    >
                      <span
                        className={cn(
                          "mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full",
                          accent.dot
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
