export type Accent = "blue" | "teal" | "emerald" | "amber" | "orange";

export const ACCENTS: Record<
  Accent,
  {
    chip: string;
    text: string;
    dot: string;
    border: string;
    glow: string;
    gradient: string;
  }
> = {
  blue: {
    chip: "bg-primary-50 text-primary-700 dark:bg-primary-400/10 dark:text-primary-300",
    text: "text-primary-600 dark:text-primary-400",
    dot: "bg-primary-500",
    border: "border-primary-500/60",
    glow: "hover:shadow-[0_0_0_1px_rgb(59_130_246/0.15),0_8px_32px_-8px_rgb(59_130_246/0.3)]",
    gradient: "from-primary-500 to-accent-500",
  },
  teal: {
    chip: "bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300",
    text: "text-teal-600 dark:text-teal-400",
    dot: "bg-teal-500",
    border: "border-teal-500/60",
    glow: "hover:shadow-[0_0_0_1px_rgb(20_184_166/0.15),0_8px_32px_-8px_rgb(20_184_166/0.3)]",
    gradient: "from-teal-500 to-teal-400",
  },
  emerald: {
    chip: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
    text: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
    border: "border-emerald-500/60",
    glow: "hover:shadow-[0_0_0_1px_rgb(16_185_129/0.15),0_8px_32px_-8px_rgb(16_185_129/0.3)]",
    gradient: "from-emerald-500 to-emerald-400",
  },
  amber: {
    chip: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
    border: "border-amber-500/60",
    glow: "hover:shadow-[0_0_0_1px_rgb(245_158_11/0.15),0_8px_32px_-8px_rgb(245_158_11/0.3)]",
    gradient: "from-amber-500 to-amber-400",
  },
  orange: {
    chip: "bg-orange-50 text-orange-700 dark:bg-orange-400/10 dark:text-orange-300",
    text: "text-orange-600 dark:text-orange-400",
    dot: "bg-orange-500",
    border: "border-orange-500/60",
    glow: "hover:shadow-[0_0_0_1px_rgb(249_115_22/0.15),0_8px_32px_-8px_rgb(249_115_22/0.3)]",
    gradient: "from-orange-500 to-orange-400",
  },
};
