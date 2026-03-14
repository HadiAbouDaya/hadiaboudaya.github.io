import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { events } from "@/data/events";
import { EventDetail } from "@/components/events/EventDetail";
import { RelatedEvents } from "@/components/events/RelatedEvents";
import { breadcrumbJsonLd, eventJsonLd } from "@/lib/jsonld";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);
  if (!event) return { title: "Event Not Found" };

  return {
    title: event.title,
    description: event.summary,
    alternates: { canonical: `/events/${slug}/` },
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);

  if (!event) notFound();

  return (
    <div className="section-padding pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Events", href: "/events" }, { name: event.title, href: `/events/${event.slug}` }])) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd(event)) }}
      />
      <div className="container-main">
        <EventDetail event={event} />
        <div className="max-w-3xl mx-auto">
          <RelatedEvents
            currentSlug={event.slug}
            currentCategory={event.category}
            currentTags={event.tags}
          />
        </div>
      </div>
    </div>
  );
}
