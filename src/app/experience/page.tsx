import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "@/components/experience/experience.module.css";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { TimelineCard } from "@/components/experience/TimelineCard";
import { professionalExperiences, educationExperiences } from "@/data/experience";
import { PageNextSection } from "@/components/ui/PageNextSection";
import { DEFAULT_OPEN_GRAPH, DEFAULT_TWITTER } from "@/lib/metadata";

export const metadata: Metadata = {
  title: { absolute: "Experience | Hadi Abou Daya" },
  description:
    "Hadi Abou Daya's professional experience, independent AI consulting engagements and education, with contributions across advisory, pilot and production work.",
  alternates: { canonical: "/experience/" },
  openGraph: {
    ...DEFAULT_OPEN_GRAPH,
    title: "Experience | Hadi Abou Daya",
    description: "Professional roles, independent AI consulting engagements and education.",
    url: "/experience/",
  },
  twitter: {
    ...DEFAULT_TWITTER,
    title: "Experience | Hadi Abou Daya",
    description: "Professional roles, independent AI consulting engagements and education.",
  },
};

export default function ExperiencePage() {
  return (
    <div className={`${styles.page} section-padding pt-24`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd([{ name: "Experience", href: "/experience/" }])) }}
      />
      <div className="container-main">
        <header id="experience-heading" tabIndex={-1}>
          <SectionHeading title="Experience" subtitle="Working at the intersection of business and AI." />
        </header>
        <ExperienceTimeline
          entries={[
            ...professionalExperiences.map(item => ({ id: item.id, kind: "professional" as const })),
            ...educationExperiences.map(item => ({ id: item.id, kind: "education" as const })),
          ]}
          professional={professionalExperiences.map(item => <TimelineCard key={item.id} item={item} />)}
          education={educationExperiences.map(item => <TimelineCard key={item.id} item={item} />)}
        />
        <PageNextSection
          suggestions={[
            { label: "About", description: "Background and approach", href: "/about/", icon: "book-open" },
            { label: "Certifications", description: "Credentials and learning", href: "/certifications/", icon: "award" },
            { label: "Contact", description: "Discuss a project or opportunity", href: "/contact/", icon: "mail" },
          ]}
        />
      </div>
    </div>
  );
}
