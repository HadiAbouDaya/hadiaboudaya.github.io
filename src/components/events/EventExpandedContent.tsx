"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink, Share2 } from "lucide-react";

interface EventExpandedContentProps {
  event: Event;
}

export function EventExpandedContent({ event }: EventExpandedContentProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          {event.description}
        </p>

        {event.organizations && event.organizations.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Organizations
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {event.organizations.map((org) => (
                <span
                  key={org}
                  className="text-xs px-2.5 py-1 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700"
                >
                  {org}
                </span>
              ))}
            </div>
          </div>
        )}

        {event.images && event.images.length > 1 && (
          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {event.images.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0"
                >
                  <Image
                    src={img}
                    alt={`${event.title} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
              ))}
              {event.images.length > 4 && (
                <div className="w-28 h-20 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    +{event.images.length - 4} more
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {event.tags.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {event.linkedinUrl && (
            <a
              href={event.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
              View on LinkedIn
            </a>
          )}
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 className="w-3 h-3" />
            Permalink
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
