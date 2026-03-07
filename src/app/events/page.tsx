import type { Metadata } from "next";
import { EventFilter } from "@/components/events/EventFilter";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Workshops, conferences, hackathons, certifications, and milestones across Hadi Abou Daya's journey.",
};

export default function EventsPage() {
  return (
    <div className="section-padding pt-24">
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
