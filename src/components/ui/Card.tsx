import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 backdrop-blur-sm",
        hover && "hover-glow hover:-translate-y-1 transition-all duration-400 hover:border-primary-500/20 dark:hover:border-primary-400/20",
        className
      )}
    >
      {children}
    </div>
  );
}
