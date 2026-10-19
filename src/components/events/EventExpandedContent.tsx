import Link from "next/link";
import type { EventSummary } from "@/data/eventCategories";

// The archive never receives detail descriptions or galleries. Those are rendered
// on the individual server page, keeping filtering independent of gallery code.
export function EventExpandedContent({ event }: { event: EventSummary }) {
  return (
    <div className="pt-4 text-sm text-fg-mid space-y-3">
      {event.organizations && event.organizations.length > 0 && <p><span className="font-medium text-fg">With: </span>{event.organizations.join(", ")}</p>}
      {(event.caseStudySlug || event.relatedExperienceId) && <p><Link href={event.caseStudySlug ? `/experience/#project-${event.caseStudySlug}` : `/experience/#exp-${event.relatedExperienceId}`} className="font-medium text-primary-600 dark:text-primary-400">{event.caseStudySlug ? "Explore the project in Experience →" : "Explore the related experience →"}</Link></p>}
    </div>
  );
}
