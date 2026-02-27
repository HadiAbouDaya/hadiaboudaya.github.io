import type { Metadata } from "next";
import { EventFilter } from "@/components/events/EventFilter";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Key milestones and events in Hadi Abou Daya's career, from edge AI to cloud-scale LLM systems.",
};

export default function EventsPage() {
  return (
    <div className="section-padding pt-24">
      <div className="container-main">
        <SectionHeading
          title="Events"
          subtitle="Key milestones and projects across my journey"
        />
        <EventFilter />
      </div>
    </div>
  );
}
