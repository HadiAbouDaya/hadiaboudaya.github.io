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
        "bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6",
        hover && "hover-glow hover:-translate-y-1 transition-[transform,border-color,box-shadow] duration-300 hover:border-primary-500/20 dark:hover:border-primary-400/20",
        className
      )}
    >
      {children}
    </div>
  );
}
