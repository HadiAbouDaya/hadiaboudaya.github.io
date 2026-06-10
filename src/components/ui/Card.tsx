import { cn } from "@/lib/utils";

type CardVariant = "standard" | "interactive" | "featured";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Visual tier (hierarchy of intensity):
   * - "standard": resting surface, no hover affordance.
   * - "interactive": cursor spotlight + glow-sm + 1px lift on hover.
   * - "featured": interactive plus the animated conic ring.
   *
   * `interactive` relies on the `.card-spotlight` CSS, which no-ops gracefully
   * unless the consuming grid wires up `useSpotlight`.
   */
  variant?: CardVariant;
  /** @deprecated Use `variant`. `false` maps to "standard", `true` to "interactive". */
  hover?: boolean;
}

export function Card({ children, className, variant, hover = true }: CardProps) {
  const tier: CardVariant = variant ?? (hover ? "interactive" : "standard");

  return (
    <div
      className={cn(
        "bg-surface-raised rounded-card border border-line p-6 shadow-card",
        (tier === "interactive" || tier === "featured") &&
          "card-spotlight transition-[box-shadow,border-color,transform] duration-300 hover:shadow-glow-sm hover:border-primary-500/30 hover:-translate-y-0.5",
        tier === "featured" && "featured-ring",
        className
      )}
    >
      {children}
    </div>
  );
}
