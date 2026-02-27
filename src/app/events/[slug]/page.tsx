import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { events } from "@/data/events";
import { EventDetail } from "@/components/events/EventDetail";

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
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);

  if (!event) notFound();

  return (
    <div className="section-padding pt-24">
      <div className="container-main">
        <EventDetail event={event} />
      </div>
    </div>
  );
}
