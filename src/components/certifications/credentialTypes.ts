import type { Certification } from "@/types";

export const certificationTypeLabels: Record<Certification["type"], string> = {
  certification: "Professional certification",
  programme: "Programme / specialisation",
  course: "Course",
  badge: "Enablement / accreditation badge",
};
