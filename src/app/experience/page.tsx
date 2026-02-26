import type { Metadata } from "next";
import { Timeline } from "@/components/experience/Timeline";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Career timeline of Hadi Abou Daya — from edge AI to cloud-scale LLM systems.",
};

export default function ExperiencePage() {
  return (
    <div className="section-padding pt-24">
      <div className="container-main">
        <SectionHeading
          title="Experience"
          subtitle="My professional journey from 2018 to today"
        />
        <Timeline />
      </div>
    </div>
  );
}
