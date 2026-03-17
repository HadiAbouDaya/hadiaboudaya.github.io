import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { PostCard } from "@/components/blog/PostCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Blog by Hadi Abou Daya. Articles on AI, large language models, computer vision, causal inference, and ML engineering.",
  alternates: { canonical: "/blog/" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="section-padding pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Blog", href: "/blog" }])) }}
      />
      <div className="container-main max-w-4xl">
        <SectionHeading
          title="Blog"
          subtitle="Thoughts on AI, engineering, and building products"
        />
        {posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
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
