"use client";

import Link from "next/link";
import { Briefcase, Calendar, Award, BookOpen, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import type { Experience, Event, BlogPost } from "@/types";

interface HomeHighlightsProps {
  latestRole: Pick<Experience, "role" | "company" | "period">;
  featuredEvent: Pick<Event, "title" | "date" | "category">;
  certCount: number;
  latestPost?: Pick<BlogPost, "slug" | "title" | "excerpt"> | null;
}

export function HomeHighlights({ latestRole, featuredEvent, certCount, latestPost }: HomeHighlightsProps) {
  const cards = [
    {
      icon: Briefcase,
      label: "Latest Role",
      title: `${latestRole.role} at ${latestRole.company}`,
      detail: latestRole.period,
      href: "/experience",
      linkText: "View timeline",
    },
    {
      icon: Calendar,
      label: "Featured Event",
      title: featuredEvent.title,
      detail: new Date(featuredEvent.date).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      href: "/events",
      linkText: "See all events",
    },
    {
      icon: Award,
      label: "Certifications",
      title: `${certCount}+ professional credentials`,
      detail: "AWS, Azure, PMP, AI/ML & more",
      href: "/certifications",
      linkText: "Browse all",
    },
    ...(latestPost
      ? [
          {
            icon: BookOpen,
            label: "Latest Post",
            title: latestPost.title,
            detail: latestPost.excerpt.slice(0, 80) + (latestPost.excerpt.length > 80 ? "..." : ""),
            href: `/blog/${latestPost.slug}`,
            linkText: "Read more",
          },
        ]
      : []),
  ];

  return (
    <section className="py-12 sm:py-16 bg-slate-900 dark:bg-slate-950">
      <div className="container-main px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <ScrollReveal key={card.href} delay={i * 0.1}>
              <Link
                href={card.href}
                className="group block p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <card.icon className="w-4 h-4 text-primary-400" />
                  <span className="text-xs font-medium text-primary-400">{card.label}</span>
                </div>
                <h3 className="text-sm font-semibold text-white line-clamp-2 mb-1">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {card.detail}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-400 group-hover:gap-2 transition-all">
                  {card.linkText}
                  <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
