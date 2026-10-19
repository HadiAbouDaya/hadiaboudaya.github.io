"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { REVEAL_FRAGMENT_EVENT, fragmentFromEvent } from "@/lib/fragments";
import {
  experienceFilterForTarget,
  experienceFilterUrl,
  experienceFragmentId,
  readExperienceFilter,
  type ExperienceFilter,
  type ExperienceKind,
} from "@/lib/experience-navigation";
import { cn } from "@/lib/utils";
import styles from "./experience.module.css";

interface ExperienceTimelineProps {
  professional: ReactNode;
  education: ReactNode;
  entries: { id: string; kind: ExperienceKind }[];
}

const filters: { key: ExperienceFilter; label: string; accessibleLabel?: string }[] = [
  { key: "all", label: "All" },
  { key: "professional", label: "Roles", accessibleLabel: "Professional roles" },
  { key: "education", label: "Education" },
];

function targetKind(target: HTMLElement | null): ExperienceKind | undefined {
  const kind = target?.closest<HTMLElement>("[data-experience-kind]")?.dataset.experienceKind;
  return kind === "professional" || kind === "education" ? kind : undefined;
}

/** Facts and entry markup arrive from the server; only filtering and fragment navigation hydrate. */
export function ExperienceTimeline({ professional, education, entries }: ExperienceTimelineProps) {
  const [filter, setFilter] = useState<ExperienceFilter>("all");
  const filterRef = useRef<ExperienceFilter>("all");
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cancelRevealRef = useRef<(() => void) | null>(null);
  const lastLocationRef = useRef("");

  useEffect(() => {
    let frame: number | undefined;
    const cancelReveal = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
    };
    cancelRevealRef.current = cancelReveal;

    const findTarget = (hash: string): HTMLElement | null => {
      const id = experienceFragmentId(hash);
      const target = id ? document.getElementById(id) : null;
      return target instanceof HTMLElement && rootRef.current?.contains(target) ? target : null;
    };

    const applyFilter = (next: ExperienceFilter) => {
      filterRef.current = next;
      setFilter(next);
    };

    const openTarget = (target: HTMLElement) => {
      // Project anchors are visible sections, not necessarily disclosures themselves.
      const project = target.closest<HTMLElement>("[data-project-evidence]");
      const projectDetails = project?.querySelector<HTMLDetailsElement>(":scope > details[data-project-details]");
      if (projectDetails) projectDetails.open = true;
      for (let ancestor: HTMLElement | null = target; ancestor && ancestor !== rootRef.current; ancestor = ancestor.parentElement) {
        if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
      }
    };

    const focusTarget = (target: HTMLElement, source?: HTMLElement) => {
      cancelReveal();
      const previousFocus = document.activeElement;
      // React must reveal filtered sections before measuring. The second finite
      // frame lets native disclosures settle; a new intent cancels either stage.
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          frame = undefined;
          if (!target.isConnected || !rootRef.current?.contains(target) || target.closest("[hidden]") || document.querySelector("dialog[open]")) return;
          const focus = target instanceof HTMLDetailsElement
            ? target.querySelector<HTMLElement>(":scope > summary") ?? target
            : target;
          const active = document.activeElement;
          // Do not steal focus or scroll after the reader has moved elsewhere.
          if (active !== previousFocus && active !== source && active !== document.body && active !== focus) return;
          focus.focus({ preventScroll: true });
          target.scrollIntoView({ block: "start", behavior: "instant" });
        });
      });
    };

    const syncLocation = (restoreHistory = false) => {
      cancelReveal();
      const url = new URL(window.location.href);
      const target = findTarget(url.hash);
      const next = experienceFilterForTarget(readExperienceFilter(url), targetKind(target));
      const canonical = experienceFilterUrl(url, next);
      if (canonical.href !== url.href) window.history.replaceState(null, "", canonical);
      lastLocationRef.current = window.location.href;

      if (restoreHistory) {
        // Reveal before the browser restores its saved scroll position.
        // Back/Forward owns focus and scrolling; do not re-run a jump to the hash.
        flushSync(() => applyFilter(next));
      } else applyFilter(next);
      if (target) {
        openTarget(target);
        if (!restoreHistory) focusTarget(target);
      }
    };

    const onPopState = () => syncLocation(true);
    const onHashChange = () => {
      // A history traversal can emit both events for a single destination.
      if (window.location.href !== lastLocationRef.current) syncLocation();
    };
    const onClick = (event: MouseEvent) => {
      cancelReveal();
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return;
      // Search sends its explicit destination after the modal closes. A background
      // focus attempt here would fight the modal's focus trap.
      if (anchor.closest("dialog, [role='dialog']")) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname.replace(/\/$/, "") !== window.location.pathname.replace(/\/$/, "")) return;
      const target = findTarget(destination.hash);
      if (!target) return;

      // Own valid in-page Experience links so each intent has one history entry
      // and one focus/scroll operation, rather than competing native/Next jumps.
      event.preventDefault();
      const next = experienceFilterForTarget(readExperienceFilter(destination), targetKind(target));
      const canonical = experienceFilterUrl(destination, next);
      if (canonical.href !== window.location.href) window.history.pushState(null, "", canonical);
      lastLocationRef.current = window.location.href;
      applyFilter(next);
      openTarget(target);
      focusTarget(target, anchor);
    };
    const onExplicitFragment = (event: Event) => {
      const hash = fragmentFromEvent(event);
      const target = hash ? findTarget(hash) : null;
      if (!target) return;
      // Global search links use the complete Experience view. Its explicit id is
      // authoritative even before the router commits the destination hash.
      applyFilter("all");
      lastLocationRef.current = window.location.href;
      openTarget(target);
      focusTarget(target);
    };

    // The app router installs its native-History integration in a parent effect.
    // Wait one frame before initial URL normalization so it can retain its state.
    frame = requestAnimationFrame(() => { frame = undefined; syncLocation(); });
    window.addEventListener(REVEAL_FRAGMENT_EVENT, onExplicitFragment);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onPopState);
    window.addEventListener("pagehide", cancelReveal);
    document.addEventListener("click", onClick, true);
    document.addEventListener("pointerdown", cancelReveal, true);
    document.addEventListener("keydown", cancelReveal, true);
    return () => {
      cancelReveal();
      cancelRevealRef.current = null;
      window.removeEventListener(REVEAL_FRAGMENT_EVENT, onExplicitFragment);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("pagehide", cancelReveal);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerdown", cancelReveal, true);
      document.removeEventListener("keydown", cancelReveal, true);
    };
  }, []);

  const selectFilter = (next: ExperienceFilter) => {
    cancelRevealRef.current?.();
    if (next === filterRef.current) return;
    const url = new URL(window.location.href);
    const id = experienceFragmentId(url.hash);
    const target = id ? document.getElementById(id) : null;
    const kind = target instanceof HTMLElement && rootRef.current?.contains(target) ? targetKind(target) : undefined;
    const destination = experienceFilterUrl(url, next, kind);
    // Next's native-History integration retains its opaque router state and syncs
    // its canonical URL. Passing that internal state back would bypass the sync.
    // Filter changes neither focus content nor scroll.
    window.history.pushState(null, "", destination);
    lastLocationRef.current = window.location.href;
    filterRef.current = next;
    setFilter(next);
  };

  const onFilterKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    let next: number;
    switch (event.key) {
      case "ArrowRight": case "ArrowDown": next = (index + 1) % filters.length; break;
      case "ArrowLeft": case "ArrowUp": next = (index + filters.length - 1) % filters.length; break;
      case "Home": next = 0; break;
      case "End": next = filters.length - 1; break;
      default: return;
    }
    event.preventDefault();
    selectFilter(filters[next].key);
    buttonRefs.current[next]?.focus({ preventScroll: true });
  };

  const status = filter === "all" ? "All experience shown." : filter === "professional" ? "Professional experience shown." : "Education shown.";

  return (
    <div ref={rootRef} className={styles.timeline}>
      <div className={styles.toolbar}>
        <div role="radiogroup" aria-label="Filter experience by type" aria-describedby="experience-filter-status" className={styles.filters}>
          {filters.map((item, index) => (
            <button key={item.key} type="button" role="radio" aria-checked={filter === item.key}
              aria-label={item.accessibleLabel} aria-controls="professional-experience education-experience"
              tabIndex={filter === item.key ? 0 : -1}
              ref={node => { buttonRefs.current[index] = node; }}
              onClick={() => selectFilter(item.key)} onKeyDown={event => onFilterKeyDown(event, index)}
              className={styles.filter}>
              {item.label}
            </button>
          ))}
        </div>
        <p id="experience-filter-status" className="sr-only" role="status" aria-atomic="true">{status}</p>
      </div>
      <section id="professional-experience" tabIndex={-1} data-experience-kind="professional" aria-labelledby="professional-heading"
        hidden={filter === "education"} className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 id="professional-heading">Professional experience</h2>
          <p>Roles are ordered by end date. Consulting clients are grouped under the independent practice.</p>
        </div>
        {professional}
      </section>
      <section id="education-experience" tabIndex={-1} data-experience-kind="education" aria-labelledby="education-heading"
        hidden={filter === "professional"} className={cn(styles.section, filter !== "education" && styles.educationSection)}>
        <div className={styles.sectionHeader}>
          <h2 id="education-heading">Education</h2>
          <p>Degree studies and the McGill exchange semester within the emlyon MSc.</p>
        </div>
        {education}
      </section>
      <noscript><p className="mt-6 text-sm text-fg-mid">All {entries.length} roles and education entries are shown. Project contribution and outcome details can be opened individually.</p></noscript>
    </div>
  );
}
