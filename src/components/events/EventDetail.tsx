"use client";

import Link from "next/link";
import Image from "next/image";
import type { Event } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { categoryConfig } from "@/data/eventCategories";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { CreativeCarousel } from "@/components/ui/CreativeCarousel";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

interface EventDetailProps {
  event: Event;
}

export function EventDetail({ event }: EventDetailProps) {
  const config = categoryConfig[event.category];
  const CategoryIcon = config.icon;

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
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge className={config.color}>
            <CategoryIcon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
          {event.role && <Badge variant="primary">{event.role}</Badge>}
          <span className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            <MapPin className="w-4 h-4" />
            {event.location}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
          {event.title}
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
          {event.summary}
        </p>

        {event.images && event.images.length > 0 && (
          <ImageLightbox images={event.images} alt={event.title}>
            {(openAt) =>
              event.images!.length > 3 ? (
                <CreativeCarousel
                  images={event.images!}
                  alt={event.title}
                  onImageClick={openAt}
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {event.images!.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => openAt(i)}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-zoom-in"
                    >
                      <Image
                        src={img}
                        alt={`${event.title} ${i + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    </button>
                  ))}
                </div>
              )
            }
          </ImageLightbox>
        )}

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{event.description}</p>
        </div>

        {event.organizations && event.organizations.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Organizations
            </h3>
            <div className="flex flex-wrap gap-2">
              {event.organizations.map((org) => (
                <span
                  key={org}
                  className="text-sm px-3 py-1 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700"
                >
                  {org}
                </span>
              ))}
            </div>
          </div>
        )}

        {event.tags.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="primary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {event.linkedinUrl && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <a
              href={event.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View on LinkedIn
            </a>
          </div>
        )}

        {event.credlyUrls && event.credlyUrls.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Certification {event.credlyUrls.length > 1 ? "Badges" : "Badge"}
            </h3>
            <div className="flex flex-wrap gap-3">
              {event.credlyUrls.map((url, index) => {
                // Extract badge name from URL or use generic label
                let badgeLabel = "View Certification Badge";

                // Check if this is an AWS certification event
                if (event.slug === "aws-ml-cloud-certifications") {
                  badgeLabel = index === 0 ? "AWS ML Specialty" : "AWS Cloud Practitioner";
                } else if (event.credlyUrls!.length > 1) {
                  badgeLabel = `Certification Badge ${index + 1}`;
                }

                return (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {badgeLabel}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </ScrollReveal>
    </div>
  );
}
