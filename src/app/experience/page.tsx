import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LazyLoad } from "@/components/ui/LazyLoad";
import { TimelineSkeleton, PageNextSkeleton } from "@/components/ui/Skeleton";
import { breadcrumbJsonLd } from "@/lib/jsonld";

const ExperienceTimeline = dynamic(
  () => import("@/components/experience/ExperienceTimeline").then((m) => m.ExperienceTimeline),
);
const PageNextSection = dynamic(
  () => import("@/components/ui/PageNextSection").then((m) => m.PageNextSection),
);

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Hadi Abou Daya's career in AI/ML engineering, from edge AI and IoT to cloud-scale LLM systems and consulting.",
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
        <LazyLoad fallback={<TimelineSkeleton />}>
          <ExperienceTimeline />
        </LazyLoad>
        <LazyLoad fallback={<PageNextSkeleton />}>
          <PageNextSection
            suggestions={[
              { label: "Certifications", description: "Credentials & courses", href: "/certifications", icon: "award" },
              { label: "Events", description: "Conferences & hackathons", href: "/events", icon: "calendar" },
              { label: "Blog", description: "Technical articles", href: "/blog", icon: "book-open" },
            ]}
          />
        </LazyLoad>
      </div>
    </div>
  );
}
