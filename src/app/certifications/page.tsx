import type { Metadata } from "next";
import { CertFilter } from "@/components/certifications/CertFilter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageNextSection } from "@/components/ui/PageNextSection";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "45+ professional certifications including AWS, Azure, PMP, and AI/ML credentials.",
  alternates: { canonical: "/certifications/" },
};

export default function CertificationsPage() {
  return (
    <div className="section-padding pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Certifications", href: "/certifications" }])) }}
      />
      <div className="container-main">
        <SectionHeading
          title="Certifications"
          subtitle="45+ professional certifications across AI, cloud, and engineering"
        />
        <CertFilter />
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
