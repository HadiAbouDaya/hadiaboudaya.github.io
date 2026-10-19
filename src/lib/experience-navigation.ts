export type ExperienceKind = "professional" | "education";
export type ExperienceFilter = "all" | ExperienceKind;

/** Invalid or absent URL filters preserve the complete, server-rendered view. */
export function readExperienceFilter(url: URL): ExperienceFilter {
  const view = url.searchParams.get("view");
  return view === "professional" || view === "education" ? view : "all";
}

/** A destination wins over a conflicting filter, without hiding unrelated entries in All. */
export function experienceFilterForTarget(
  filter: ExperienceFilter,
  kind: ExperienceKind | undefined,
): ExperienceFilter {
  return kind && filter !== "all" && filter !== kind ? kind : filter;
}

/** Work on a copy: callers can compare destinations before writing browser history. */
export function experienceFilterUrl(
  source: URL,
  filter: ExperienceFilter,
  fragmentKind?: ExperienceKind,
): URL {
  const destination = new URL(source.href);
  if (filter === "all") destination.searchParams.delete("view");
  else destination.searchParams.set("view", filter);

  // A filter choice must not leave a URL pointing into the section it just hid.
  if (fragmentKind && filter !== "all" && filter !== fragmentKind) destination.hash = "";
  return destination;
}

export function experienceFragmentId(hash: string): string | undefined {
  if (!hash.startsWith("#") || hash.length === 1) return;
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    // Malformed external fragments must not break the rest of the controller.
    return;
  }
}
