"use client";

import Link from "next/link";
import { m, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { TypingEffect } from "@/components/ui/TypingEffect";
import { Magnetic } from "@/components/ui/Magnetic";
import { Calendar, ArrowRight } from "lucide-react";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { SPRING, staggerContainer } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface HeroContentProps {
  latestPostSlug?: string | null;
  latestPostTitle?: string | null;
}

const NAME_WORDS = ["Hadi", "Abou", "Daya"];

const wordReveal = {
  hidden: { y: "110%" },
  visible: { y: 0, transition: SPRING.smooth },
};

export function HeroContent({ latestPostSlug, latestPostTitle }: HeroContentProps = {}) {
  const prefersReducedMotion = useReducedMotion();

  // Parallax: content drifts up and fades over the first ~600px of scroll.
  // Compositor-only (transform/opacity); disabled under reduced motion.
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -40]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const parallaxStyle = prefersReducedMotion ? undefined : { y, opacity };

  return (
    <m.div
      className="relative z-10 text-center px-4 max-w-3xl mx-auto"
      style={parallaxStyle}
    >
      <m.h1
        className="text-display font-bold text-white"
        style={{ textShadow: "0 2px 30px rgba(0,0,0,0.4), 0 0 80px rgba(59,130,246,0.1)" }}
        variants={prefersReducedMotion ? undefined : staggerContainer(0.06, 0.1)}
        initial={prefersReducedMotion ? false : "hidden"}
        animate={prefersReducedMotion ? false : "visible"}
        aria-label="Hadi Abou Daya"
      >
        <span className="text-gradient-brand" aria-hidden="true">
          {NAME_WORDS.map((word, i) => (
            <span
              key={word}
              className="inline-block overflow-hidden align-bottom pb-[0.12em]"
            >
              <m.span
                className={`inline-block${i < NAME_WORDS.length - 1 ? " pr-[0.25em]" : ""}`}
                variants={prefersReducedMotion ? undefined : wordReveal}
              >
                {word}
              </m.span>
            </span>
          ))}
        </span>
      </m.h1>

      <p className="mt-5 text-xl sm:text-2xl text-primary-300 font-medium h-8 sm:h-9">
        <TypingEffect texts={["AI/ML Consultant", "Cloud Architect", "Web3 Builder", "Software Engineer"]} />
      </p>

      <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto tracking-wide">
        Building intelligent systems from edge to cloud
      </p>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Magnetic>
          <Button
            href="/about"
            className="bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm"
            onClick={() => trackEvent(EVENTS.CTA_CLICKED, { label: "About Me", href: "/about" })}
          >
            About Me
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Magnetic>
        <Magnetic>
          <Button
            href="https://calendly.com/hadiai/one-on-one"
            external
            variant="primary"
            className="shadow-lg shadow-primary-500/20"
            onClick={() => trackEvent(EVENTS.CALENDLY_CLICKED, { location: "hero" })}
          >
            <Calendar className="w-4 h-4" />
            Book a Meeting
          </Button>
        </Magnetic>
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
    </m.div>
  );
}
