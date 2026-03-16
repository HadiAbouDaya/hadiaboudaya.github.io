import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LazyLoad } from "@/components/ui/LazyLoad";
import { CardGridSkeleton, PageNextSkeleton } from "@/components/ui/Skeleton";
import { breadcrumbJsonLd } from "@/lib/jsonld";

const CertFilter = dynamic(
  () => import("@/components/certifications/CertFilter").then((m) => m.CertFilter),
);
const PageNextSection = dynamic(
  () => import("@/components/ui/PageNextSection").then((m) => m.PageNextSection),
);

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "Industry-recognized certifications and courses across AI, cloud, security, and project management.",
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
          subtitle="Industry-recognized credentials and courses across AI, cloud, and engineering"
        />
        <LazyLoad fallback={<CardGridSkeleton cols={3} rows={3} />}>
          <CertFilter />
        </LazyLoad>
        <LazyLoad fallback={<PageNextSkeleton />}>
          <PageNextSection
            suggestions={[
              { label: "Experience", description: "My career journey", href: "/experience", icon: "briefcase" },
              { label: "Blog", description: "Technical articles & insights", href: "/blog", icon: "book-open" },
              { label: "Contact", description: "Get in touch", href: "/contact", icon: "mail" },
            ]}
          />
        </LazyLoad>
      </div>
    </div>
  );
}
