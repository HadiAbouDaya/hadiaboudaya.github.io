import { getAllSlugs, getPostBySlug, getAllPosts, remarkValidateMdx } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { PostContent } from "@/components/blog/PostContent";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ArticleTable } from "@/components/blog/ArticleTable";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { articleJsonLd, breadcrumbJsonLd, serializeJsonLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Blog Post" };

  const description =
    post.excerpt.length > 155
      ? post.excerpt.slice(0, 152) + "..."
      : post.excerpt;

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: {
      title: post.title,
      description,
      url: `/blog/${slug}/`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt ?? post.date,
      images: [{ url: post.coverImage || "/og-default.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [post.coverImage || "/og-default.png"],
    },
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

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? { slug: allPosts[currentIndex + 1].slug, title: allPosts[currentIndex + 1].title } : null;
  const nextPost = currentIndex > 0 ? { slug: allPosts[currentIndex - 1].slug, title: allPosts[currentIndex - 1].title } : null;

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd(post)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd([{ name: "Blog", href: "/blog" }, { name: post.title, href: "/blog/" + post.slug }])) }}
      />
      <PostContent post={post} prevPost={prevPost} nextPost={nextPost}>
        <MDXRemote
          source={post.content}
          components={{ table: ArticleTable }}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm, remarkValidateMdx],
              rehypePlugins: [rehypeSlug],
            },
          }}
        />
      </PostContent>
    </>
  );
}
