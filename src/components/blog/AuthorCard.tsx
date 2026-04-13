import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AuthorCard() {
  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700/50">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
        Written by
      </p>
      <div className="flex items-center gap-4">
        <ImageWithFallback
          src="/Media/profile/headshot.webp"
          alt="Hadi Abou Daya"
          width={48}
          height={48}
          fallbackText="HA"
          className="w-12 h-12 rounded-full object-cover"
          fallbackClassName="w-12 h-12 rounded-full text-sm"
        />
        <div className="min-w-0">
          <p className="font-display font-semibold text-slate-900 dark:text-white text-sm">
            Hadi Abou Daya
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            AI/ML Consultant &amp; Software Engineer
          </p>
          <Link
            href="/about/"
            className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mt-1 transition-colors"
          >
            View profile
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
