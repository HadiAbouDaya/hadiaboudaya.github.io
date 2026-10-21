import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { latestExperience, professionalExperiences } from "@/data/experience";
import { certifications } from "@/data/certifications";
import { caseStudies } from "@/data/work";
import { formatMonth } from "@/lib/dates";

const mopoAcquisition = caseStudies.find(item => item.engagementId === "mopo")?.acquisition;
const consultingSummary = "Client discovery, architecture and hands-on AI delivery";

const featured = [
  { id: "aws", summary: "Customer-facing AI and data delivery, including an agentic platform pilot built with Amazon Bedrock and AgentCore." },
  { id: "freelance-ai-consultant", summary: mopoAcquisition
    ? `${consultingSummary}—including MOPO’s conversational AI product, acquired by ${mopoAcquisition.buyer} in ${formatMonth(mopoAcquisition.date, { month: "long" })}.`
    : `${consultingSummary} across a consulting practice, with engagements including Supportful, MOPO and MinervaHub.` },
  { id: "savencia", summary: "Causal inference for industrial production, translating analytical findings into recommendations for R&D and engineering teams." },
];

export function HomeHighlights() {
  const learningCount = certifications.length;
  const professionalCount = certifications.filter(item => item.type === "certification").length;
  return <section className="relative py-16 sm:py-24 bg-surface-sunken">
    <div className="container-main px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap gap-4 justify-between items-end mb-8">
        <div><p className="text-eyebrow uppercase text-primary-600 dark:text-primary-400 mb-2">From needs to delivery</p><h2 className="text-headline text-fg">Experience in practice</h2></div>
        <Link href="/experience/" className="inline-flex items-center gap-2 text-sm text-fg-mid hover:text-fg">Explore my experience<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      </div>
      <div className="grid gap-5 md:grid-cols-3">{featured.map(({ id, summary }) => {
        const item = professionalExperiences.find(item => item.id === id)!;
        return <Link key={id} href={`/experience/#exp-${id}`} className="group block rounded-card border border-line bg-surface-raised p-6 shadow-card hover:border-primary-500/50 transition-colors">
          <p className="text-xs font-medium text-primary-700 dark:text-primary-300 mb-4">{item.period}</p>
          <h3 className="text-xl font-semibold text-fg mb-2">{item.company}</h3><p className="text-sm font-medium text-fg mb-3">{item.role}</p><p className="text-sm leading-relaxed text-fg-mid">{summary}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-700 dark:text-primary-300">Explore this experience<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" /></span>
        </Link>;
      })}</div>
      <div className="grid sm:grid-cols-2 gap-6 mt-10 pt-8 border-t border-line">
        <div><p className="text-eyebrow uppercase text-fg-lo mb-2">Latest experience</p><Link href="/experience/#exp-aws" className="font-semibold text-fg hover:underline">{latestExperience.role} · {latestExperience.company}</Link><p className="text-sm text-fg-mid mt-1">{latestExperience.period}</p></div>
        <div><p className="text-eyebrow uppercase text-fg-lo mb-2">Continuing learning</p><Link href="/certifications/" className="font-semibold text-fg hover:underline">{learningCount} credentials and learning records</Link><p className="text-sm text-fg-mid mt-1">{professionalCount} professional certifications, alongside programmes, courses and badges.</p></div>
      </div>
    </div>
  </section>;
}
