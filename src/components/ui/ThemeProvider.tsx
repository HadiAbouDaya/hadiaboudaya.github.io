"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";
interface ThemeContextValue { theme: Theme; ready: boolean; toggleTheme: () => void }
const ThemeContext = createContext<ThemeContextValue>({ theme: "dark", ready: false, toggleTheme: () => {} });
export function useTheme() { return useContext(ThemeContext); }

function validTheme(value: string | null): Theme | null {
  return value === "light" || value === "dark" ? value : null;
}
function storedTheme(): Theme | null {
  try { return validTheme(localStorage.getItem("theme")); } catch { return null; }
}
function systemTheme(): Theme {
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
}
function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
}

// Root layout must run the matching bootstrap before paint (see integration handoff).
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [{ theme, ready }, setState] = useState<{ theme: Theme; ready: boolean }>({ theme: "dark", ready: false });
  useEffect(() => {
    const preference = { current: storedTheme() };
    const rootTheme = validTheme(document.documentElement.dataset.theme ?? null);
    const initial = rootTheme ?? preference.current ?? systemTheme();
    applyTheme(initial);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- adopt the prepaint bootstrap and subscribe to external preferences
    setState({ theme: initial, ready: true });
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const update = () => {
      const next = preference.current ?? systemTheme();
      applyTheme(next);
      setState({ theme: next, ready: true });
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "theme" && event.key !== null) return;
      preference.current = validTheme(event.newValue);
      update();
    };
    const onSystem = () => { if (!preference.current) update(); };
    // A same-tab explicit choice is signalled without depending on storage availability.
    const onChoice = (event: Event) => {
      preference.current = (event as CustomEvent<Theme>).detail;
      update();
    };
    media.addEventListener("change", onSystem);
    window.addEventListener("storage", onStorage);
    window.addEventListener("site-theme-choice", onChoice);
    return () => {
      media.removeEventListener("change", onSystem);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("site-theme-choice", onChoice);
    };
  }, []);
  const toggleTheme = useCallback(() => {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch { /* In-memory choice remains usable. */ }
    window.dispatchEvent(new CustomEvent("site-theme-choice", { detail: next }));
  }, []);
  const value = useMemo(() => ({ theme, ready, toggleTheme }), [theme, ready, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
