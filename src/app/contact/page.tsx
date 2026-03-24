import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd, contactPointJsonLd } from "@/lib/jsonld";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";

export const metadata: Metadata = {
  title: "Contact - AI/ML Consulting & Collaboration",
  description:
    "Contact Hadi Abou Daya for AI/ML consulting, collaboration, or speaking opportunities. Based in Paris, France.",
  alternates: { canonical: "/contact/" },
  openGraph: { url: "/contact/" },
};

export default function ContactPage() {
  return (
    <div className="section-padding pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Contact", href: "/contact" }])) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPointJsonLd()) }}
      />
      <div className="container-main max-w-5xl">
        <SectionHeading
          title="Get in Touch"
          subtitle="Have a project in mind or just want to chat? I'd love to hear from you."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:items-end">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
          <div className="lg:col-span-2">
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
