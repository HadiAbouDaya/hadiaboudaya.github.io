import type { Event, EventCategory, FilterGroupKey } from "@/types";
import type { Accent } from "@/lib/accents";
import { formatDate, formatMonth } from "@/lib/dates";

export interface CategoryConfig {
  label: string;
  accent: Accent;
  filterGroup: FilterGroupKey;
}

// Public classification is independent of the icon and interaction libraries.
export const categoryConfig: Record<EventCategory, CategoryConfig> = {
  workshop: { label: "Workshop", accent: "orange", filterGroup: "speaking" },
  conference: { label: "Conference", accent: "teal", filterGroup: "events" },
  hackathon: { label: "Hackathon", accent: "teal", filterGroup: "events" },
  certification: { label: "Learning milestone", accent: "amber", filterGroup: "certs" },
  community: { label: "Community", accent: "teal", filterGroup: "events" },
  "knowledge-sharing": { label: "Knowledge sharing", accent: "orange", filterGroup: "speaking" },
  project: { label: "Project milestone", accent: "emerald", filterGroup: "projects" },
  career: { label: "Career milestone", accent: "blue", filterGroup: "career" },
  education: { label: "Education milestone", accent: "blue", filterGroup: "career" },
  achievement: { label: "Recognition", accent: "teal", filterGroup: "events" },
  training: { label: "Training", accent: "orange", filterGroup: "speaking" },
};

export interface FilterGroup {
  key: "all" | FilterGroupKey;
  label: string;
}

export const FILTER_GROUPS: FilterGroup[] = [
  { key: "all", label: "All" },
  { key: "speaking", label: "Speaking, Training & Mentoring" },
  { key: "events", label: "Conferences & Community" },
  { key: "projects", label: "Project Milestones" },
  { key: "career", label: "Career & Education" },
  { key: "certs", label: "Learning Milestones" },
];

export type EventSummary = Pick<Event,
  "slug" | "title" | "date" | "datePrecision" | "dateMeaning" | "category" |
  "filterOverride" | "role" | "location" | "summary" | "organizations" |
  "tier" | "imagePosition" | "caseStudySlug" | "relatedExperienceId"
> & { coverImage?: string };

// Deliberately exclude detail prose, image galleries, source URLs and enrichment.
export function toEventSummary(event: Event): EventSummary {
  const { slug, title, date, datePrecision, dateMeaning, category, filterOverride,
    role, location, summary, organizations, tier, imagePosition, caseStudySlug, relatedExperienceId } = event;
  return { slug, title, date, datePrecision, dateMeaning, category, filterOverride,
    role, location, summary, organizations, tier, imagePosition, caseStudySlug, relatedExperienceId,
    coverImage: event.images?.[0] };
}

export function getEventFilterGroup(event: Pick<Event, "category" | "filterOverride">): FilterGroupKey {
  return event.filterOverride ?? categoryConfig[event.category].filterGroup;
}

const DATE_MEANING_LABELS = {
  occurrence: "",
  announcement: "Announcement",
  milestone: "Milestone",
  completion: "Completion",
  start: "Started",
};

export function formatEventDate(event: Pick<Event, "date" | "datePrecision" | "dateMeaning" | "slug">, compact = false): string {
  // These records describe contribution periods whose appointment dates are not established.
  if (event.slug === "vp-ceuzb-usj") return "University years";
  if (event.slug === "beirut-ai-technical-ambassador" || event.slug === "beirut-ai-student-ambassador") return "Community contribution";
  const month = compact ? "short" : "long";
  const date = event.datePrecision === "day"
    ? formatDate(event.date, { month })
    : formatMonth(event.date.slice(0, 7), { month });
  const meaning = event.dateMeaning ? DATE_MEANING_LABELS[event.dateMeaning] : "";
  return meaning ? `${meaning}: ${date}` : date;
}
