"use client";

import Link from "next/link";
import type { BlogPost } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface PostCardProps {
  post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <ScrollReveal>
      <Link href={`/blog/${post.slug}`}>
        <Card className="overflow-hidden group">
          {/* Cover image */}
          <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden bg-slate-100">
            <ImageWithFallback
              src={post.coverImage}
              alt={post.title}
              width={800}
              height={400}
              fallbackText={post.title.slice(0, 2)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

          <h2 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
            {post.title}
          </h2>

          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
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

          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
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
