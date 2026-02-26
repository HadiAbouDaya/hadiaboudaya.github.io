import { getAllSlugs, getPostBySlug, getAllPosts } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { PostContent } from "@/components/blog/PostContent";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Metadata {
  // For static export, we need to handle this synchronously
  const allPosts = getAllPosts();
  return {
    title: "Blog Post",
    description: "A blog post by Hadi Abou Daya",
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <PostContent post={post}>
      <MDXRemote
        source={post.content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
      />
    </PostContent>
  );
}
