import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hadi.aboudaya.com";
  const posts = getAllPosts();

  const staticPages = [
    "/",
    "/about/",
    "/experience/",
    "/events/",
    "/certifications/",
    "/blog/",
    "/contact/",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date("2026-03-14"),
  }));

  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: new Date(post.date),
  }));

  return [...staticPages, ...blogPages];
}
