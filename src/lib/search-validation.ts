import type { SearchCategory, SearchIndex } from "./search";

const categories: readonly SearchCategory[] = ["page", "experience", "event", "certification", "blog", "cv"];
const searchOrigin = "https://search.invalid";
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const isStringList = (value: unknown) => Array.isArray(value) && value.every(item => typeof item === "string");
const isNonblankString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

function isPublicHref(value: unknown): value is string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[\\\s\u0000-\u001f\u007f]/.test(value)) return false;
  try {
    // Decode the fragment too: same-page navigation passes it to decodeURIComponent.
    const decoded = decodeURIComponent(value);
    if (/[\\\u0000-\u001f\u007f]/.test(decoded) || decoded.startsWith("//")) return false;
    const url = new URL(value, searchOrigin);
    const pathname = decodeURIComponent(url.pathname);
    const segments = pathname.split("/");
    return url.origin === searchOrigin && !/^\/luna(?:\/|$)/i.test(pathname) &&
      !segments.some(segment => segment.startsWith(".")) && !pathname.startsWith("//");
  } catch { return false; }
}

function isMetadata(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return Object.entries(value).every(([key, item]) => {
    if (key === "date" || key === "location") return typeof item === "string";
    if (key === "technologies" || key === "tags") return isStringList(item);
    return false;
  });
}

/** Validate the fetched projection before it enters the shared cache or React state. */
export function parseSearchIndex(value: unknown): SearchIndex {
  const unavailable = () => new Error("Search is temporarily unavailable.");
  if (!isRecord(value) || value.schemaVersion !== 1 || !isNonblankString(value.contentRevision) || !Array.isArray(value.items)) throw unavailable();
  const ids = new Set<string>();
  for (const item of value.items) {
    if (!isRecord(item) || !isNonblankString(item.id) || ids.has(item.id) ||
        !isNonblankString(item.title) || typeof item.description !== "string" ||
        !categories.includes(item.category as SearchCategory) || !isPublicHref(item.href) ||
        (item.keywords !== undefined && !isStringList(item.keywords)) ||
        (item.meta !== undefined && !isMetadata(item.meta))) throw unavailable();
    ids.add(item.id);
  }
  return value as unknown as SearchIndex;
}
