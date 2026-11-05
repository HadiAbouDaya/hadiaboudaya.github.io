import { getAllSlugs, getPostBySlug, getAllPosts, remarkValidateMdx } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { PostContent } from "@/components/blog/PostContent";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ArticleTable } from "@/components/blog/ArticleTable";
import { ArticleCodeBlock } from "@/components/blog/ArticleCodeBlock";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { articleJsonLd, breadcrumbJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { DEFAULT_OPEN_GRAPH, DEFAULT_SOCIAL_IMAGE, DEFAULT_TWITTER } from "@/lib/metadata";
import { PROFILE } from "@/data/profile";
import { pageUrl } from "@/lib/urls";

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

  // Keep the editorial summary intact. Search engines and sharing clients fit
  // snippets to their display; a fixed character slice cuts words and meaning.
  const description = post.excerpt;

  return {
    title: post.title,
    description,
    authors: [{ name: PROFILE.name, url: pageUrl("/about/") }],
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: {
      ...DEFAULT_OPEN_GRAPH,
      title: post.title,
      description,
      url: `/blog/${slug}/`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt ?? post.date,
      authors: [pageUrl("/about/")],
      images: [post.coverImage ? { url: post.coverImage, alt: post.title } : DEFAULT_SOCIAL_IMAGE],
    },
    twitter: {
      ...DEFAULT_TWITTER,
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
          components={{ table: ArticleTable, pre: ArticleCodeBlock }}
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
