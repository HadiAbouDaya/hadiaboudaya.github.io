import Link from "next/link";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { events } from "@/data/events";
import { categoryConfig, formatEventDate } from "@/data/eventCategories";
import { categoryIcons } from "./EventIcons";
import type { EventCategory } from "@/types";

interface RelatedEventsProps {
  currentSlug: string;
  currentCategory: EventCategory;
  currentTags: string[];
}

export function RelatedEvents({ currentSlug, currentCategory, currentTags }: RelatedEventsProps) {
  const related = events
    .filter((e) => e.slug !== currentSlug)
    .map((e) => {
      let score = 0;
      if (e.category === currentCategory) score += 2;
      score += e.tags.filter((t) => currentTags.includes(t)).length;
      return { event: e, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .filter((r) => r.score > 0);

  if (related.length === 0) return null;

  return (
    <div className="mt-10 pt-8 border-t border-line">
      <h3 className="text-eyebrow uppercase text-fg-mid mb-4">More Events</h3>
      <div className="space-y-3">
        {related.map(({ event }) => {
          const config = categoryConfig[event.category];
          const Icon = categoryIcons[event.category];
          return (
            <Link
              key={event.slug}
              href={`/events/${event.slug}/`}
              className="group flex flex-wrap items-center gap-3 p-3 rounded-card hover:bg-surface-sunken transition-colors duration-150"
            >
              <Badge accent={config.accent}>
                <Icon className="w-3 h-3 mr-1" />
                {event.role ?? config.label}
              </Badge>
              <span className="order-3 w-full text-sm font-medium text-fg-mid group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-150 sm:order-none sm:min-w-0 sm:flex-1">
                {event.title}
              </span>
              <span className="text-xs text-fg-lo flex items-center gap-1 sm:ml-auto">
                <Calendar className="w-3 h-3 shrink-0" />
                {formatEventDate(event, true)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
