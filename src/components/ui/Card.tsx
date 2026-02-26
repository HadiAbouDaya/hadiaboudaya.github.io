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
        "bg-white rounded-xl border border-slate-200 p-6",
        hover && "hover:shadow-lg transition-shadow duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}
