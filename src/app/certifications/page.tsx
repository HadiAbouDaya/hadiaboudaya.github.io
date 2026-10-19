import type { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH, DEFAULT_TWITTER } from "@/lib/metadata";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd, credentialListJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { CertFilter } from "@/components/certifications/CertFilter";
import { PageNextSection } from "@/components/ui/PageNextSection";
import { certifications } from "@/data/certifications";

const title = "Certifications & Learning - AWS, Azure, PMP and AI";
const description = "Professional certifications, programmes, courses and enablement badges completed by Hadi Abou Daya across AI, cloud, software engineering and project management.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/certifications/" },
  openGraph: { ...DEFAULT_OPEN_GRAPH, title, description, url: "/certifications/" },
  twitter: { ...DEFAULT_TWITTER, title, description },
};

export default function CertificationsPage() {
  return (
    <div className="section-padding pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd([{ name: "Certifications & Learning", href: "/certifications/" }])) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(credentialListJsonLd(certifications.filter((record) => record.type === "certification"))) }}
      />
      <div className="container-main">
        <SectionHeading
          title="Certifications & Learning"
        />
        <CertFilter certifications={certifications} />
        <PageNextSection
          suggestions={[
            { label: "Experience", description: "My career journey", href: "/experience", icon: "briefcase" },
            { label: "Blog", description: "Technical articles & insights", href: "/blog", icon: "book-open" },
            { label: "Contact", description: "Get in touch", href: "/contact", icon: "mail" },
          ]}
        />
      </div>
    </div>
  );
}
