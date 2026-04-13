"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TypingEffect } from "@/components/ui/TypingEffect";
import { Calendar, ArrowRight } from "lucide-react";
import { trackEvent, EVENTS } from "@/lib/analytics";

interface HeroContentProps {
  latestPostSlug?: string | null;
  latestPostTitle?: string | null;
}

export function HeroContent({ latestPostSlug, latestPostTitle }: HeroContentProps = {}) {
  return (
    <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
      <h1
        className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white tracking-tight"
        style={{ textShadow: "0 2px 30px rgba(0,0,0,0.4), 0 0 80px rgba(59,130,246,0.1)" }}
      >
        Hadi Abou Daya
      </h1>

      <p className="mt-5 text-xl sm:text-2xl text-accent-400 font-medium h-8 sm:h-9">
        <TypingEffect texts={["AI/ML Consultant", "Cloud Architect", "Web3 Builder", "Software Engineer"]} />
      </p>

      <p className="mt-4 text-lg text-slate-300/80 max-w-xl mx-auto tracking-wide">
        Building intelligent systems from edge to cloud
      </p>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          href="/about"
          className="bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm"
          onClick={() => trackEvent(EVENTS.CTA_CLICKED, { label: "About Me", href: "/about" })}
        >
          <ArrowRight className="w-4 h-4" />
          About Me
        </Button>
        <Button
          href="https://calendly.com/hadiad/one-on-one"
          external
          variant="primary"
          className="shadow-lg shadow-primary-500/20"
          onClick={() => trackEvent(EVENTS.CALENDLY_CLICKED, { location: "hero" })}
        >
          <Calendar className="w-4 h-4" />
          Book a Meeting
        </Button>
      </div>

      {latestPostSlug && latestPostTitle && (
        <div className="mt-6">
          <Link
            href={`/blog/${latestPostSlug}`}
            className="text-sm text-white/40 hover:text-white/70 transition-colors duration-300"
          >
            or read my latest post: <span className="underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition-colors">{latestPostTitle}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
