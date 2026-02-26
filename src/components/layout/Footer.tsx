"use client";

import Link from "next/link";
import { Linkedin, Github, Mail, ArrowUp } from "lucide-react";
import { SOCIAL_LINKS } from "@/data/social";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container-main px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold">Hadi Abou Daya</h3>
            <p className="text-slate-400 text-sm mt-1">
              AI/ML Engineer &mdash; Paris, France
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${SOCIAL_LINKS.email}`}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
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
