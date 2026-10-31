import { DEFAULT_OPEN_GRAPH, DEFAULT_TWITTER } from "@/lib/metadata";
import type { Metadata } from "next";
import { getAllPostSummaries } from "@/lib/mdx";
import { PostCard } from "@/components/blog/PostCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd, blogJsonLd, serializeJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Blog - AI, ML & Engineering Articles",
  description:
    "Blog by Hadi Abou Daya. Articles on AI, large language models, computer vision, causal inference, and ML engineering.",
  alternates: { canonical: "/blog/" },
  twitter: DEFAULT_TWITTER,
  openGraph: { ...DEFAULT_OPEN_GRAPH, url: "/blog/" },
};

export default function BlogPage() {
  const listing = getAllPostSummaries();

  return (
    <div className="section-padding pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd([{ name: "Blog", href: "/blog" }])) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogJsonLd(listing)) }}
      />
      <div className="container-main max-w-4xl">
        <SectionHeading
          title="Blog"
          subtitle="Thoughts on AI, engineering, and building products"
        />
        {listing.length > 0 ? (
          <div className="space-y-8">
            {listing.map((post, i) => (
              <PostCard key={post.slug} post={post} featured={i === 0} />
            ))}
          </div>
        ) : (
          <p className="text-center text-fg-mid py-12">
            No posts published yet. Check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
