import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { PageNextSection } from "@/components/ui/PageNextSection";

export const metadata: Metadata = {
  title: "Experience - AI/ML Engineering Career Timeline",
  description:
    "Hadi Abou Daya's career in AI/ML engineering, from edge AI and IoT to cloud-scale LLM systems and consulting.",
  alternates: { canonical: "/experience/" },
  openGraph: { url: "/experience/" },
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
            { label: "Certifications", description: "Credentials & courses", href: "/certifications", icon: "award" },
            { label: "Events", description: "Conferences & hackathons", href: "/events", icon: "calendar" },
            { label: "Blog", description: "Technical articles", href: "/blog", icon: "book-open" },
          ]}
        />
      </div>
    </div>
  );
}
