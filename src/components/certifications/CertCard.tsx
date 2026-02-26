"use client";

import { motion } from "framer-motion";
import type { Certification } from "@/types";
import { Card } from "@/components/ui/Card";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink, Calendar } from "lucide-react";

interface CertCardProps {
  cert: Certification;
}

export function CertCard({ cert }: CertCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-slate-50">
            <ImageWithFallback
              src={cert.badgePath}
              alt={cert.name}
              width={56}
              height={56}
              fallbackText={cert.issuer.slice(0, 2).toUpperCase()}
              className="w-full h-full object-contain p-1"
              fallbackClassName="w-full h-full text-xs"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              {cert.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{cert.issuer}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {cert.issuedDate}
          </span>
          {cert.expiryDate && (
            <span className="text-slate-400">
              Expires {cert.expiryDate}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <Badge>{cert.category}</Badge>
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            View Credential
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </Card>
    </motion.div>
  );
}
