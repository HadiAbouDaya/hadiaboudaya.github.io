import { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/mdx";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hadiaboudaya.github.io";
  const blogSlugs = getAllSlugs();

  const staticPages = [
    "",
    "/about",
    "/experience",
    "/skills",
    "/certifications",
    "/blog",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const blogPages = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}
