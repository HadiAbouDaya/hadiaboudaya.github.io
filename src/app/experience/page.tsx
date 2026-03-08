import type { Metadata } from "next";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Career timeline of Hadi Abou Daya: from edge AI to cloud-scale LLM systems.",
};

export default function ExperiencePage() {
  return (
    <div className="section-padding pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Experience", href: "/experience" }])) }}
      />
      <div className="container-main">
        <SectionHeading
          title="Experience"
          subtitle="A timeline of my professional and academic journey from 2018 to present."
        />
        <ExperienceTimeline />
      </div>
    </div>
  );
}
