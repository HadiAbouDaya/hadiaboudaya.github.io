import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Hadi Abou Daya — AI/ML Engineer & Consultant based in Paris.",
};

export default function ContactPage() {
  return (
    <div className="section-padding pt-24">
      <div className="container-main max-w-5xl">
        <SectionHeading
          title="Get in Touch"
          subtitle="Have a project in mind or just want to chat? I'd love to hear from you."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
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
