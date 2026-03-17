import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hadi.aboudaya.com";
  const posts = getAllPosts();

  const staticPages = [
    "",
    "/about/",
    "/experience/",
    "/events/",
    "/certifications/",
    "/blog/",
    "/contact/",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date("2026-03-14"),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
