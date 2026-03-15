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
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200";

  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md active:scale-[0.97] hover:scale-[1.02]",
    outline:
      "border-2 border-slate-300 text-slate-700 hover:border-primary-600 hover:text-primary-600 dark:border-slate-600 dark:text-slate-300 dark:hover:border-primary-400 dark:hover:text-primary-400 active:scale-[0.97] hover:scale-[1.02]",
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
