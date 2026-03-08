import { experiences } from "@/data/experience";
import { events } from "@/data/events";
import { certifications } from "@/data/certifications";
import { BLOG_POSTS } from "@/data/blogIndex";
import { NAV_LINKS } from "@/data/navigation";

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: "page" | "experience" | "event" | "certification" | "blog";
  href: string;
}

function buildIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  NAV_LINKS.forEach((link) => {
    items.push({
      id: `page-${link.href}`,
      title: link.label,
      description: `Go to ${link.label} page`,
      category: "page",
      href: link.href,
    });
  });

  items.push({
    id: "page-home",
    title: "Home",
    description: "Go to Home page",
    category: "page",
    href: "/",
  });

  experiences.forEach((exp) => {
    items.push({
      id: `exp-${exp.id}`,
      title: `${exp.role} at ${exp.company}`,
      description: exp.description,
      category: "experience",
      href: "/experience",
    });
  });

  events.forEach((evt) => {
    items.push({
      id: `evt-${evt.slug}`,
      title: evt.title,
      description: evt.summary,
      category: "event",
      href: `/events/${evt.slug}`,
    });
  });

  certifications.forEach((cert) => {
    items.push({
      id: `cert-${cert.id}`,
      title: cert.name,
      description: `Issued by ${cert.issuer}`,
      category: "certification",
      href: "/certifications",
    });
  });

  BLOG_POSTS.forEach((post) => {
    items.push({
      id: `blog-${post.slug}`,
      title: post.title,
      description: post.excerpt,
      category: "blog",
      href: `/blog/${post.slug}`,
    });
  });

  return items;
}

let cachedIndex: SearchItem[] | null = null;

export function getSearchIndex(): SearchItem[] {
  if (!cachedIndex) cachedIndex = buildIndex();
  return cachedIndex;
}

export function search(query: string): SearchItem[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase();
  const index = getSearchIndex();

  return index
    .map((item) => {
      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch = item.description.toLowerCase().includes(q);
      if (!titleMatch && !descMatch) return null;
      return { item, score: titleMatch ? 2 : 1 };
    })
    .filter(Boolean)
    .sort((a, b) => b!.score - a!.score)
    .map((r) => r!.item)
    .slice(0, 20);
}
