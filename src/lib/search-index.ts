import "server-only";
import { createHash } from "node:crypto";
import { allEngagements, getEngagementContext } from "@/data/experience";
import { caseStudies } from "@/data/work";
import { certifications } from "@/data/certifications";
import { formatEventDate } from "@/data/eventCategories";
import { events } from "@/data/events";
import { NAV_LINKS } from "@/data/navigation";
import { CV_FILES } from "@/data/profile";
import { getAllPostSearchItems } from "@/lib/mdx";
import { productAcquisitionSummary } from "@/lib/project-outcomes";
import type { SearchIndex, SearchItem } from "@/lib/search";

// Retain searchable vocabulary without duplicating complete case/engagement prose.
function keywords(values: string[]): string[] {
  return [...new Set(values.join(" ").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().match(/[a-z0-9][a-z0-9+#.-]*/g) ?? [])];
}

function relationship(id: string) {
  const { engagement, practice } = getEngagementContext(id);
  return [practice?.company, engagement?.company].filter(Boolean).join(" / ");
}

export function getSearchIndex(): SearchIndex {
  const items: SearchItem[] = [
    ...NAV_LINKS.map(link => ({ id: `page-${link.href}`, title: link.label, description: `Explore ${link.label.toLowerCase()}`, category: "page" as const, href: `${link.href}/` })),
    ...CV_FILES.map(file => ({ id: `cv-${file.language}`, title: file.label, description: `Download Hadi Abou Daya's ${file.language === "fr" ? "French" : "English"} CV (PDF) on Contact`, category: "cv" as const, href: "/contact/#cv-downloads", keywords: ["cv", "resume", "curriculum vitae", "download", file.language === "fr" ? "français" : "english"] })),
    ...caseStudies.map(item => ({ id: `project-${item.slug}`, title: item.title, description: `${relationship(item.engagementId)}${item.context ? ` / ${item.context}` : ""}. ${item.summary}${item.acquisition ? ` ${productAcquisitionSummary(item)}` : ""}`, category: "experience" as const, href: `/experience/#project-${item.slug}`, keywords: keywords([relationship(item.engagementId), ...item.technologies, item.stage, item.context ?? "", productAcquisitionSummary(item), item.acquisition?.productName ?? "", item.sections.map(s => s.paragraphs.join(" ")).join(" ")]) })),
    ...allEngagements.map(item => ({ id: `exp-${item.id}`, title: `${item.role} · ${item.company}`, description: `${relationship(item.id)}. ${item.description}`, category: "experience" as const, href: `/experience/#exp-${item.id}`, keywords: keywords([relationship(item.id), ...item.technologies, ...item.bullets, ...(item.projects ?? []).flatMap(p => [p.heading, ...p.bullets])]), meta: { date: item.period, location: item.location } })),
    ...events.map(item => ({ id: `event-${item.slug}`, title: item.title, description: item.summary, category: "event" as const, href: `/events/${item.slug}/`, keywords: [...item.tags, item.role ?? "", ...(item.organizations ?? [])], meta: { date: formatEventDate(item), location: item.location } })),
    ...certifications.map(item => ({ id: `cert-${item.id}`, title: item.name, description: `${item.issuer} · ${item.type}`, category: "certification" as const, href: `/certifications/#cert-${item.id}`, keywords: [item.category, item.issuer], meta: { date: item.issuedDate } })),
    ...getAllPostSearchItems().map(item => ({ id: `blog-${item.slug}`, title: item.title, description: item.excerpt, category: "blog" as const, href: `/blog/${item.slug}/`, keywords: item.tags, meta: { date: item.date } })),
  ];
  const contentRevision = createHash("sha256").update(JSON.stringify(items)).digest("hex").slice(0, 20);
  return { schemaVersion: 1, contentRevision, items };
}
