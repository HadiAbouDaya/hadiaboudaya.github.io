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
        "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6",
        hover && "hover:shadow-lg dark:hover:shadow-slate-900/50 hover:-translate-y-1 transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}
