import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { PostCard } from "@/components/blog/PostCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd, blogJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Blog - AI, ML & Engineering Articles",
  description:
    "Blog by Hadi Abou Daya. Articles on AI, large language models, computer vision, causal inference, and ML engineering.",
  alternates: { canonical: "/blog/" },
  openGraph: { url: "/blog/" },
};

export default function BlogPage() {
  const posts = getAllPosts();
  // Strip MDX `content` before passing to the client so it isn't serialized
  // into the RSC payload of the blog-list HTML.
  const listing = posts.map(({ content, ...rest }) => rest);

  return (
    <div className="section-padding pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Blog", href: "/blog" }])) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd(listing)) }}
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
          <p className="text-center text-slate-500 py-12">
            Blog posts coming soon. Stay tuned!
          </p>
        )}
      </div>
    </div>
  );
}
