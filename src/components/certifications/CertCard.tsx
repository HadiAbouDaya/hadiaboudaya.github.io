"use client";

import { m } from "framer-motion";
import type { Certification } from "@/types";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { ExternalLink, Calendar } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import { ACCENTS, type Accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

interface CertCardProps {
  cert: Certification;
}

const CATEGORY_ACCENT: Record<Certification["category"], Accent> = {
  AWS: "amber",
  Azure: "blue",
  "AI/ML": "teal",
  "Data Science": "emerald",
  "Software Engineering": "blue",
  Security: "orange",
  Business: "emerald",
};

export function CertCard({ cert }: CertCardProps) {
  const accent = ACCENTS[CATEGORY_ACCENT[cert.category]];

  return (
    <m.div
      id={`cert-${cert.id}`}
      className="scroll-mt-24"
      layout
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <div className="card-spotlight h-full flex flex-col bg-surface-raised rounded-card border border-line p-6 shadow-card transition-[box-shadow,border-color,transform] duration-300 hover:shadow-glow-sm hover:border-primary-500/30 hover:-translate-y-0.5">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0 w-14 h-14 rounded-control overflow-hidden bg-slate-50 dark:bg-slate-200">
            <ImageWithFallback
              src={cert.badgePath}
              alt={`${cert.name} certification badge from ${cert.issuer}`}
              width={56}
              height={56}
              fallbackText={cert.issuer.slice(0, 2).toUpperCase()}
              className="w-full h-full object-contain p-1"
              fallbackClassName="w-full h-full text-xs"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-title text-base text-fg leading-tight">
              {cert.name}
            </h3>
            <p className={cn("text-xs mt-0.5 font-medium", accent.text)}>
              {cert.issuer}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs text-fg-lo">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {cert.issuedDate}
          </span>
          {cert.expiryDate && (
            <span className="text-fg-lo">Expires {cert.expiryDate}</span>
          )}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-pill text-xs font-medium",
              accent.chip
            )}
          >
            {cert.category}
          </span>
          {cert.credentialUrl ? (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
            >
              View Credential
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : null}
        </div>
      </div>
    </m.div>
  );
}
