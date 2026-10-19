"use client";

import { useEffect } from "react";
import { Download } from "lucide-react";
import { CV_FILES } from "@/data/profile";
import { REVEAL_FRAGMENT_EVENT, fragmentFromEvent } from "@/lib/fragments";

export function CVDownloads() {
  useEffect(() => {
    let frame = 0;
    const reveal = (hash: string) => {
      if (hash !== "#cv-downloads") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const section = document.getElementById("cv-downloads");
        section?.focus({ preventScroll: true });
        section?.scrollIntoView({ block: "start" });
      });
    };
    const onHash = () => reveal(window.location.hash);
    const onReveal = (event: Event) => reveal(fragmentFromEvent(event) ?? "");
    onHash();
    window.addEventListener("hashchange", onHash);
    window.addEventListener(REVEAL_FRAGMENT_EVENT, onReveal);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener(REVEAL_FRAGMENT_EVENT, onReveal);
    };
  }, []);
  return <section id="cv-downloads" tabIndex={-1} aria-labelledby="cv-downloads-heading"
    className="w-fit max-w-full scroll-mt-28 rounded-control focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500">
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2 id="cv-downloads-heading" className="text-base font-medium text-fg">Download my CV</h2>
      <span className="text-sm text-fg-mid">PDF</span>
    </div>
    <div className="flex flex-wrap gap-3">
      {CV_FILES.map(file => <a key={file.language} href={file.href} hrefLang={file.language}
        type="application/pdf" download aria-label={`${file.label} (PDF download)`}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control border border-line px-3 py-3 text-sm font-medium text-fg transition-colors duration-200 hover:border-line-strong hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500">
        <Download aria-hidden="true" className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
        <span lang={file.language}>{file.language === "fr" ? "Français" : "English"}</span>
      </a>)}
    </div>
  </section>;
}
