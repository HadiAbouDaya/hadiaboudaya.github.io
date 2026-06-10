"use client";

import Link from "next/link";
import Image from "next/image";
import type { Event, EventCategory } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { categoryConfig } from "@/data/eventCategories";
import { type Accent } from "@/lib/accents";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { CreativeCarousel } from "@/components/ui/CreativeCarousel";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  ExternalLink,
  Github,
  Globe,
} from "lucide-react";

// Category -> accent (5-accent system; no purple/violet/indigo).
const categoryAccent: Record<EventCategory, Accent> = {
  career: "blue",
  education: "blue",
  conference: "teal",
  hackathon: "teal",
  community: "teal",
  achievement: "teal",
  project: "emerald",
  certification: "amber",
  workshop: "orange",
  "knowledge-sharing": "orange",
  training: "orange",
};

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
          className="inline-flex items-center gap-2 text-sm text-fg-mid hover:text-primary-600 transition-colors duration-150 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge accent={categoryAccent[event.category]}>
            <CategoryIcon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
          {event.role && <Badge variant="primary">{event.role}</Badge>}
          <span className="flex items-center gap-1 text-sm text-fg-mid">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1 text-sm text-fg-mid">
            <MapPin className="w-4 h-4" />
            {event.location}
          </span>
        </div>

        <h1 className="text-headline text-fg mb-6">
          {event.title}
        </h1>

        <p className="text-lg text-fg-mid leading-relaxed mb-8">
          {event.summary}
        </p>

        {event.videoUrl && (
          <div className="mb-8 flex justify-center">
            <video
              src={event.videoUrl}
              controls
              playsInline
              preload="metadata"
              className="rounded-card-lg shadow-card max-h-[80vh] w-auto bg-surface-sunken"
            />
          </div>
        )}

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
                      className="group/photo relative aspect-[4/3] rounded-card-lg overflow-hidden cursor-zoom-in"
                    >
                      <Image
                        src={img}
                        alt={`${event.title} - photo ${i + 1} of ${event.images!.length}`}
                        fill
                        priority={i === 0}
                        className="object-cover transition-transform duration-500 ease-out group-hover/photo:scale-[1.03]"
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
          <p className="text-fg-mid leading-relaxed">{event.description}</p>
        </div>

        {event.organizations && event.organizations.length > 0 && (
          <div className="mt-8 pt-6 border-t border-line">
            <h3 className="text-eyebrow uppercase text-fg-mid mb-3">
              Organizations
            </h3>
            <div className="flex flex-wrap gap-2">
              {event.organizations.map((org) => (
                <span
                  key={org}
                  className="text-sm px-3 py-1 bg-surface-sunken text-fg-mid rounded-pill border border-line"
                >
                  {org}
                </span>
              ))}
            </div>
          </div>
        )}

        {event.tags.length > 0 && (
          <div className="mt-6 pt-6 border-t border-line">
            <h3 className="text-eyebrow uppercase text-fg-mid mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="primary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {(event.linkedinUrl || event.githubUrl || event.websiteUrl) && (
          <div className="mt-6 pt-6 border-t border-line flex flex-wrap gap-3">
            {event.linkedinUrl && (
              <a
                href={event.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-control text-sm font-medium hover:bg-primary-500 transition-colors duration-150"
              >
                <ExternalLink className="w-4 h-4" />
                View on LinkedIn
              </a>
            )}
            {event.githubUrl && (
              <a
                href={event.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-surface-raised text-fg rounded-control text-sm font-medium border border-line hover:border-line-strong transition-colors duration-150"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            )}
            {event.websiteUrl && (
              <a
                href={event.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-control text-sm font-medium hover:bg-emerald-500 transition-colors duration-150"
              >
                <Globe className="w-4 h-4" />
                View Case Study
              </a>
            )}
          </div>
        )}

        {event.credlyUrls && event.credlyUrls.length > 0 && (
          <div className="mt-6 pt-6 border-t border-line">
            <h3 className="text-eyebrow uppercase text-fg-mid mb-3">
              Certification {event.credlyUrls.length > 1 ? "Badges" : "Badge"}
            </h3>
            <div className="flex flex-wrap gap-3">
              {event.credlyUrls.map((url, index) => {
                // Extract badge name from URL or use generic label
                let badgeLabel = "View Certification Badge";

                // Check if this is an AWS certification event
                if (event.slug === "aws-ml-cloud-certifications") {
                  badgeLabel = index === 0 ? "AWS ML Specialty" : "AWS Cloud Practitioner";
                } else if (event.slug === "azure-certifications-zaka") {
                  badgeLabel = index === 0 ? "Azure Fundamentals (AZ-900)" : "Azure AI Fundamentals (AI-900)";
                } else if (event.credlyUrls!.length > 1) {
                  badgeLabel = `Certification Badge ${index + 1}`;
                }

                return (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-surface-raised text-fg rounded-control text-sm font-medium hover:border-line-strong transition-colors duration-150 border border-line"
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
