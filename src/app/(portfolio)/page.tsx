import { HeroContent } from "@/components/hero/HeroContent";
import { GlobeWrapper } from "@/components/hero/GlobeWrapper";
import { HomeHighlights } from "@/components/home/HomeHighlights";
import { personJsonLd, websiteJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { getAllPosts } from "@/lib/mdx";

export default function HomePage() {
  const latestPost = getAllPosts()[0];
  return <>
    <section className="relative isolate min-h-svh flex items-center justify-center overflow-hidden py-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd()) }} />
      <div className="absolute inset-0 -z-10"><GlobeWrapper /></div>
      <HeroContent latestPostSlug={latestPost?.slug} latestPostTitle={latestPost?.title} />
    </section>
    <HomeHighlights />
  </>;
}
