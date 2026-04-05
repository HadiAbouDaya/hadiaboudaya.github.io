import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";
import { events } from "@/data/events";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hadi.aboudaya.com";
  const posts = getAllPosts();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about/`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/experience/`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/events/`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/certifications/`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/contact/`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
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
