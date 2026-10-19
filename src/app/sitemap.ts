import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";
import { events } from "@/data/events";
import { pageUrl } from "@/lib/urls";
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = ["/", "/about/", "/experience/", "/events/", "/certifications/", "/blog/", "/contact/", "/privacy/"].map(path => ({ url: pageUrl(path), lastModified: "2026-10-19", changeFrequency: path === "/blog/" ? "weekly" : "monthly", priority: path === "/" ? 1 : 0.7 }));
  return [...staticPages,
    ...getAllPosts().map(item => ({ url: pageUrl(`/blog/${item.slug}`), lastModified: item.updatedAt ?? item.date, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...events.map(item => ({ url: pageUrl(`/events/${item.slug}`), lastModified: item.updatedAt ?? item.date, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
