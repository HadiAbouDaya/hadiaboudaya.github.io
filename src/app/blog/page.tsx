import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { PostCard } from "@/components/blog/PostCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on AI, machine learning, causal inference, and engineering by Hadi Abou Daya.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="section-padding pt-24">
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
