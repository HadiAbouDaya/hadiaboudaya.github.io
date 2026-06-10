import type { Transition, Variants } from "framer-motion";

// ── Springs ──────────────────────────────────────────────────────────────────

export const SPRING = {
  snappy: { type: "spring", stiffness: 420, damping: 32, mass: 0.8 },
  smooth: { type: "spring", stiffness: 260, damping: 32, mass: 1 },
  bouncy: { type: "spring", stiffness: 300, damping: 16, mass: 0.9 },
} satisfies Record<string, Transition>;

// ── Durations & easing ─────────────────────────────────────────────────────────

export const DUR = { fast: 0.18, base: 0.3, slow: 0.6 } as const;

export const EASE_OUT = [0.21, 0.47, 0.32, 0.98] as const;

// ── Scroll-reveal viewport config ────────────────────────────────────────────

export const VIEWPORT = { once: true, margin: "-80px" } as const;

// ── Reusable variants ──────────────────────────────────────────────────────────

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.base, ease: EASE_OUT } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: SPRING.smooth },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: SPRING.snappy },
  exit: { opacity: 0, scale: 0.96, transition: { duration: DUR.fast } },
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

// ── Dialog / overlay variants ─────────────────────────────────────────────────
// Centered modal (desktop) and bottom-sheet (mobile). Built on SPRING.snappy
// with explicit exit states so AnimatePresence consumers animate out cleanly.

export const dialogPanel: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: -10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: SPRING.snappy },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -10,
    transition: { duration: DUR.fast, ease: "easeIn" },
  },
};

export const dialogPanelMobile: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: SPRING.snappy },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: DUR.fast, ease: "easeIn" },
  },
};
