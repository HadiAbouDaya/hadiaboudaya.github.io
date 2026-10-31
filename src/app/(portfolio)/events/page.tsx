import type { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH, DEFAULT_TWITTER } from "@/lib/metadata";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { events } from "@/data/events";
import { toEventSummary } from "@/data/eventCategories";
import { EventFilter } from "@/components/events/EventFilter";

const title = "Events - AI Conferences, Hackathons & Workshops";
const description = "Speaking, practical AI training, mentoring, conference participation and career milestones from Hadi Abou Daya.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/events/" },
  openGraph: { ...DEFAULT_OPEN_GRAPH, title, description, url: "/events/" },
  twitter: { ...DEFAULT_TWITTER, title, description },
};

export default function EventsPage() {
  return (
    <div className="section-padding pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd([{ name: "Events", href: "/events/" }])) }}
      />
      <div className="container-main">
        <SectionHeading
          title="Events"
          subtitle="Workshops, conferences, hackathons, and milestones across my journey"
        />
        <EventFilter events={events.map(toEventSummary)} />
      </div>
    </div>
  );
}
