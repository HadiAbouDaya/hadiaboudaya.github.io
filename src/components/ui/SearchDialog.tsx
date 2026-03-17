"use client";

import { useState, useEffect, useRef, useCallback, Fragment, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  FileText,
  Briefcase,
  Calendar,
  Award,
  BookOpen,
  Command,
  MapPin,
} from "lucide-react";
import {
  search,
  getSearchTokens,
  type SearchItem,
  type SearchResult,
} from "@/lib/search";
import { trackEvent, EVENTS } from "@/lib/analytics";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

const categoryIcons: Record<
  SearchItem["category"],
  React.ComponentType<{ className?: string }>
> = {
  page: FileText,
  experience: Briefcase,
  event: Calendar,
  certification: Award,
  blog: BookOpen,
};

const categoryLabels: Record<SearchItem["category"], string> = {
  page: "Pages",
  experience: "Experience",
  event: "Events",
  certification: "Certifications",
  blog: "Blog",
};

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.96, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 30,
      stiffness: 400,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -10,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

const mobileDialogVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 30,
      stiffness: 400,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

// ── Highlight matching text ──────────────────────────────────────────────────

function HighlightText({
  text,
  tokens,
}: {
  text: string;
  tokens: string[];
}) {
  if (tokens.length === 0) return <>{text}</>;

  // Build a regex that matches any token (escaped for safety)
  const escaped = tokens
    .filter((t) => t.length > 0)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (escaped.length === 0) return <>{text}</>;

  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-primary-500/20 dark:bg-primary-400/20 text-inherit rounded-sm px-0.5"
          >
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

// ── Result metadata chips ────────────────────────────────────────────────────

function ResultMeta({ item, tokens }: { item: SearchItem; tokens: string[] }) {
  const meta = item.meta;
  if (!meta) return null;

  const chips: { label: string; icon?: typeof MapPin }[] = [];

  if (meta.location) {
    chips.push({ label: meta.location, icon: MapPin });
  }
  if (meta.date) {
    chips.push({ label: meta.date });
  }

  // Show up to 3 tech badges for experiences
  if (meta.technologies && meta.technologies.length > 0) {
    const shown = meta.technologies.slice(0, 3);
    const remaining = meta.technologies.length - shown.length;
    shown.forEach((t) => chips.push({ label: t }));
    if (remaining > 0) chips.push({ label: `+${remaining}` });
  }

  // Show tags for events/blog (up to 2)
  if (meta.tags && meta.tags.length > 0 && !meta.technologies) {
    meta.tags.slice(0, 2).forEach((t) => chips.push({ label: t }));
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {chips.map((chip, i) => {
        const ChipIcon = chip.icon;
        return (
          <span
            key={i}
            className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-slate-100/80 dark:bg-slate-700/40 text-slate-400 dark:text-slate-500"
          >
            {ChipIcon && <ChipIcon className="w-2.5 h-2.5" />}
            <HighlightText text={chip.label} tokens={tokens} />
          </span>
        );
      })}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const tokens = getSearchTokens(query);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setResults(search(query));
    setSelectedIndex(-1);
  }, [query]);

  // Debounced search tracking (1s after user stops typing)
  useEffect(() => {
    if (!query || query.length < 2) return;
    const timer = setTimeout(() => {
      const resultCount = search(query).length;
      trackEvent(EVENTS.SEARCH_PERFORMED, { query, result_count: resultCount });
    }, 1000);
    return () => clearTimeout(timer);
  }, [query]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (selectedIndex < 0 || !scrollRef.current) return;
    const items = scrollRef.current.querySelectorAll("[data-result-item]");
    items[selectedIndex]?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const navigate = useCallback(
    (href: string, trackProps?: { title: string; category: string; position: number }) => {
      if (trackProps) {
        trackEvent(EVENTS.SEARCH_RESULT_CLICKED, { query, ...trackProps });
      }
      onClose();
      router.push(href);

      // After navigation, scroll to the hash target if present
      const hash = href.split("#")[1];
      if (hash) {
        const scrollToHash = () => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            return true;
          }
          return false;
        };
        // Try immediately (same-page navigation), then retry after page load
        if (!scrollToHash()) {
          const interval = setInterval(() => {
            if (scrollToHash()) clearInterval(interval);
          }, 100);
          setTimeout(() => clearInterval(interval), 3000);
        }
      }
    },
    [onClose, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
    } else if (
      e.key === "Enter" &&
      selectedIndex >= 0 &&
      results[selectedIndex]
    ) {
      e.preventDefault();
      const r = results[selectedIndex];
      navigate(r.item.href, { title: r.item.title, category: r.item.category, position: selectedIndex });
    }
  };

  // Group results by category (preserving SearchResult wrappers)
  const grouped = results.reduce(
    (acc, result) => {
      const cat = result.item.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(result);
      return acc;
    },
    {} as Record<string, SearchResult[]>
  );

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="search-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[70] bg-slate-900/60 dark:bg-black/70 backdrop-blur-md"
        onClick={onClose}
      >
        {/* Desktop dialog */}
        <motion.div
          key="search-dialog"
          variants={dialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="hidden sm:block mx-auto mt-[12vh] w-full max-w-2xl rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/50 overflow-hidden border border-white/20 dark:border-slate-600/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <SearchInput
            inputRef={inputRef}
            query={query}
            setQuery={setQuery}
            onKeyDown={handleKeyDown}
            onClose={onClose}
            showKbd
          />
          <SearchResults
            scrollRef={scrollRef}
            query={query}
            results={results}
            grouped={grouped}
            tokens={tokens}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            navigate={navigate}
            flatIndexRef={{ current: 0 }}
          />
          <DesktopFooter resultCount={query ? results.length : 0} hasQuery={!!query} />
        </motion.div>

        {/* Mobile dialog  - full screen */}
        <motion.div
          key="search-dialog-mobile"
          variants={mobileDialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="sm:hidden fixed inset-0 z-[71] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <SearchInput
            inputRef={inputRef}
            query={query}
            setQuery={setQuery}
            onKeyDown={handleKeyDown}
            onClose={onClose}
            showKbd={false}
          />
          <div className="flex-1 overflow-hidden">
            <SearchResults
              scrollRef={scrollRef}
              query={query}
              results={results}
              grouped={grouped}
              tokens={tokens}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              navigate={navigate}
              flatIndexRef={{ current: 0 }}
              mobile
            />
          </div>
          {query && results.length > 0 && (
            <div className="px-4 py-2 border-t border-slate-200/60 dark:border-slate-700/60 text-center text-[11px] text-slate-400 dark:text-slate-500">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Subcomponents ────────────────────────────────────────────────────────────

function SearchInput({
  inputRef,
  query,
  setQuery,
  onKeyDown,
  onClose,
  showKbd,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  query: string;
  setQuery: (q: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onClose: () => void;
  showKbd: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 sm:px-5 border-b border-slate-200/60 dark:border-slate-700/60">
      <Search className="w-5 h-5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search anything..."
        autoFocus
        className="flex-1 py-4 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus-visible:!outline-none text-base font-medium"
      />
      <div className="flex items-center gap-2">
        {showKbd && (
          <kbd className="inline-flex items-center gap-0.5 px-2 py-1 rounded-md bg-slate-100/80 dark:bg-slate-700/60 text-[11px] font-mono text-slate-400 dark:text-slate-500 border border-slate-200/60 dark:border-slate-600/40">
            <Command className="w-3 h-3" />K
          </kbd>
        )}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-700/40 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function SearchResults({
  scrollRef,
  query,
  results,
  grouped,
  tokens,
  selectedIndex,
  setSelectedIndex,
  navigate,
  flatIndexRef,
  mobile,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  query: string;
  results: SearchResult[];
  grouped: Record<string, SearchResult[]>;
  tokens: string[];
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  navigate: (href: string, trackProps?: { title: string; category: string; position: number }) => void;
  flatIndexRef: { current: number };
  mobile?: boolean;
}) {
  // Reset flatIndex for each render
  flatIndexRef.current = 0;

  return (
    <div
      ref={scrollRef}
      className={`overflow-y-auto py-2 px-1 ${mobile ? "h-full" : "max-h-[50vh]"}`}
    >
      {query && results.length === 0 && (
        <div className="flex flex-col items-center py-12 px-4">
          <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            No results for &ldquo;{query}&rdquo;
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Try a different search term
          </p>
        </div>
      )}

      {Object.entries(grouped).map(([category, categoryResults]) => {
        const Icon =
          categoryIcons[category as SearchItem["category"]];
        return (
          <div key={category} className="mb-2">
            <p className="px-4 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {categoryLabels[category as SearchItem["category"]]}
            </p>
            {categoryResults.map((result) => {
              const idx = flatIndexRef.current++;
              return (
                <button
                  key={result.item.id}
                  data-result-item
                  onClick={() => navigate(result.item.href, { title: result.item.title, category: result.item.category, position: idx })}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-start gap-3 px-4 ${mobile ? "py-4" : "py-3"} text-left transition-all duration-150 ${
                    idx === selectedIndex
                      ? "bg-primary-500/10 dark:bg-primary-400/10"
                      : "hover:bg-slate-50/60 dark:hover:bg-slate-700/30"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 mt-0.5 transition-colors duration-150 ${
                      idx === selectedIndex
                        ? "bg-primary-500/15 text-primary-600 dark:bg-primary-400/15 dark:text-primary-400"
                        : "bg-slate-100/80 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      <HighlightText
                        text={result.item.title}
                        tokens={tokens}
                      />
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      <HighlightText
                        text={result.item.description}
                        tokens={tokens}
                      />
                    </p>
                    <ResultMeta item={result.item} tokens={tokens} />
                    {result.matchedIn && (
                      <p className="text-[10px] text-primary-500/70 dark:text-primary-400/60 mt-1">
                        Matched in {result.matchedIn}
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 transition-colors duration-150 ${
                      idx === selectedIndex
                        ? "bg-primary-500/15 text-primary-600 dark:bg-primary-400/20 dark:text-primary-400"
                        : "bg-slate-100 dark:bg-slate-700/60 text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {categoryLabels[result.item.category]}
                  </span>
                </button>
              );
            })}
          </div>
        );
      })}

      {!query && (
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-8">
          Start typing to search...
        </p>
      )}
    </div>
  );
}

function DesktopFooter({ resultCount, hasQuery }: { resultCount: number; hasQuery: boolean }) {
  return (
    <div className="flex items-center gap-3 px-5 py-2.5 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-400 dark:text-slate-500">
      <span className="flex items-center gap-1.5">
        <kbd className="inline-flex items-center justify-center min-w-[1.5rem] px-1.5 py-0.5 rounded-md bg-slate-100/80 dark:bg-slate-700/60 font-mono text-[10px] border border-slate-200/60 dark:border-slate-600/40 shadow-sm">
          ↑↓
        </kbd>
        <span>navigate</span>
      </span>
      <span className="flex items-center gap-1.5">
        <kbd className="inline-flex items-center justify-center min-w-[1.5rem] px-1.5 py-0.5 rounded-md bg-slate-100/80 dark:bg-slate-700/60 font-mono text-[10px] border border-slate-200/60 dark:border-slate-600/40 shadow-sm">
          ↵
        </kbd>
        <span>select</span>
      </span>
      <span className="flex items-center gap-1.5">
        <kbd className="inline-flex items-center justify-center min-w-[1.5rem] px-1.5 py-0.5 rounded-md bg-slate-100/80 dark:bg-slate-700/60 font-mono text-[10px] border border-slate-200/60 dark:border-slate-600/40 shadow-sm">
          esc
        </kbd>
        <span>close</span>
      </span>
      {hasQuery && (
        <span className="ml-auto">
          {resultCount} result{resultCount !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}
