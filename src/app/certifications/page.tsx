import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd, credentialListJsonLd } from "@/lib/jsonld";
import { CertFilter } from "@/components/certifications/CertFilter";
import { PageNextSection } from "@/components/ui/PageNextSection";
import { certifications } from "@/data/certifications";

export const metadata: Metadata = {
  title: "Certifications - AWS, Azure, PMP & AI/ML Credentials",
  description:
    "AWS, Azure, PMP, and AI/ML certifications held by Hadi Abou Daya. Industry-recognized credentials in cloud computing, AI, and project management.",
  alternates: { canonical: "/certifications/" },
  openGraph: { url: "/certifications/" },
};

export default function CertificationsPage() {
  return (
    <div className="section-padding pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Certifications", href: "/certifications" }])) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(credentialListJsonLd(certifications)) }}
      />
      <div className="container-main">
        <SectionHeading
          title="Certifications"
          subtitle="Industry-recognized credentials and courses across AI, cloud, and engineering"
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
