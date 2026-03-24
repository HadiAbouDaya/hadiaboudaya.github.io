import type { Metadata } from "next";
import { BioSection } from "@/components/about/BioSection";
import { KeyFacts } from "@/components/about/KeyFacts";
import { LanguagesSection } from "@/components/about/LanguagesSection";
import { JourneySection } from "@/components/about/JourneySection";
import { PageNextSection } from "@/components/ui/PageNextSection";
import { breadcrumbJsonLd, personJsonLd, profilePageJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "About Hadi Abou Daya - AI/ML Engineer & Consultant",
  description:
    "About Hadi Abou Daya, AI/ML Engineer building intelligent systems from edge AI to cloud infrastructure. Based in Paris, France.",
  alternates: { canonical: "/about/" },
  openGraph: { url: "/about/" },
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
        <LanguagesSection />
        <JourneySection />
        <PageNextSection
          suggestions={[
            { label: "Experience", description: "See my career timeline", href: "/experience", icon: "briefcase" },
            { label: "Events", description: "Workshops & conferences", href: "/events", icon: "calendar" },
            { label: "Contact", description: "Let's connect", href: "/contact", icon: "mail" },
          ]}
        />
      </div>
    </div>
  );
}
