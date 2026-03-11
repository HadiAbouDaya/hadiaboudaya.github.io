import { experiences } from "@/data/experience";
import { events } from "@/data/events";
import { certifications } from "@/data/certifications";
import { BLOG_POSTS } from "@/data/blogIndex";
import { NAV_LINKS } from "@/data/navigation";

// ── Types ────────────────────────────────────────────────────────────────────

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: "page" | "experience" | "event" | "certification" | "blog";
  href: string;
  meta?: {
    technologies?: string[];
    location?: string;
    date?: string;
    tags?: string[];
  };
}

export interface SearchResult {
  item: SearchItem;
  score: number;
  matchedIn: string; // Best matching field label for UI hint
}

interface SearchField {
  text: string;
  weight: number;
  label: string;
}

interface IndexedItem {
  item: SearchItem;
  fields: SearchField[];
}

// ── Bidirectional Synonym Map ────────────────────────────────────────────────

const SYNONYM_PAIRS: [string, string[]][] = [
  ["cv", ["computer vision"]],
  ["ml", ["machine learning"]],
  ["nlp", ["natural language processing"]],
  ["dl", ["deep learning"]],
  ["ai", ["artificial intelligence"]],
  ["llm", ["large language model", "large language models"]],
  ["rag", ["retrieval augmented generation"]],
  ["aws", ["amazon web services", "amazon"]],
  ["gcp", ["google cloud platform"]],
  ["k8s", ["kubernetes"]],
  ["js", ["javascript"]],
  ["ts", ["typescript"]],
  ["ci", ["continuous integration"]],
  ["cd", ["continuous deployment", "continuous delivery"]],
];

// Build a fast lookup: token → expansions
const SYNONYMS: Map<string, string[]> = new Map();
for (const [abbr, expansions] of SYNONYM_PAIRS) {
  // abbr → expansions
  SYNONYMS.set(abbr, expansions);
  // each expansion → abbr (bidirectional)
  for (const exp of expansions) {
    const existing = SYNONYMS.get(exp) || [];
    if (!existing.includes(abbr)) {
      SYNONYMS.set(exp, [...existing, abbr]);
    }
  }
}

// ── Index Builder ────────────────────────────────────────────────────────────

function buildIndex(): IndexedItem[] {
  const items: IndexedItem[] = [];

  // Pages
  NAV_LINKS.forEach((link) => {
    items.push({
      item: {
        id: `page-${link.href}`,
        title: link.label,
        description: `Go to ${link.label} page`,
        category: "page",
        href: link.href,
      },
      fields: [
        { text: link.label, weight: 10, label: "title" },
        { text: `Go to ${link.label} page`, weight: 2, label: "description" },
      ],
    });
  });

  items.push({
    item: {
      id: "page-home",
      title: "Home",
      description: "Go to Home page",
      category: "page",
      href: "/",
    },
    fields: [
      { text: "Home", weight: 10, label: "title" },
      { text: "Go to Home page", weight: 2, label: "description" },
    ],
  });

  // Experiences
  experiences.forEach((exp) => {
    const title = `${exp.role} at ${exp.company}`;
    const techStr = exp.technologies.join(", ");

    items.push({
      item: {
        id: `exp-${exp.id}`,
        title,
        description: exp.description,
        category: "experience",
        href: `/experience#exp-${exp.id}`,
        meta: {
          technologies: exp.technologies.length > 0 ? exp.technologies : undefined,
          location: exp.location,
          date: exp.period,
        },
      },
      fields: [
        { text: title, weight: 10, label: "title" },
        { text: exp.description, weight: 3, label: "description" },
        ...(techStr ? [{ text: techStr, weight: 8, label: "technologies" }] : []),
        { text: exp.location, weight: 5, label: "location" },
        { text: exp.type, weight: 4, label: "type" },
        { text: exp.company, weight: 6, label: "company" },
      ],
    });
  });

  // Events
  events.forEach((evt) => {
    const tagsStr = evt.tags.join(", ");
    const orgsStr = (evt.organizations || []).join(", ");

    items.push({
      item: {
        id: `evt-${evt.slug}`,
        title: evt.title,
        description: evt.summary,
        category: "event",
        href: `/events/${evt.slug}`,
        meta: {
          location: evt.location,
          date: evt.date,
          tags: evt.tags.length > 0 ? evt.tags : undefined,
        },
      },
      fields: [
        { text: evt.title, weight: 10, label: "title" },
        { text: evt.summary, weight: 3, label: "description" },
        ...(tagsStr ? [{ text: tagsStr, weight: 7, label: "tags" }] : []),
        { text: evt.location, weight: 5, label: "location" },
        { text: evt.category, weight: 4, label: "category" },
        ...(orgsStr ? [{ text: orgsStr, weight: 5, label: "organizations" }] : []),
        ...(evt.role ? [{ text: evt.role, weight: 4, label: "role" }] : []),
      ],
    });
  });

  // Certifications
  certifications.forEach((cert) => {
    items.push({
      item: {
        id: `cert-${cert.id}`,
        title: cert.name,
        description: `Issued by ${cert.issuer}`,
        category: "certification",
        href: `/certifications#cert-${cert.id}`,
        meta: {
          date: cert.issuedDate,
          tags: [cert.category],
        },
      },
      fields: [
        { text: cert.name, weight: 10, label: "title" },
        { text: cert.issuer, weight: 6, label: "issuer" },
        { text: cert.category, weight: 7, label: "category" },
        { text: cert.issuedDate, weight: 2, label: "date" },
      ],
    });
  });

  // Blog
  BLOG_POSTS.forEach((post) => {
    const tagsStr = post.tags.join(", ");

    items.push({
      item: {
        id: `blog-${post.slug}`,
        title: post.title,
        description: post.excerpt,
        category: "blog",
        href: `/blog/${post.slug}`,
        meta: {
          date: post.date,
          tags: post.tags.length > 0 ? post.tags : undefined,
        },
      },
      fields: [
        { text: post.title, weight: 10, label: "title" },
        { text: post.excerpt, weight: 3, label: "description" },
        ...(tagsStr ? [{ text: tagsStr, weight: 7, label: "tags" }] : []),
      ],
    });
  });

  return items;
}

// ── Cache ────────────────────────────────────────────────────────────────────

let cachedIndex: IndexedItem[] | null = null;

function getIndex(): IndexedItem[] {
  if (!cachedIndex) cachedIndex = buildIndex();
  return cachedIndex;
}

// ── Query Tokenizer + Synonym Expansion ──────────────────────────────────────

// Collect all multi-word synonym keys, sorted longest-first for greedy matching
const MULTI_WORD_PHRASES: string[] = Array.from(SYNONYMS.keys())
  .filter((k) => k.includes(" "))
  .sort((a, b) => b.length - a.length);

export function getSearchTokens(query: string): string[] {
  let remaining = query.toLowerCase().trim();
  if (!remaining) return [];

  const tokens: string[] = [];

  // Greedily extract known multi-word phrases first
  // e.g., "machine learning beirut" → ["machine learning", "beirut"]
  for (const phrase of MULTI_WORD_PHRASES) {
    const idx = remaining.indexOf(phrase);
    if (idx !== -1) {
      tokens.push(phrase);
      remaining =
        remaining.slice(0, idx) + remaining.slice(idx + phrase.length);
    }
  }

  // Split whatever is left into individual word tokens (min 2 chars)
  const rest = remaining.split(/\s+/).filter((t) => t.length >= 2);
  tokens.push(...rest);

  return tokens;
}

function expandToken(token: string): string[] {
  const expanded = new Set<string>([token]);

  // Direct synonym lookup only (e.g., "aws" → "amazon web services")
  const direct = SYNONYMS.get(token);
  if (direct) direct.forEach((s) => expanded.add(s));

  return Array.from(expanded);
}

// ── Search ───────────────────────────────────────────────────────────────────

export function search(query: string): SearchResult[] {
  if (!query.trim()) return [];

  const tokens = getSearchTokens(query);
  if (tokens.length === 0) return [];

  const index = getIndex();
  const results: SearchResult[] = [];

  for (const indexed of index) {
    let totalScore = 0;
    let tokensMatched = 0;
    let bestFieldLabel = "title";
    let bestFieldWeight = 0;

    for (const token of tokens) {
      const expanded = expandToken(token);
      let tokenMatched = false;

      for (const field of indexed.fields) {
        const fieldLower = field.text.toLowerCase();
        const matched = expanded.some((exp) => fieldLower.includes(exp));

        if (matched) {
          totalScore += field.weight;
          tokenMatched = true;
          // Track which field was the strongest match (for "Matched in" hint)
          if (field.weight > bestFieldWeight && field.label !== "title" && field.label !== "description") {
            bestFieldWeight = field.weight;
            bestFieldLabel = field.label;
          }
          break; // One match per token per item
        }
      }

      if (tokenMatched) tokensMatched++;
    }

    if (totalScore === 0) continue;

    // Bonus for matching ALL tokens
    if (tokens.length > 1 && tokensMatched === tokens.length) {
      totalScore *= 1.5;
    }

    // If the best match was only in title/description, don't show "Matched in" hint
    if (bestFieldWeight === 0) bestFieldLabel = "";

    results.push({
      item: indexed.item,
      score: totalScore,
      matchedIn: bestFieldLabel,
    });
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);
}
