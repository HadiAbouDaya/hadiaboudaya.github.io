"use client";

import Link from "next/link";
import { Linkedin, Github, Mail, ArrowUp } from "lucide-react";
import { SOCIAL_LINKS } from "@/data/social";
import { NAV_LINKS } from "@/data/navigation";
import { trackEvent, EVENTS } from "@/lib/analytics";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white dark:border-t dark:border-slate-800">
      <div className="container-main px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold">Hadi Abou Daya</h3>
            <p className="text-slate-400 text-sm mt-1">
              AI/ML Engineer - Paris, France
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex justify-center">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-center md:justify-end gap-4">
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
              onClick={() => trackEvent(EVENTS.EXTERNAL_LINK_CLICKED, { url: SOCIAL_LINKS.linkedin, context: "footer" })}
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="GitHub"
              onClick={() => trackEvent(EVENTS.EXTERNAL_LINK_CLICKED, { url: SOCIAL_LINKS.github, context: "footer" })}
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${SOCIAL_LINKS.email}`}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="Email"
              onClick={() => trackEvent(EVENTS.EXTERNAL_LINK_CLICKED, { url: `mailto:${SOCIAL_LINKS.email}`, context: "footer" })}
            >
              <Mail className="w-5 h-5" />
            </a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Hadi Abou Daya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
