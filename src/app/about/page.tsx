import { DEFAULT_OPEN_GRAPH, DEFAULT_TWITTER } from "@/lib/metadata";
import type { Metadata } from "next";
import { BioSection } from "@/components/about/BioSection";
import { KeyFacts } from "@/components/about/KeyFacts";
import { LanguagesSection } from "@/components/about/LanguagesSection";
import { JourneySection } from "@/components/about/JourneySection";
import { PageNextSection } from "@/components/ui/PageNextSection";
import { breadcrumbJsonLd, profilePageJsonLd, serializeJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "About | AI Consultant & Software Engineer",
  description:
    "AI consultant in Paris combining client discovery, solution design and hands-on AI engineering.",
  alternates: { canonical: "/about/" },
  twitter: DEFAULT_TWITTER,
  openGraph: { ...DEFAULT_OPEN_GRAPH, url: "/about/" },
};

export default function AboutPage() {
  return (
    <div className="section-padding pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd([{ name: "About", href: "/about" }])) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(profilePageJsonLd()) }}
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
