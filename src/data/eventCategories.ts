import type { EventCategory } from "@/types";
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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface CategoryConfig {
  label: string;
  color: string;
  borderColor: string;
  icon: LucideIcon;
  filterGroup: string;
}

export const categoryConfig: Record<EventCategory, CategoryConfig> = {
  workshop: {
    label: "Workshop",
    color: "bg-orange-50 text-orange-700",
    borderColor: "border-l-orange-500",
    icon: Mic2,
    filterGroup: "speaking",
  },
  conference: {
    label: "Conference",
    color: "bg-sky-50 text-sky-700",
    borderColor: "border-l-sky-500",
    icon: Users,
    filterGroup: "events",
  },
  hackathon: {
    label: "Hackathon",
    color: "bg-rose-50 text-rose-700",
    borderColor: "border-l-rose-500",
    icon: Trophy,
    filterGroup: "certs",
  },
  certification: {
    label: "Certification",
    color: "bg-amber-50 text-amber-700",
    borderColor: "border-l-amber-500",
    icon: Award,
    filterGroup: "certs",
  },
  community: {
    label: "Community",
    color: "bg-teal-50 text-teal-700",
    borderColor: "border-l-teal-500",
    icon: Users,
    filterGroup: "events",
  },
  "knowledge-sharing": {
    label: "Knowledge Sharing",
    color: "bg-orange-50 text-orange-700",
    borderColor: "border-l-orange-500",
    icon: Share2,
    filterGroup: "speaking",
  },
  project: {
    label: "Project",
    color: "bg-violet-50 text-violet-700",
    borderColor: "border-l-violet-500",
    icon: Code2,
    filterGroup: "projects",
  },
  career: {
    label: "Career",
    color: "bg-primary-50 text-primary-700",
    borderColor: "border-l-primary-500",
    icon: Briefcase,
    filterGroup: "career",
  },
  education: {
    label: "Education",
    color: "bg-emerald-50 text-emerald-700",
    borderColor: "border-l-emerald-500",
    icon: GraduationCap,
    filterGroup: "career",
  },
  achievement: {
    label: "Achievement",
    color: "bg-amber-50 text-amber-700",
    borderColor: "border-l-amber-500",
    icon: Award,
    filterGroup: "certs",
  },
};

export interface FilterGroup {
  key: string;
  label: string;
  icon: LucideIcon;
}

export const FILTER_GROUPS: FilterGroup[] = [
  { key: "all", label: "All", icon: Layers },
  { key: "speaking", label: "Speaking & Workshops", icon: Mic2 },
  { key: "events", label: "Conferences & Community", icon: Users },
  { key: "projects", label: "Projects", icon: Code2 },
  { key: "career", label: "Career & Education", icon: Briefcase },
  { key: "certs", label: "Certs & Awards", icon: Award },
];
