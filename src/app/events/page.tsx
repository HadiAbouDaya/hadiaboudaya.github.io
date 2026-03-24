import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { EventFilter } from "@/components/events/EventFilter";

export const metadata: Metadata = {
  title: "Events - AI Conferences, Hackathons & Workshops",
  description:
    "AI conferences, hackathons, and workshops attended by Hadi Abou Daya, including Beirut AI, AWS events, and technical meetups.",
  alternates: { canonical: "/events/" },
  openGraph: { url: "/events/" },
};

export default function EventsPage() {
  return (
    <div className="section-padding pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Events", href: "/events" }])) }}
      />
      <div className="container-main">
        <SectionHeading
          title="Events"
          subtitle="Workshops, conferences, hackathons, and milestones across my journey"
        />
        <EventFilter />
      </div>
    </div>
  );
}
