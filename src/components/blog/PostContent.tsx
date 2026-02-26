import type { BlogPost } from "@/types";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Badge } from "@/components/ui/Badge";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PostContentProps {
  post: BlogPost;
  children: React.ReactNode;
}

export function PostContent({ post, children }: PostContentProps) {
  return (
    <div className="pt-16">
      {/* Cover banner */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-slate-100">
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

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
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
          <div className="mt-8 prose prose-slate lg:prose-lg prose-headings:text-slate-900 prose-a:text-primary-600 prose-code:text-primary-700 prose-pre:bg-slate-900">
            {children}
          </div>
        </article>
      </div>
    </div>
  );
}
