import type { Metadata } from "next";
import { SkillTabs } from "@/components/skills/SkillTabs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Technical skills of Hadi Abou Daya — AI/ML, Cloud & MLOps, and Software Engineering.",
};

export default function SkillsPage() {
  return (
    <div className="section-padding pt-24">
      <div className="container-main">
        <SectionHeading
          title="Skills"
          subtitle="Technologies and tools I work with"
        />
        <SkillTabs />
      </div>
    </div>
  );
}
