interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center mb-12 lg:mb-16">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
