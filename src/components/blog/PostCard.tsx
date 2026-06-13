"use client";

import Link from "next/link";
import type { BlogPost } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { trackEvent, EVENTS } from "@/lib/analytics";

interface PostCardProps {
  post: Omit<BlogPost, "content">;
  /** Highlights the latest post with the Featured tier (conic ring + glow). */
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <ScrollReveal>
      <Link href={`/blog/${post.slug}`} onClick={() => trackEvent(EVENTS.BLOG_POST_CLICKED, { slug: post.slug, title: post.title })}>
        <Card
          variant={featured ? "featured" : "interactive"}
          className={`overflow-hidden group${featured ? " hover:shadow-glow" : ""}`}
        >
          {/* Cover image */}
          <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden bg-surface-sunken">
            <ImageWithFallback
              src={post.coverImage}
              alt={post.title}
              width={800}
              height={400}
              sizes="(max-width:896px) 100vw, 400px"
              fallbackText={post.title.slice(0, 2)}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
              fallbackClassName="w-full h-full text-lg"
            />
          </div>

          {/* Content */}
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="accent">
                {tag}
              </Badge>
            ))}
          </div>

          <h2 className="text-title text-fg group-hover:text-primary-500 transition-colors duration-300">
            {post.title}
          </h2>

          <div className="flex items-center gap-4 mt-2 text-xs text-fg-lo">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTime} min read
            </span>
          </div>

          <p className="mt-3 text-sm text-fg-mid leading-relaxed">
            {post.excerpt}
          </p>

          <span className="inline-flex items-center gap-1 mt-4 text-sm text-primary-600 font-medium group-hover:gap-2 transition-all">
            Read more
            <ArrowRight className="w-4 h-4" />
          </span>
        </Card>
      </Link>
    </ScrollReveal>
  );
}
