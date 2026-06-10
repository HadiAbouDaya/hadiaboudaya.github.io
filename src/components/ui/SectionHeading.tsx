interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center mb-12 lg:mb-16">
      <h1 className="text-headline text-gradient">
        {title}
      </h1>
      <div className="mt-4 mx-auto w-12 h-0.5 bg-gradient-brand rounded-pill" />
      {subtitle && (
        <p className="mt-5 text-lg text-fg-mid max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
