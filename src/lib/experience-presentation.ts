import type { CaseStudy, Experience } from "@/types";

interface NarrativePolicy {
  slugs: string[];
  extraBullets?: string[];
  extraProjects?: { heading: string; contains: string }[];
}

// The narratives already cover these roles' contribution lists. These selectors
// retain the genuinely additional work without repeating the same project twice.
// Selectors use source text rather than array positions and fail on drift.
const narrativePolicies: Record<string, NarrativePolicy> = {
  aws: { slugs: ["aws-agentic-platform-pilot"], extraBullets: ["AWS Transform"] },
  savencia: { slugs: ["savencia-causal-inference"] },
  supportful: {
    slugs: ["salesforce-agent-mcp", "client-engagement-portal", "sports-booking-agents"],
    extraProjects: [{ heading: "AI Consulting Firm", contains: "Delivered production AI applications" }],
  },
  mopo: { slugs: ["mopo-conversational-ai"], extraBullets: ["agile delivery practices"] },
  minervahub: { slugs: ["minervahub-portal-advisory"] },
  towardschange: {
    slugs: ["towardschange-enterprise-knowledge"],
    extraProjects: [{ heading: "FridayGPT cloud product", contains: "SharePoint documents" }],
  },
};

const conciseDescriptions: Record<string, string> = {
  "freelance-ai-consultant": "AI consulting from client discovery and solution architecture through implementation and deployment.",
  emlyon: "Includes an exchange semester at McGill University.",
  mcgill: "Part of the emlyon MSc, with studies in AI strategy and business in North America.",
  minervahub: "", // The always-visible project purpose supplies the same context.
  "additional-ai-consulting": "", // Named projects immediately follow the role.
};

function uniqueBullet(bullets: string[], contains: string, id: string): string {
  const matches = bullets.filter(bullet => bullet.includes(contains));
  if (matches.length !== 1) throw new Error(`Experience presentation selector drift: ${id} / ${contains}`);
  return matches[0];
}

export function experiencePresentation(item: Experience, catalog: CaseStudy[]) {
  const stories = (item.caseStudySlugs ?? []).map(slug => {
    const story = catalog.find(story => story.slug === slug);
    if (!story || story.engagementId !== item.id) throw new Error(`Experience narrative relationship missing: ${item.id} / ${slug}`);
    return story;
  });
  const policy = narrativePolicies[item.id];
  const covered = policy && stories.length === policy.slugs.length && policy.slugs.every(slug => stories.some(story => story.slug === slug));
  const additional = covered ? [
    ...(policy.extraBullets ?? []).map(contains => uniqueBullet(item.bullets, contains, item.id)),
    ...(policy.extraProjects ?? []).map(({ heading, contains }) => {
      const project = item.projects?.find(project => project.heading === heading);
      if (!project) throw new Error(`Experience presentation project missing: ${item.id} / ${heading}`);
      return uniqueBullet(project.bullets, contains, item.id);
    }),
  ] : [];
  return {
    description: conciseDescriptions[item.id] ?? item.description,
    stories,
    // New, unrecognised relationships retain all source content by default.
    bullets: covered ? [] : item.bullets,
    projects: covered ? [] : item.projects ?? [],
    additional,
  };
}

/** The first need paragraph often is the visible summary; render it only once. */
export function projectDetailSections(story: CaseStudy) {
  return story.sections.map(section => ({ ...section, paragraphs: section.paragraphs.filter(paragraph => paragraph !== story.summary) }))
    .filter(section => section.paragraphs.length > 0);
}
