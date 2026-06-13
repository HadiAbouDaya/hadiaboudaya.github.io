"use client";

import Link from "next/link";
import { Briefcase, Calendar, Award, BookOpen, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { useSpotlight } from "@/lib/hooks/useSpotlight";
import { ACCENTS, type Accent } from "@/lib/accents";
import type { Experience, Event, BlogPost } from "@/types";

interface HomeHighlightsProps {
  latestRole: Pick<Experience, "role" | "company" | "period">;
  featuredEvent: Pick<Event, "title" | "date" | "category">;
  certCount: number;
  latestPost?: Pick<BlogPost, "slug" | "title" | "excerpt"> | null;
}

export function HomeHighlights({ latestRole, featuredEvent, certCount, latestPost }: HomeHighlightsProps) {
  const gridRef = useSpotlight<HTMLDivElement>();

  const cards: {
    icon: typeof Briefcase;
    label: string;
    title: string;
    detail: string;
    href: string;
    linkText: string;
    accent: Accent;
  }[] = [
    {
      icon: Briefcase,
      label: "Latest Role",
      title: `${latestRole.role} at ${latestRole.company}`,
      detail: latestRole.period,
      href: "/experience/",
      linkText: "View timeline",
      accent: "blue",
    },
    {
      icon: Calendar,
      label: "Featured Event",
      title: featuredEvent.title,
      detail: new Date(featuredEvent.date).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      href: "/events/",
      linkText: "See all events",
      accent: "teal",
    },
    {
      icon: Award,
      label: "Certifications",
      title: `${certCount}+ professional credentials`,
      detail: "AWS, Azure, PMP, AI/ML & more",
      href: "/certifications/",
      linkText: "Browse all",
      accent: "amber",
    },
    ...(latestPost
      ? [
          {
            icon: BookOpen,
            label: "Latest Post",
            title: latestPost.title,
            detail: latestPost.excerpt.slice(0, 80) + (latestPost.excerpt.length > 80 ? "..." : ""),
            href: `/blog/${latestPost.slug}/`,
            linkText: "Read more",
            accent: "orange" as const,
          },
        ]
      : []),
  ];

  return (
    <section className="relative py-12 sm:py-16 bg-surface-sunken">
      <div className="absolute inset-0 bg-[image:var(--gradient-surface)] pointer-events-none" />
      <div className="container-main px-4 sm:px-6 lg:px-8 relative">
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => {
            const accent = ACCENTS[card.accent];
            return (
              <ScrollReveal key={card.href} delay={i * 0.1}>
                <Link
                  href={card.href}
                  className="card-spotlight group block h-full p-5 rounded-card bg-surface-raised border border-line shadow-card transition-[background-color,border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-glow-sm hover:border-primary-500/25"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <card.icon className={`w-4 h-4 ${accent.text} transition-colors`} />
                    <span className={`text-eyebrow uppercase ${accent.text}`}>{card.label}</span>
                  </div>
                  <h3 className="text-title text-base text-fg line-clamp-2 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-fg-lo line-clamp-2 mb-3">
                    {card.detail}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-fg-mid group-hover:text-fg group-hover:gap-2 transition-all">
                    {card.linkText}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
