"use client";

import { useRef } from "react";
import { m } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export interface FilterPillOption<K extends string> {
  key: K;
  label: string;
  icon?: LucideIcon;
  count?: number;
}

export interface FilterPillsProps<K extends string> {
  options: FilterPillOption<K>[];
  active: K;
  onChange: (key: K) => void;
  ariaLabel: string;
  size?: "sm" | "md";
  /** Unique id for the shared-layout indicator; must differ per mounted bar. */
  groupId: string;
  className?: string;
}

export function FilterPills<K extends string>({
  options,
  active,
  onChange,
  ariaLabel,
  size = "md",
  groupId,
  className,
}: FilterPillsProps<K>) {
  const prefersReducedMotion = useReducedMotion();
  const pillRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Roving focus: arrow keys move between pills and activate (radiogroup pattern).
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let next = index;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = (index + 1) % options.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = (index - 1 + options.length) % options.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = options.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    const target = options[next];
    onChange(target.key);
    pillRefs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap justify-center gap-2", className)}
    >
      {options.map((option, index) => {
        const isActive = option.key === active;
        const Icon = option.icon;

        return (
          <button
            key={option.key}
            ref={(el) => {
              pillRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option.key)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "relative rounded-pill text-sm font-medium transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
              size === "sm" ? "px-3 py-1.5" : "px-4 py-2",
              isActive ? "text-white" : "text-fg-mid hover:text-fg"
            )}
          >
            {isActive &&
              (prefersReducedMotion ? (
                <span className="absolute inset-0 rounded-pill bg-primary-600 shadow-glow-sm" />
              ) : (
                <m.span
                  layoutId={`pill-${groupId}`}
                  transition={SPRING.snappy}
                  className="absolute inset-0 rounded-pill bg-primary-600 shadow-glow-sm"
                />
              ))}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {Icon && (
                <Icon className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
              )}
              {option.label}
              {option.count !== undefined && (
                <span
                  className={cn(
                    "ml-0.5 text-xs",
                    isActive ? "text-white/70" : "text-fg-lo"
                  )}
                >
                  {option.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
