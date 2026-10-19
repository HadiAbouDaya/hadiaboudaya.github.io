"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { trackEvent, EVENTS } from "@/lib/analytics";

export function ThemeToggle() {
  const { theme, ready, toggleTheme } = useTheme();

  if (!ready) {
    return <div className="w-11 h-11" />;
  }

  return (
    <button
      type="button"
      onClick={() => { trackEvent(EVENTS.THEME_TOGGLED, { theme: theme === "dark" ? "light" : "dark" }); toggleTheme(); }}
      className="inline-flex min-h-11 min-w-11 items-center justify-center p-2 rounded-control text-fg-mid hover:text-fg transition-colors"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
