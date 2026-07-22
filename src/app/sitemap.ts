import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";
import { events } from "@/data/events";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hadi.aboudaya.com";
  const posts = getAllPosts();

  // Data-driven hubs derive lastmod from their newest item so the value stays
  // truthful as content is added.
  const latestPostDate = posts.length
    ? new Date(Math.max(...posts.map((p) => new Date(p.date).getTime())))
    : new Date("2026-06-13");
  const latestEventDate = events.length
    ? new Date(Math.max(...events.map((e) => new Date(e.date).getTime())))
    : new Date("2026-06-05");
  const latestContent = new Date(
    Math.max(latestPostDate.getTime(), latestEventDate.getTime())
  );

  // Static pages carry real, distinct lastmod values (bump manually on a genuine
  // content change). A previous build-time `new Date()` stamped every page with
  // an identical timestamp, which teaches Google to ignore lastmod site-wide.
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: latestContent, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about/`, lastModified: "2026-07-22", changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/experience/`, lastModified: "2026-06-07", changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/events/`, lastModified: latestEventDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/certifications/`, lastModified: "2026-07-22", changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog/`, lastModified: latestPostDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/contact/`, lastModified: "2026-03-24", changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy/`, lastModified: "2026-06-10", changeFrequency: "yearly", priority: 0.3 },
  ];

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}/`,
    lastModified: new Date(event.date),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticPages, ...blogPages, ...eventPages];
}
