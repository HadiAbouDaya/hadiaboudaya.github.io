// Pure matching code: the browser never imports the full content collections.
export type SearchCategory = "page" | "experience" | "event" | "certification" | "blog" | "cv";
export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: SearchCategory;
  href: string;
  keywords?: string[];
  meta?: { date?: string; location?: string; technologies?: string[]; tags?: string[] };
}
export interface SearchResult { item: SearchItem; score: number; matchedIn: string }
export interface SearchIndex { schemaVersion: 1; contentRevision: string; items: SearchItem[] }

const synonyms: Record<string, string[]> = {
  cv: ["curriculum vitae", "resume", "computer vision"], resume: ["cv", "curriculum vitae"],
  ml: ["machine learning"], nlp: ["natural language processing"], ai: ["artificial intelligence"],
  llm: ["large language model"], rag: ["retrieval augmented generation"], aws: ["amazon web services"],
  mcp: ["model context protocol"], a2a: ["agent2agent"], sso: ["single sign-on"],
};
export function getSearchTokens(query: string) { return query.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().split(/\s+/).filter(Boolean); }
const normalize = (text: string) => getSearchTokens(text).join(" ");
export function search(query: string, items: SearchItem[] = []): SearchResult[] {
  const tokens = getSearchTokens(query);
  if (!tokens.length) return [];
  const results: SearchResult[] = [];
  for (const item of items) {
    const fields = [
      { value: item.title, weight: 12, label: "title" },
      { value: (item.keywords ?? []).join(" "), weight: 8, label: "skills" },
      { value: item.description, weight: 4, label: "description" },
      { value: Object.values(item.meta ?? {}).flat().join(" "), weight: 3, label: "context" },
    ].map(field => ({ ...field, value: normalize(field.value) }));
    let score = 0, matched = 0, matchedIn = "";
    for (const token of tokens) {
      const expansions = [token, ...(synonyms[token] ?? [])];
      const field = fields.find(field => expansions.some(term => field.value.includes(term)));
      if (field) { score += field.weight; matched++; matchedIn ||= field.label; }
    }
    // Multiword requests must match every term; avoid broad irrelevant suggestions.
    if (matched !== tokens.length) continue;
    if (normalize(item.title).includes(normalize(query))) score += 12;
    if (item.category === "experience") score += 5;
    if (item.category === "cv" && tokens.some(t => ["cv", "resume", "curriculum"].includes(t))) score += 25;
    results.push({ item, score, matchedIn });
  }
  return results.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title)).slice(0, 20);
}
