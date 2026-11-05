import type { KeyFact, Language } from "@/types";

export const BIO_PARAGRAPHS = [
  "I'm an AI consultant based in Paris, with a background in software engineering. I combine hands-on work in AI agents and cloud solutions with client discovery and solution design.",
  "My projects span production AI agents, enterprise knowledge assistants and architecture roadmaps. I work with clients to clarify priorities and constraints, and enjoy making technical ideas accessible to people without a technical background.",
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

export const JOURNEY_CHAPTERS = [
  {
    id: "origins",
    heading: "From the Bekaa Valley to Beirut",
    paragraph: "I grew up in Lebanon’s Bekaa Valley, interested in physics, mathematics and how things work. After school in Zahle, I moved to Beirut to study software engineering at USJ-ESIB.",
  },
  {
    id: "building",
    heading: "Learning through building",
    paragraph: "My early work took me from language processing and computer vision to machine-learning systems used in production. Through independent consulting, I began working on company-knowledge assistants and business workflows. At MOPO, I led a project from concept through production launch.",
  },
  {
    id: "business",
    heading: "Bringing engineering and business together",
    paragraph: "Studying Data Science and AI Strategy at emlyon, with an exchange semester at McGill, added a business perspective to my engineering background. My consulting work brings those perspectives together: understanding client needs, making architecture decisions and carrying the work through implementation.",
  },
] as const;
