import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LazyLoad } from "@/components/ui/LazyLoad";
import { CardGridSkeleton } from "@/components/ui/Skeleton";
import { breadcrumbJsonLd } from "@/lib/jsonld";

const EventFilter = dynamic(
  () => import("@/components/events/EventFilter").then((m) => m.EventFilter),
);

export const metadata: Metadata = {
  title: "Events",
  description:
    "AI conferences, hackathons, and workshops attended by Hadi Abou Daya, including Beirut AI, AWS events, and technical meetups.",
  alternates: { canonical: "/events/" },
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
        <LazyLoad fallback={<CardGridSkeleton cols={2} rows={3} />}>
          <EventFilter />
        </LazyLoad>
      </div>
    </div>
  );
}
