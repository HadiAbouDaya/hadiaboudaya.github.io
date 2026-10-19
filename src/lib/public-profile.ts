import "server-only";
import { PROFILE, CV_FILES } from "@/data/profile";
import { professionalExperiences, educationExperiences, getEngagementContext } from "@/data/experience";
import { caseStudies } from "@/data/work";
import { certifications } from "@/data/certifications";
import { formatEventDate } from "@/data/eventCategories";
import { events } from "@/data/events";
import { BIO_PARAGRAPHS } from "@/data/about";
import { getAllPostSearchItems } from "@/lib/mdx";

function relationship(id: string) {
  const { engagement, practice } = getEngagementContext(id);
  return [practice?.company, engagement?.company].filter(Boolean).join(" / ");
}
export function publicProfileText(full = false) {
  const lines = [`# ${PROFILE.name}`, `> ${PROFILE.role} & ${PROFILE.supportingRole} · ${PROFILE.location}`, "", PROFILE.description, "", ...BIO_PARAGRAPHS, "", "## Main pages", ...["experience", "about", "certifications", "events", "blog", "contact"].map(path => `- [${path}](${PROFILE.url}/${path}/)`), "", "## CV downloads", ...CV_FILES.map(file => `- [${file.label}](${PROFILE.url}/contact/#cv-downloads)`), "", "## Project experience"];
  for (const item of caseStudies) {
    const link = `[${item.title}](${PROFILE.url}/experience/#project-${item.slug})`;
    const context = `${relationship(item.engagementId)}${item.context ? ` / ${item.context}` : ""}. ${item.stage}.`;
    if (full) {
      lines.push(`### ${link}`, context, item.summary, `Technologies: ${item.technologies.join(", ")}.`);
      for (const section of item.sections) lines.push(`#### ${section.heading}`, ...section.paragraphs);
    } else lines.push(`- ${link}: ${context} ${item.summary}`);
  }
  lines.push("", "## Professional experience");
  for (const entry of professionalExperiences) {
    lines.push(`### ${entry.company} — ${entry.role}`, entry.period, entry.description);
    if (full) lines.push(...entry.bullets.map(text => `- ${text}`));
    for (const child of entry.engagements ?? []) {
      lines.push(`#### ${child.company} — ${child.role}`, child.period, child.description);
      if (full) {
        lines.push(...child.bullets.map(text => `- ${text}`));
        for (const project of child.projects ?? []) lines.push(`##### ${project.heading}`, ...project.bullets.map(text => `- ${text}`));
      }
    }
  }
  lines.push("", "## Education", ...educationExperiences.map(item => `- ${item.company}: ${item.role}. ${item.period}. ${item.description}`));
  const count = certifications.filter(item => item.type === "certification").length;
  lines.push("", "## Credentials and learning", `${certifications.length} records, including ${count} professional certifications. The remainder are programmes, courses and enablement badges.`);
  if (full) {
    lines.push(...certifications.map(item => `- ${item.name} — ${item.issuer}; ${item.type}; issued ${item.issuedDate}${item.credentialUrl ? `; ${item.credentialUrl}` : ""}`), "", "## Events and milestones", ...events.map(item => `- [${item.title}](${PROFILE.url}/events/${item.slug}/): ${formatEventDate(item)}. ${item.summary}`), "", "## Writing", ...getAllPostSearchItems().map(item => `- [${item.title}](${PROFILE.url}/blog/${item.slug}/): ${item.excerpt}`));
  }
  return lines.join("\n\n") + "\n";
}
