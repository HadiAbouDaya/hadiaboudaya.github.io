"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Event } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { categoryConfig } from "@/data/eventCategories";
import { Calendar, MapPin, ChevronDown } from "lucide-react";
import { EventExpandedContent } from "./EventExpandedContent";

interface EventCardProps {
  event: Event;
  isExpanded: boolean;
  onToggle: () => void;
}

export function EventCard({ event, isExpanded, onToggle }: EventCardProps) {
  const config = categoryConfig[event.category];
  const CategoryIcon = config.icon;

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  if (event.tier === "featured") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="col-span-1 sm:col-span-2"
      >
        <Card
          className={`relative overflow-hidden border-l-4 ${config.borderColor} cursor-pointer`}
          hover={!isExpanded}
        >
          <div onClick={onToggle}>
            <div className="flex flex-col sm:flex-row gap-4">
              {event.images?.[0] && (
                <div className="relative w-full sm:w-48 h-36 sm:h-auto rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={event.images[0]}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 192px"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className={config.color}>
                    <CategoryIcon className="w-3 h-3 mr-1" />
                    {config.label}
                  </Badge>
                  {event.role && (
                    <Badge variant="primary">{event.role}</Badge>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-tight mb-1.5">
                  {event.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {event.summary}
                </p>

                {event.organizations && event.organizations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {event.organizations.slice(0, 3).map((org) => (
                      <span
                        key={org}
                        className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full"
                      >
                        {org}
                      </span>
                    ))}
                    {event.organizations.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                        +{event.organizations.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end mt-2">
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && <EventExpandedContent event={event} />}
          </AnimatePresence>
        </Card>
      </motion.div>
    );
  }

  // Standard card
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="col-span-1"
    >
      <Card
        className="h-full cursor-pointer"
        hover={!isExpanded}
      >
        <div onClick={onToggle}>
          <div className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}
            >
              <CategoryIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  {formattedDate}
                </span>
                {event.role && (
                  <span className="text-[10px] text-slate-400">
                    {event.role}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-slate-900 leading-tight mb-1">
                {event.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                {event.summary}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <MapPin className="w-2.5 h-2.5" />
                  {event.location}
                </span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && <EventExpandedContent event={event} />}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
