import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";
import { events } from "@/data/events";
import { pageUrl } from "@/lib/urls";
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages have no editorial modification field. An old shared timestamp
  // incorrectly tells crawlers that later changes never happened; omit it.
  const staticPages: MetadataRoute.Sitemap = ["/", "/about/", "/experience/", "/events/", "/certifications/", "/blog/", "/contact/", "/privacy/"].map(path => ({ url: pageUrl(path), changeFrequency: path === "/blog/" ? "weekly" : "monthly", priority: path === "/" ? 1 : 0.7 }));
  return [...staticPages,
    ...getAllPosts().map(item => ({ url: pageUrl(`/blog/${item.slug}`), lastModified: item.updatedAt ?? item.date, changeFrequency: "monthly" as const, priority: 0.7 })),
    // An event's historical occurrence (or month-level sorting date) is not the
    // publication/modification date of its retrospective page.
    ...events.map(item => ({ url: pageUrl(`/events/${item.slug}`), ...(item.updatedAt ? { lastModified: item.updatedAt } : {}), changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
