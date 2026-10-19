"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowUpRight } from "lucide-react";
import { requestFragmentReveal } from "@/lib/fragments";
import { Modal } from "@/components/ui/Modal";
import { search, type SearchIndex, type SearchItem } from "@/lib/search";
import { trackEvent, EVENTS } from "@/lib/analytics";

let cached: SearchIndex | undefined;
let pending: Promise<SearchIndex> | undefined;
async function loadIndex(revision: string, retry = false): Promise<SearchIndex> {
  if (!retry && cached?.contentRevision === revision) return cached;
  if (!pending || retry) pending = fetch("/search-index.json", { cache: retry ? "reload" : "no-cache" }).then(async response => {
    if (!response.ok) throw new Error("Search could not be loaded. Please try again.");
    const data: SearchIndex = await response.json();
    if (data.schemaVersion !== 1 || !Array.isArray(data.items)) throw new Error("Search is temporarily unavailable.");
    if (data.contentRevision !== revision) throw new Error("The site has been updated. Reload this page to use the latest search.");
    cached = data; return data;
  }).finally(() => { pending = undefined; });
  return pending;
}

const labels: Record<SearchItem["category"], string> = { page: "Page", experience: "Experience", event: "Event", certification: "Learning", blog: "Writing", cv: "CV · PDF" };

export function SearchDialog({ open, onClose, contentRevision }: { open: boolean; onClose: () => void; contentRevision: string }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>(cached?.contentRevision === contentRevision ? cached.items : []);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(cached?.contentRevision !== contentRevision);
  const [selected, setSelected] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const navigating = useRef(false);
  const destination = useRef("");
  const router = useRouter();
  const results = useMemo(() => search(query, items), [query, items]);

  useLayoutEffect(() => {
    if (!open) return;
    navigating.current = false;
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void Promise.resolve().then(async () => {
      if (cancelled) return;
      setLoading(true); setError("");
      try {
        const index = await loadIndex(contentRevision, attempt > 0);
        if (!cancelled) { setItems(index.items); setError(""); setSelected(0); }
      } catch (error) {
        if (!cancelled) setError(error instanceof Error ? error.message : "Search could not be loaded.");
      } finally { if (!cancelled) setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [open, contentRevision, attempt]);

  useEffect(() => {
    if (!query.trim() || !open || loading || error) return;
    const timer = window.setTimeout(() => trackEvent(EVENTS.SEARCH_PERFORMED, { query_length: query.length, result_count: results.length }), 700);
    return () => window.clearTimeout(timer);
  }, [query, results.length, open, loading, error]);
  useEffect(() => {
    if (open && selected >= 0) document.getElementById(`search-result-${selected}`)?.scrollIntoView({ block: "nearest" });
  }, [selected, open, query]);

  function navigate(item: SearchItem, position: number) {
    navigating.current = true;
    destination.current = item.href;
    trackEvent(EVENTS.SEARCH_RESULT_CLICKED, { category: item.category, result_id: item.id, position });
    onClose();
    router.push(item.href);

  }
  return <Modal open={open} onClose={onClose} label="Search the website" initialFocusRef={input} restoreFocus={false}
    onAfterClose={() => {
      if (!navigating.current && opener.current?.isConnected) opener.current.focus({ preventScroll: true });
      else if (navigating.current && window.location.pathname.replace(/\/$/, "") === destination.current.split("#")[0].replace(/\/$/, "")) {
        const id = destination.current.split("#")[1];
        if (id) requestFragmentReveal(decodeURIComponent(id));
        else document.getElementById("main-content")?.focus({ preventScroll: true });
      }
    }}
    className="w-[calc(100%-2rem)] max-w-2xl rounded-card-lg p-0 bg-surface text-fg shadow-overlay border border-line">
    <div className="flex items-center gap-3 px-4 border-b border-line">
      <Search className="h-5 w-5 text-primary-600 shrink-0" aria-hidden="true" />
      <label htmlFor="site-search" className="sr-only">Search experience, skills, writing and CVs</label>
      <input ref={input} id="site-search" type="search" value={query} autoComplete="off" placeholder="Search experience, skills, writing…" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls="search-results" aria-activedescendant={results[selected] && !loading && !error ? `search-option-${selected}` : undefined} aria-describedby="search-status"
        onChange={event => { setQuery(event.target.value); setSelected(0); }}
        onKeyDown={event => {
          if (loading || error || !results.length) return;
          if (event.key === "ArrowDown") { event.preventDefault(); setSelected(i => Math.min(i + 1, results.length - 1)); }
          if (event.key === "ArrowUp") { event.preventDefault(); setSelected(i => Math.max(0, i - 1)); }
          if (event.key === "Enter" && results[selected]) { event.preventDefault(); navigate(results[selected].item, selected); }
        }} className="min-w-0 flex-1 bg-transparent py-5 text-base outline-none" />
      <button type="button" aria-label="Close search" onClick={onClose} className="p-2 rounded-control hover:bg-surface-raised"><X className="h-5 w-5" /></button>
    </div>
    <div className="max-h-[65svh] overflow-y-auto p-2">
      <p id="search-status" role="status" className="px-3 py-2 text-sm text-fg-mid">{loading ? "Loading search…" : error || (query ? `${results.length} results` : "Search across experience, skills, learning and writing.")}</p>
      {error && <div className="p-3 flex gap-4"><button onClick={() => { setLoading(true); setError(""); setAttempt(i => i + 1); }} className="underline">Try again</button><button onClick={() => window.location.reload()} className="underline">Reload page</button></div>}
      {!query && !loading && !error && <div className="p-3 flex flex-wrap gap-2">{["Salesforce MCP", "AWS", "MinervaHub", "CV"].map(term => <button key={term} onClick={() => { setQuery(term); setSelected(0); }} className="rounded-pill border border-line px-3 py-1.5 text-sm hover:bg-surface-raised">{term}</button>)}</div>}
      <ol id="search-results" role="listbox" aria-label="Search results" className="space-y-1">{!loading && !error && results.map(({ item }, index) => <li key={item.id} role="option" id={`search-option-${index}`} aria-selected={selected === index}>
        <a id={`search-result-${index}`} href={item.href} onClick={event => { event.preventDefault(); navigate(item, index); }} onFocus={() => setSelected(index)} onPointerMove={() => setSelected(index)}
          aria-current={selected === index ? "true" : undefined}
          className={`block rounded-control p-3 border ${selected === index ? "bg-primary-500/10 border-primary-500/40" : "border-transparent hover:bg-surface-raised"}`}>
          <span className="flex gap-3 items-start justify-between"><span className="font-medium text-sm">{item.title}</span><ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></span>
          <span className="block text-xs text-fg-mid mt-1 line-clamp-2">{item.description}</span><span className="block text-xs text-primary-700 dark:text-primary-300 mt-2">{labels[item.category]}{item.meta?.date ? ` · ${item.meta.date}` : ""}</span>
        </a>
      </li>)}</ol>
    </div>
    <p className="border-t border-line px-5 py-3 text-xs text-fg-mid">↑ ↓ to select · Enter to open · Esc to close</p>
  </Modal>;
}
