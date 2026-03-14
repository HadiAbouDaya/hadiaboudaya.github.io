import type { Event, EventCategory } from "@/types";

const SITE_URL = "https://hadi.aboudaya.com";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Hadi Abou Daya",
    url: SITE_URL,
    description:
      "AI/ML Engineer & Consultant based in Paris. Building intelligent systems from edge to cloud.",
    publisher: { "@id": `${SITE_URL}/#person` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Hadi Abou Daya",
    url: SITE_URL,
    description:
      "AI/ML Engineer & Consultant based in Paris. Building intelligent systems from edge to cloud.",
    jobTitle: "AI/ML Engineer & Consultant",
    worksFor: {
      "@type": "Organization",
      name: "Supportful",
      url: "https://supportful.world",
    },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "emlyon business school" },
      { "@type": "CollegeOrUniversity", name: "McGill University" },
      {
        "@type": "CollegeOrUniversity",
        name: "Saint Joseph University of Beirut (ESIB)",
      },
    ],
    knowsLanguage: ["en", "fr", "ar"],
    nationality: { "@type": "Country", name: "Lebanon" },
    sameAs: [
      "https://www.linkedin.com/in/hadiad",
      "https://github.com/HadiAbouDaya",
    ],
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "LLM Agents",
      "Cloud Computing",
      "Computer Vision",
    ],
    image: `${SITE_URL}/Media/profile/headshot.jpg`,
  };
}

export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/about/#profilepage`,
    url: `${SITE_URL}/about/`,
    mainEntity: { "@id": `${SITE_URL}/#person` },
  };
}

export function articleJsonLd(post: {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  coverImage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Hadi Abou Daya",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Hadi Abou Daya",
    },
    image: post.coverImage
      ? `${SITE_URL}${post.coverImage}`
      : `${SITE_URL}/Media/branding/og-default.jpg`,
    url: `${SITE_URL}/blog/${post.slug}/`,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}/`,
  };
}

const EVENT_TYPE_MAP: Record<EventCategory, string> = {
  workshop: "EducationEvent",
  conference: "Event",
  hackathon: "Event",
  certification: "EducationEvent",
  community: "SocialEvent",
  "knowledge-sharing": "EducationEvent",
  project: "Event",
  career: "Event",
  education: "EducationEvent",
  achievement: "Event",
};

export function eventJsonLd(event: Event) {
  return {
    "@context": "https://schema.org",
    "@type": EVENT_TYPE_MAP[event.category] || "Event",
    name: event.title,
    startDate: event.date,
    description: event.summary,
    location: {
      "@type": "Place",
      name: event.location,
    },
    organizer: event.organizations?.map((org) => ({
      "@type": "Organization",
      name: org,
    })),
    image: event.images?.[0]
      ? `${SITE_URL}${event.images[0]}`
      : undefined,
    url: `${SITE_URL}/events/${event.slug}/`,
    eventAttendanceMode:
      "https://schema.org/OfflineEventAttendanceMode",
  };
}

export function breadcrumbJsonLd(
  items: { name: string; href: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: `${SITE_URL}${item.href.endsWith("/") ? item.href : `${item.href}/`}`,
      })),
    ],
  };
}
