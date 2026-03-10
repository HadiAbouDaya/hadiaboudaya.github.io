export interface Experience {
  id: string;
  company: string;
  role: string;
  type: "work" | "education" | "freelance";
  period: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  bullets: string[];
  technologies: string[];
  logoPath: string;
  companyUrl?: string;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  category:
    | "AWS"
    | "Azure"
    | "AI/ML"
    | "Data Science"
    | "Software Engineering"
    | "Security"
    | "Business";
  issuedDate: string;
  expiryDate?: string;
  credentialUrl: string;
  badgePath: string;
}

export type EventCategory =
  | "workshop"
  | "conference"
  | "hackathon"
  | "certification"
  | "community"
  | "knowledge-sharing"
  | "project"
  | "career"
  | "education"
  | "achievement";

export interface Event {
  slug: string;
  title: string;
  date: string;
  location: string;
  category: EventCategory;
  role?: string;
  organizations?: string[];
  summary: string;
  description: string;
  relatedExperienceId?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  credlyUrls?: string[];
  images?: string[];
  tags: string[];
  tier: "featured" | "standard";
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  coverImage: string;
  readingTime: number;
  content: string;
}

export interface KeyFact {
  icon: string;
  label: string;
  value: string;
  detail?: string;
}

export interface Language {
  greeting: string;
  name: string;
  proficiency: string;
}
