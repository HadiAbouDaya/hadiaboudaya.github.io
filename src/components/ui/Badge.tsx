import { cn } from "@/lib/utils";
import { ACCENTS, type Accent } from "@/lib/accents";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "accent";
  accent?: Accent;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  accent,
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-surface-sunken text-fg-mid",
    primary: ACCENTS.blue.chip,
    accent: ACCENTS.blue.chip,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-pill text-xs font-medium",
        accent ? ACCENTS[accent].chip : variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
