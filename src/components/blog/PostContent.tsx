import type { BlogPost } from "@/types";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Badge } from "@/components/ui/Badge";
import { BlogReadTracker } from "@/components/blog/BlogReadTracker";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

interface AdjacentPost {
  slug: string;
  title: string;
}

interface PostContentProps {
  post: BlogPost;
  prevPost?: AdjacentPost | null;
  nextPost?: AdjacentPost | null;
  children: React.ReactNode;
}

export function PostContent({ post, prevPost, nextPost, children }: PostContentProps) {
  return (
    <div className="pt-16">
      {/* Cover banner */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-slate-100 dark:bg-slate-800">
        <ImageWithFallback
          src={post.coverImage}
          alt={post.title}
          width={1200}
          height={600}
          fallbackText={post.title.slice(0, 2)}
          className="w-full h-full object-cover"
          fallbackClassName="w-full h-full text-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="section-padding">
        <article className="max-w-prose mx-auto">
          {/* Header */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="accent">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <Link href="/about" className="flex items-center gap-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <span className="font-medium text-slate-700 dark:text-slate-300">Hadi Abou Daya</span>
            </Link>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readingTime} min read
            </span>
          </div>

          {/* MDX Content */}
          <BlogReadTracker slug={post.slug} title={post.title} readingTime={post.readingTime}>
            <div className="mt-8 prose prose-slate dark:prose-invert lg:prose-lg prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-primary-600 prose-code:text-primary-700 dark:prose-code:text-primary-300 prose-pre:bg-slate-900">
              {children}
            </div>
          </BlogReadTracker>

          {/* Prev / Next navigation */}
          {(prevPost || nextPost) && (
            <nav className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors min-w-0"
                >
                  <ArrowLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                  <span className="truncate">{prevPost.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors min-w-0 text-right ml-auto"
                >
                  <span className="truncate">{nextPost.title}</span>
                  <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </article>
      </div>
    </div>
  );
}
