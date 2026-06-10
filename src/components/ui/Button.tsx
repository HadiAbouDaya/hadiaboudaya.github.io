import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  variant?: "primary" | "outline";
  href?: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

export function Button({
  variant = "primary",
  href,
  children,
  className,
  external,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-control text-sm font-medium transition-all duration-200";

  const variants = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-500 active:bg-primary-700 shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_1px_2px_rgb(2_6_23/0.3)] hover:shadow-glow-sm active:translate-y-px",
    outline:
      "border border-line text-fg hover:bg-surface-sunken hover:border-line-strong",
  };

  const styles = cn(baseStyles, variants[variant], disabled && "opacity-50 cursor-not-allowed", className);

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles} onClick={onClick}>
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={styles} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={styles}>
      {children}
    </button>
  );
}
