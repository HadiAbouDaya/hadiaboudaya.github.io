import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700",
        className
      )}
    />
  );
}

/** Matches ExperienceTimeline: filter tabs + alternating timeline cards */
export function TimelineSkeleton() {
  return (
    <div className="space-y-8">
      {/* Filter tabs */}
      <div className="flex justify-center gap-2">
        <Skeleton className="h-9 w-20 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
      {/* Timeline */}
      <div className="relative">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700 hidden lg:block" />
        <div className="space-y-8">
          {/* Year marker */}
          <div className="flex justify-center">
            <Skeleton className="h-8 w-16 rounded-full" />
          </div>
          {/* Card left */}
          <div className="flex justify-start lg:justify-end lg:pr-[52%]">
            <Skeleton className="h-40 w-full max-w-md rounded-xl" />
          </div>
          {/* Card right */}
          <div className="flex justify-start lg:justify-start lg:pl-[52%]">
            <Skeleton className="h-36 w-full max-w-md rounded-xl" />
          </div>
          {/* Year marker */}
          <div className="flex justify-center">
            <Skeleton className="h-8 w-16 rounded-full" />
          </div>
          {/* Card left */}
          <div className="flex justify-start lg:justify-end lg:pr-[52%]">
            <Skeleton className="h-44 w-full max-w-md rounded-xl" />
          </div>
          {/* Card right */}
          <div className="flex justify-start lg:justify-start lg:pl-[52%]">
            <Skeleton className="h-36 w-full max-w-md rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Matches CertFilter / EventFilter: filter chips + grid of cards */
export function CardGridSkeleton({ cols = 3, rows = 2 }: { cols?: number; rows?: number }) {
  return (
    <div className="space-y-6">
      {/* Filter chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      {/* Card grid */}
      <div
        className={cn(
          "grid gap-4",
          cols === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          cols === 2 && "grid-cols-1 sm:grid-cols-2"
        )}
      >
        {Array.from({ length: cols * rows }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Matches ContactForm: input fields + textarea + button */
export function FormSkeleton() {
  return (
    <div className="space-y-5">
      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      </div>
      {/* Subject */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
      {/* Message textarea */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
      {/* Submit button */}
      <Skeleton className="h-11 w-32 rounded-lg" />
    </div>
  );
}

/** Matches HomeHighlights: 4-column card row */
export function HighlightsSkeleton() {
  return (
    <section className="py-12 sm:py-16 bg-slate-900 dark:bg-slate-950">
      <div className="container-main px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded bg-slate-600" />
                <Skeleton className="h-3 w-20 bg-slate-600" />
              </div>
              <Skeleton className="h-4 w-3/4 bg-slate-600" />
              <Skeleton className="h-3 w-1/2 bg-slate-600" />
              <Skeleton className="h-3 w-16 bg-slate-600" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Matches JourneySection: side-by-side image + text paragraphs */
export function TextBlockSkeleton() {
  return (
    <section className="mt-20 lg:mt-32">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
        {/* Left column: heading + image */}
        <div className="w-full lg:w-5/12 space-y-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="aspect-[4/5] w-full max-w-md mx-auto rounded-[2rem]" />
        </div>
        {/* Right column: paragraphs */}
        <div className="w-full lg:w-7/12 space-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="pl-6 lg:pl-10 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Matches LanguagesSection: horizontal pill bar */
export function LanguagesSkeleton() {
  return (
    <section className="mt-16 lg:mt-24 mb-12 px-4">
      <div className="text-center mb-10">
        <Skeleton className="h-4 w-24 mx-auto" />
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col sm:flex-row bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-full overflow-hidden w-full sm:w-auto max-w-3xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between sm:justify-center items-center gap-4 sm:gap-3 px-6 sm:px-8 py-4 sm:py-3.5 flex-1">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-14 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Matches ContactInfo: contact method cards + button */
export function ContactInfoSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  );
}

/** Matches PageNextSection: 3-column link row */
export function PageNextSkeleton() {
  return (
    <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-700">
      <Skeleton className="h-4 w-32 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-4 rounded-lg">
            <Skeleton className="w-5 h-5 mt-0.5 rounded flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
