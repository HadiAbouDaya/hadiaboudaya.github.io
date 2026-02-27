"use client";

import Link from "next/link";
import type { Event } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";

const categoryColors: Record<Event["category"], string> = {
  career: "bg-primary-50 text-primary-700",
  education: "bg-emerald-50 text-emerald-700",
  project: "bg-violet-50 text-violet-700",
  achievement: "bg-amber-50 text-amber-700",
};

interface EventDetailProps {
  event: Event;
}

export function EventDetail({ event }: EventDetailProps) {
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto">
      <ScrollReveal>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge className={categoryColors[event.category]}>
            {event.category}
          </Badge>
          <span className="flex items-center gap-1 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="w-4 h-4" />
            {event.location}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
          {event.title}
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed mb-8">
          {event.summary}
        </p>

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed">{event.description}</p>
        </div>

        {event.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="primary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </ScrollReveal>
    </div>
  );
}
