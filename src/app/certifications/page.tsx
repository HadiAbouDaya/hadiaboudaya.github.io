import type { Metadata } from "next";
import { CertFilter } from "@/components/certifications/CertFilter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "45+ professional certifications including AWS, Azure, PMP, and AI/ML credentials.",
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
      </div>
    </div>
  );
}
