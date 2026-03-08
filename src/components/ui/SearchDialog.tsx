"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, FileText, Briefcase, Calendar, Award, BookOpen } from "lucide-react";
import { search, type SearchItem } from "@/lib/search";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

const categoryIcons: Record<SearchItem["category"], React.ComponentType<{ className?: string }>> = {
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

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setResults(search(query));
    setSelectedIndex(0);
  }, [query]);

  const navigate = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      navigate(results[selectedIndex].href);
    }
  };

  // Group results by category
  const grouped = results.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, SearchItem[]>
  );

  let flatIndex = 0;

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15 }}
          className="mx-auto mt-[15vh] w-full max-w-xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-700">
            <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search pages, events, certifications..."
              className="flex-1 py-4 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none text-sm"
            />
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto p-2">
            {query && results.length === 0 && (
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">
                No results for &ldquo;{query}&rdquo;
              </p>
            )}

            {Object.entries(grouped).map(([category, items]) => {
              const Icon = categoryIcons[category as SearchItem["category"]];
              return (
                <div key={category} className="mb-2">
                  <p className="px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {categoryLabels[category as SearchItem["category"]]}
                  </p>
                  {items.map((item) => {
                    const idx = flatIndex++;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigate(item.href)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                          idx === selectedIndex
                            ? "bg-primary-50 dark:bg-primary-900/30"
                            : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        }`}
                      >
                        <Icon className="w-4 h-4 mt-0.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {item.description}
                          </p>
                        </div>
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

          {/* Footer hints */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-400 dark:text-slate-500">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono">↑↓</kbd> navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono">↵</kbd> select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono">esc</kbd> close</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
