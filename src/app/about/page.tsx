import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { BioSection } from "@/components/about/BioSection";
import { KeyFacts } from "@/components/about/KeyFacts";
import { LazyLoad } from "@/components/ui/LazyLoad";
import { LanguagesSkeleton, TextBlockSkeleton, PageNextSkeleton } from "@/components/ui/Skeleton";
import { breadcrumbJsonLd, personJsonLd, profilePageJsonLd } from "@/lib/jsonld";

const LanguagesSection = dynamic(
  () => import("@/components/about/LanguagesSection").then((m) => m.LanguagesSection),
);
const JourneySection = dynamic(
  () => import("@/components/about/JourneySection").then((m) => m.JourneySection),
);
const PageNextSection = dynamic(
  () => import("@/components/ui/PageNextSection").then((m) => m.PageNextSection),
);

export const metadata: Metadata = {
  title: "About",
  description:
    "About Hadi Abou Daya, AI/ML Engineer building intelligent systems from edge AI to cloud infrastructure. Based in Paris, France.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <div className="section-padding pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "About", href: "/about" }])) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd()) }}
      />
      <div className="container-main">
        <BioSection />
        <KeyFacts />
        <LazyLoad fallback={<LanguagesSkeleton />}>
          <LanguagesSection />
        </LazyLoad>
        <LazyLoad fallback={<TextBlockSkeleton />}>
          <JourneySection />
        </LazyLoad>
        <LazyLoad fallback={<PageNextSkeleton />}>
          <PageNextSection
            suggestions={[
              { label: "Experience", description: "See my career timeline", href: "/experience", icon: "briefcase" },
              { label: "Events", description: "Workshops & conferences", href: "/events", icon: "calendar" },
              { label: "Contact", description: "Let's connect", href: "/contact", icon: "mail" },
            ]}
          />
        </LazyLoad>
      </div>
    </div>
  );
}
