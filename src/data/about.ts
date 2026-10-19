import type { KeyFact, Language } from "@/types";

export const BIO_PARAGRAPHS = [
  "I'm an AI consultant based in Paris, with a background in software engineering. I combine hands-on work in AI agents and cloud solutions with client discovery and solution design.",
  "I'm currently developing further in enterprise AI architecture, agent reliability and evaluation, and AI strategy and business value. I enjoy exploring what AI makes possible and making technical ideas accessible to people without a technical background.",
];
export const BIO = BIO_PARAGRAPHS.join("\n\n");

export const KEY_FACTS: KeyFact[] = [
  { icon: "Briefcase", label: "Experience", value: "Engineering & consulting", detail: "Software development since 2020; AI/ML work since 2021" },
  { icon: "Award", label: "Learning", value: "AI · Cloud · Delivery", detail: "Professional certifications, structured programmes, courses and enablement badges" },
  { icon: "GraduationCap", label: "Education", value: "Data Science & AI Strategy", detail: "emlyon MSc; McGill exchange semester; Software Engineering degree at USJ-ESIB" },
  { icon: "Globe", label: "International experience", value: "Based in Paris", detail: "Studied in Lebanon, France and Canada; worked with international teams" },
];

export const LANGUAGES: Language[] = [
  { greeting: "Bonjour", name: "French", proficiency: "Fluent" },
  { greeting: "Hello", name: "English", proficiency: "Fluent" },
  { greeting: "مرحبا", name: "Arabic", proficiency: "Native" },
];

export const JOURNEY_PARAGRAPHS = [
  "Born and raised in Lebanon's Bekaa Valley, I grew up interested in physics, mathematics and how things work. After my Lebanese Baccalaureate in General Science at Collège Saint Joseph in Zahle, I moved to Beirut to study Software Engineering at USJ-ESIB.",
  "My background spans software development, machine learning and AI consulting. Early work in NLP and edge computer vision led to production cloud ML at Mobile Arts, followed by client work in conversational AI, enterprise knowledge access and business workflows.",
  "Through independent consulting, I combined implementation with needs analysis, architecture and delivery planning. At MOPO, I led a project from concept through production launch. Other engagements included production sales and sports agents through Supportful, knowledge-access solutions at TowardsChange, and employee-portal advisory work for MinervaHub.",
  "My studies in Data Science and AI Strategy at emlyon, including an exchange semester at McGill, added a business perspective to that engineering background. At Savencia, I applied causal inference to an industrial production question and communicated recommendations to R&D and engineering teams. My AWS Professional Services experience included a customer-facing agentic platform pilot.",
];
