import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { CVLinks } from "@/components/ui/CVLinks";
import { PROFILE } from "@/data/profile";

interface HeroContentProps { latestPostSlug?: string | null; latestPostTitle?: string | null }

export function HeroContent({ latestPostSlug, latestPostTitle }: HeroContentProps = {}) {
  return <div className="relative z-10 text-center px-5 max-w-3xl mx-auto">
    <p className="mb-5 text-sm uppercase tracking-[0.2em] text-primary-200 inline-flex items-center gap-2"><MapPin className="w-4 h-4" aria-hidden="true" />{PROFILE.location}</p>
    <h1 className="text-display font-bold text-white" style={{ textShadow: "0 2px 30px rgba(0,0,0,.4)" }}>Hadi Abou Daya</h1>
    <p className="mt-5 text-2xl sm:text-3xl text-primary-200 font-medium">{PROFILE.role}</p>
    <p className="mt-5 text-lg sm:text-xl leading-relaxed text-white/90 max-w-2xl mx-auto">{PROFILE.description}</p>
    <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
      <Link href="/experience/" className="inline-flex items-center gap-2 rounded-control bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 font-semibold transition-colors">Explore my experience<ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
      <Link href="/contact/" className="inline-flex items-center rounded-control border border-white/40 bg-black/20 text-white hover:bg-white/10 px-6 py-3 font-medium transition-colors">Get in touch</Link>
    </div>
    <CVLinks className="justify-center mt-6 text-white/85" />
    {latestPostSlug && latestPostTitle && <p className="mt-8 text-sm text-white/80"><Link href={`/blog/${latestPostSlug}/`} className="hover:text-white underline underline-offset-4 decoration-white/30">Latest writing: {latestPostTitle}</Link></p>}
  </div>;
}
