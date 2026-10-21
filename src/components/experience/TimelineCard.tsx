import { Badge } from "@/components/ui/Badge";
import { ArrowUpRight, Workflow } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { caseStudies } from "@/data/work";
import { formatMonth } from "@/lib/dates";
import { experiencePresentation, projectDetailSections } from "@/lib/experience-presentation";
import { cn } from "@/lib/utils";
import type { CaseStudy, Experience } from "@/types";
import styles from "./experience.module.css";

export function ExperiencePeriod({ item }: { item: Pick<Experience, "startDate" | "endDate"> }) {
  return <><time dateTime={item.startDate}>{formatMonth(item.startDate)}</time>{item.endDate !== item.startDate && <> – <time dateTime={item.endDate}>{formatMonth(item.endDate)}</time></>}</>;
}

function Chevron() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className={styles.chevron}><path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function CompanyLogo({ item, small = false }: { item: Experience; small?: boolean }) {
  const consulting = item.id === "additional-ai-consulting";
  return <div className={cn(styles.logo, small && styles.smallLogo, consulting && styles.consultingLogo)}>
    {consulting ? <Workflow aria-hidden="true" strokeWidth={1.6} /> :
      <ImageWithFallback src={item.logoPath} alt="" width={80} height={80} sizes={small ? "(max-width: 600px) 52px, 64px" : "(max-width: 600px) 56px, 80px"} className={styles.logoImage} fallbackText={item.company.slice(0, 2)} />}
  </div>;
}

function ProjectStory({ story, nested }: { story: CaseStudy; nested: boolean }) {
  const Heading = nested ? "h5" : "h4";
  const SectionHeading = nested ? "h6" : "h5";
  const headingId = `project-${story.slug}-heading`;
  return <section id={`project-${story.slug}`} data-project-evidence tabIndex={-1} aria-labelledby={headingId} className={styles.projectStory}>
    <p className={styles.projectStage}>{story.stage}</p>
    <Heading id={headingId} className={styles.projectTitle}>{story.title}</Heading>
    <p className={styles.projectSummary}>{story.summary}</p>
    {story.acquisition && <section data-product-acquisition aria-labelledby={`${headingId}-acquisition`} className={styles.acquisition}>
      <div className={styles.acquisitionHeading}>
        <SectionHeading id={`${headingId}-acquisition`}>Product acquired by {story.acquisition.buyer}</SectionHeading>
        <time dateTime={story.acquisition.date}>{formatMonth(story.acquisition.date, { month: "long" })}</time>
      </div>
      <p>{story.acquisition.continuation}</p>
      <a href={story.acquisition.productUrl} target="_blank" rel="noopener noreferrer" className={styles.acquisitionLink}>
        View {story.acquisition.productName}<ArrowUpRight aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </section>}
    <details data-project-details className={styles.projectDetails}>
      <summary>
        <span><span className={styles.openLabel}>Read contributions and outcomes</span><span className={styles.closeLabel}>Hide project details</span><span className="sr-only">: {story.title}</span></span>
        <Chevron />
      </summary>
      <div className={styles.projectBody}>
        {story.context && <p className={styles.projectContext}>{story.context}</p>}
        {projectDetailSections(story).map(section => <section key={section.heading}>
          <SectionHeading className={styles.projectSectionTitle}>{section.heading}</SectionHeading>
          {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </section>)}
      </div>
    </details>
  </section>;
}

function Contributions({ bullets }: { bullets: string[] }) {
  if (!bullets.length) return null;
  if (bullets.length === 1) return <p className={styles.singleContribution}>{bullets[0]}</p>;
  return <ul className={styles.bullets}>{bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>;
}

/** Short facts stay visible; only full project narratives use progressive disclosure. */
function EntryContent({ item, nested = false }: { item: Experience; nested?: boolean }) {
  const Heading = nested ? "h5" : "h4";
  const presentation = experiencePresentation(item, caseStudies);
  return <div className={styles.entryContent}>
    <Contributions bullets={presentation.bullets} />
    {presentation.projects.map(project => <section key={project.heading} className={styles.contribution}>
      <Heading className={styles.contentHeading}>{project.heading}</Heading>
      <Contributions bullets={project.bullets} />
    </section>)}
    {presentation.stories.length > 0 && <div className={styles.projectStories}>{presentation.stories.map(story => <ProjectStory key={story.slug} story={story} nested={nested} />)}</div>}
    {presentation.additional.length > 0 && <section className={styles.additionalWork}>
      <Heading className={styles.contentHeading}>Additional contributions</Heading>
      <Contributions bullets={presentation.additional} />
    </section>}
    {item.technologies.length > 0 && <ul aria-label="Technologies and methods" className={styles.technologies}>{item.technologies.map(technology => <li key={technology}><Badge>{technology}</Badge></li>)}</ul>}
    {item.companyUrl && <p className={styles.website}><a href={item.companyUrl} target="_blank" rel="noopener noreferrer">{item.companyUrl.includes("github.com") ? "View project code" : `${item.company} website`}<span className="sr-only"> (opens in a new tab)</span></a></p>}
  </div>;
}

function Engagement({ item }: { item: Experience }) {
  const presentation = experiencePresentation(item, caseStudies);
  const headingId = `exp-${item.id}-heading`;
  return <li className={styles.branch}>
    <article id={`exp-${item.id}`} tabIndex={-1} aria-labelledby={headingId} className={styles.engagement}>
      <header className={styles.clientHeader}>
        <div className={styles.clientIdentity}>
          <CompanyLogo item={item} small />
          <div className={styles.clientName}><h4 id={headingId}>{item.company}</h4><p className={styles.clientPeriod}><ExperiencePeriod item={item} /></p></div>
        </div>
        <p className={styles.clientRole}>{item.role}{item.location && <span> · {item.location}</span>}</p>
        {presentation.description && <p className={styles.clientDescription}>{presentation.description}</p>}
      </header>
      <div className={styles.engagementBody}><EntryContent item={item} nested /></div>
    </article>
  </li>;
}

/** One semantic entry per role, with the consulting hierarchy visible at every viewport. */
export function TimelineCard({ item }: { item: Experience }) {
  const presentation = experiencePresentation(item, caseStudies);
  const isFeatured = ["aws", "freelance-ai-consultant", "savencia"].includes(item.id);
  const headingId = `exp-${item.id}-heading`;
  return <article id={`exp-${item.id}`} tabIndex={-1} aria-labelledby={headingId} className={cn(styles.chapter, isFeatured && styles.featured)}>
    <span aria-hidden="true" className={styles.careerProgress} />
    <div className={styles.year} aria-hidden="true"><span>{item.endDate.slice(0, 4)}</span>{item.startDate.slice(0, 4) !== item.endDate.slice(0, 4) && <small>from {item.startDate.slice(0, 4)}</small>}</div>
    <div className={styles.panel}>
      <header className={styles.companyHeader}>
        <CompanyLogo item={item} small={!isFeatured} />
        <div className={styles.companyIdentity}>
          <p className={styles.period}><ExperiencePeriod item={item} /></p>
          <h3 id={headingId}>{item.company}</h3>
          <p className={styles.role}>{item.role}</p>
        </div>
      </header>
      {item.location && <p className={styles.location}><svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M16 8c0 4.5-6 9-6 9S4 12.5 4 8a6 6 0 1 1 12 0Z" stroke="currentColor" strokeWidth="1.3"/><circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>{item.location}</p>}
      {presentation.description && <p className={styles.description}>{presentation.description}</p>}
      <EntryContent item={item} />
      {item.engagements?.length ? <div className={styles.consulting}>
        <div className={styles.consultingHeading}><p>Client engagements</p><span>Some engagements ran concurrently</span></div>
        <ul className={styles.branches}>{item.engagements.map(engagement => <Engagement key={engagement.id} item={engagement} />)}</ul>
      </div> : null}
    </div>
  </article>;
}
