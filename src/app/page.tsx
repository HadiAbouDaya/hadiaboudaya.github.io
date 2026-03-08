import { HeroContent } from "@/components/hero/HeroContent";
import { GlobeWrapper } from "@/components/hero/GlobeWrapper";
import { HomeHighlights } from "@/components/home/HomeHighlights";
import { personJsonLd } from "@/lib/jsonld";
import { experiences } from "@/data/experience";
import { events } from "@/data/events";
import { certifications } from "@/data/certifications";
import { getAllPosts } from "@/lib/mdx";

export default function HomePage() {
  const latestRole = experiences[0];
  const featuredEvent = events.find((e) => e.tier === "featured") ?? events[0];
  const posts = getAllPosts();
  const latestPost = posts.length > 0 ? posts[0] : null;

  return (
    <>
      <section className="relative isolate h-screen flex items-center justify-center overflow-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
        <div className="absolute inset-0 -z-10">
          <GlobeWrapper />
        </div>
        <HeroContent
          latestPostSlug={latestPost?.slug}
          latestPostTitle={latestPost?.title}
        />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      <HomeHighlights
        latestRole={{ role: latestRole.role, company: latestRole.company, period: latestRole.period }}
        featuredEvent={{ title: featuredEvent.title, date: featuredEvent.date, category: featuredEvent.category }}
        certCount={certifications.length}
        latestPost={latestPost ? { slug: latestPost.slug, title: latestPost.title, excerpt: latestPost.excerpt } : null}
      />
    </>
  );
}
