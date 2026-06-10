import type { EventCategory, FilterGroupKey } from "@/types";
import type { Accent } from "@/lib/accents";
import {
  Mic2,
  Award,
  Briefcase,
  Code2,
  GraduationCap,
  Users,
  Trophy,
  Share2,
  Layers,
  Presentation,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface CategoryConfig {
  label: string;
  accent: Accent;
  icon: LucideIcon;
  filterGroup: FilterGroupKey;
}

export const categoryConfig: Record<EventCategory, CategoryConfig> = {
  workshop: {
    label: "Workshop",
    accent: "orange",
    icon: Mic2,
    filterGroup: "speaking",
  },
  conference: {
    label: "Conference",
    accent: "teal",
    icon: Users,
    filterGroup: "events",
  },
  hackathon: {
    label: "Hackathon",
    accent: "teal",
    icon: Trophy,
    filterGroup: "events",
  },
  certification: {
    label: "Certification",
    accent: "amber",
    icon: Award,
    filterGroup: "certs",
  },
  community: {
    label: "Community",
    accent: "teal",
    icon: Users,
    filterGroup: "events",
  },
  "knowledge-sharing": {
    label: "Knowledge Sharing",
    accent: "orange",
    icon: Share2,
    filterGroup: "speaking",
  },
  project: {
    label: "Project",
    accent: "emerald",
    icon: Code2,
    filterGroup: "projects",
  },
  career: {
    label: "Career",
    accent: "blue",
    icon: Briefcase,
    filterGroup: "career",
  },
  education: {
    label: "Education",
    accent: "blue",
    icon: GraduationCap,
    filterGroup: "career",
  },
  achievement: {
    label: "Achievement",
    accent: "teal",
    icon: Award,
    filterGroup: "events",
  },
  training: {
    label: "Corporate Training",
    accent: "orange",
    icon: Presentation,
    filterGroup: "speaking",
  },
};

export interface FilterGroup {
  key: "all" | FilterGroupKey;
  label: string;
  icon: LucideIcon;
}

export const FILTER_GROUPS: FilterGroup[] = [
  { key: "all", label: "All", icon: Layers },
  { key: "speaking", label: "Speaking & Workshops", icon: Mic2 },
  { key: "events", label: "Conferences & Community", icon: Users },
  { key: "projects", label: "Projects", icon: Code2 },
  { key: "career", label: "Career & Education", icon: Briefcase },
  { key: "certs", label: "Certifications", icon: Award },
];
