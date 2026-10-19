import { Award, Briefcase, Code2, GraduationCap, Layers, Mic2, Presentation, Share2, Trophy, Users } from "lucide-react";
import type { EventCategory, FilterGroupKey } from "@/types";
import type { LucideIcon } from "lucide-react";

export const categoryIcons: Record<EventCategory, LucideIcon> = {
  workshop: Mic2, conference: Users, hackathon: Trophy, certification: Award,
  community: Users, "knowledge-sharing": Share2, project: Code2, career: Briefcase,
  education: GraduationCap, achievement: Award, training: Presentation,
};
export const filterIcons: Record<"all" | FilterGroupKey, LucideIcon> = {
  all: Layers, speaking: Mic2, events: Users, projects: Code2, career: Briefcase, certs: Award,
};
