import type { Metadata } from "next";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageNextSection } from "@/components/ui/PageNextSection";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Career timeline of Hadi Abou Daya: from edge AI to cloud-scale LLM systems.",
  alternates: { canonical: "/experience/" },
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
        <PageNextSection
          suggestions={[
            { label: "Certifications", description: "45+ professional credentials", href: "/certifications", icon: "award" },
            { label: "Events", description: "Conferences & hackathons", href: "/events", icon: "calendar" },
            { label: "Blog", description: "Technical articles", href: "/blog", icon: "book-open" },
          ]}
        />
      </div>
    </div>
  );
}
