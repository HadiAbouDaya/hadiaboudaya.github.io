interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center mb-12 lg:mb-16">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
