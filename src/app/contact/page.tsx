import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LazyLoad } from "@/components/ui/LazyLoad";
import { FormSkeleton, ContactInfoSkeleton } from "@/components/ui/Skeleton";
import { breadcrumbJsonLd } from "@/lib/jsonld";

const ContactForm = dynamic(
  () => import("@/components/contact/ContactForm").then((m) => m.ContactForm),
);
const ContactInfo = dynamic(
  () => import("@/components/contact/ContactInfo").then((m) => m.ContactInfo),
);

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Hadi Abou Daya, AI/ML Engineer & Consultant based in Paris.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <div className="section-padding pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Contact", href: "/contact" }])) }}
      />
      <div className="container-main max-w-5xl">
        <SectionHeading
          title="Get in Touch"
          subtitle="Have a project in mind or just want to chat? I'd love to hear from you."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:items-end">
          <div className="lg:col-span-3">
            <LazyLoad fallback={<FormSkeleton />} rootMargin="400px">
              <ContactForm />
            </LazyLoad>
          </div>
          <div className="lg:col-span-2">
            <LazyLoad fallback={<ContactInfoSkeleton />} rootMargin="400px">
              <ContactInfo />
            </LazyLoad>
          </div>
        </div>
      </div>
    </div>
  );
}
