import Link from "next/link";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { events } from "@/data/events";
import { categoryConfig } from "@/data/eventCategories";
import { type Accent } from "@/lib/accents";
import type { EventCategory } from "@/types";

// Category -> accent (5-accent system; no purple/violet/indigo).
const categoryAccent: Record<EventCategory, Accent> = {
  career: "blue",
  education: "blue",
  conference: "teal",
  hackathon: "teal",
  community: "teal",
  achievement: "teal",
  project: "emerald",
  certification: "amber",
  workshop: "orange",
  "knowledge-sharing": "orange",
  training: "orange",
};

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
          const Icon = config.icon;
          return (
            <Link
              key={event.slug}
              href={`/events/${event.slug}`}
              className="group flex items-center gap-3 p-3 rounded-card hover:bg-surface-sunken transition-colors duration-150"
            >
              <Badge accent={categoryAccent[event.category]}>
                <Icon className="w-3 h-3 mr-1" />
                {event.role ?? config.label}
              </Badge>
              <span className="text-sm font-medium text-fg-mid group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-150 truncate">
                {event.title}
              </span>
              <span className="ml-auto text-xs text-fg-lo shrink-0 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(event.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
