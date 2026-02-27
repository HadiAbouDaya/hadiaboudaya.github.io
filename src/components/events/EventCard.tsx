"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Event } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

const categoryColors: Record<Event["category"], string> = {
  career: "bg-primary-50 text-primary-700",
  education: "bg-emerald-50 text-emerald-700",
  project: "bg-violet-50 text-violet-700",
  achievement: "bg-amber-50 text-amber-700",
};

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/events/${event.slug}`}>
        <Card className="h-full flex flex-col group cursor-pointer">
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {event.location}
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 leading-tight group-hover:text-primary-600 transition-colors">
            {event.title}
          </h3>

          <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-3">
            {event.summary}
          </p>

          <div className="mt-auto pt-4 flex items-center justify-between">
            <Badge className={categoryColors[event.category]}>
              {event.category}
            </Badge>
            <span className="inline-flex items-center gap-1 text-xs text-primary-600 font-medium group-hover:gap-2 transition-all">
              Read more
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
