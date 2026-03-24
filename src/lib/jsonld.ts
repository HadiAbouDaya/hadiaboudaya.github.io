import type { Event, EventCategory, Certification, BlogPost } from "@/types";

const SITE_URL = "https://hadi.aboudaya.com";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Hadi Abou Daya",
    url: SITE_URL,
    description:
      "AI/ML Consultant & Software Engineer based in Paris. Building intelligent systems from edge to cloud.",
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
      "AI/ML Consultant & Software Engineer based in Paris. Building intelligent systems from edge to cloud.",
    jobTitle: "AI/ML Consultant & Software Engineer",
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
      "Multi-Agent Systems",
      "Agentic Applications",
      "Cloud Architecture",
      "AWS",
      "RAG Pipelines",
      "Computer Vision",
      "Blockchain",
      "Web3",
      "Causal Inference",
      "Software Engineering",
    ],
    image: `${SITE_URL}/Media/profile/headshot.jpg`,
    email: "hadi.aboudaya@hotmail.com",
    telephone: "+33783267868",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Paris",
      addressCountry: "FR",
    },
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
    ...(event.organizations?.length
      ? {
          organizer: event.organizations.map((org) => ({
            "@type": "Organization",
            name: org,
          })),
        }
      : {}),
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

export function credentialListJsonLd(certs: Certification[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Certifications & Credentials",
    itemListElement: certs
      .filter((c) => c.type === "certification")
      .map((cert, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "EducationalOccupationalCredential",
          name: cert.name,
          credentialCategory: "certification",
          recognizedBy: {
            "@type": "Organization",
            name: cert.issuer,
          },
          dateCreated: cert.issuedDate,
          ...(cert.expiryDate ? { expires: cert.expiryDate } : {}),
          url: cert.credentialUrl,
        },
      })),
  };
}

export function blogJsonLd(posts: Pick<BlogPost, "title" | "slug" | "date" | "excerpt">[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Hadi Abou Daya's Blog",
    url: `${SITE_URL}/blog/`,
    author: { "@id": `${SITE_URL}/#person` },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}/`,
      datePublished: post.date,
      description: post.excerpt,
    })),
  };
}

export function contactPointJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Hadi Abou Daya",
    url: `${SITE_URL}/contact/`,
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      contactPoint: {
        "@type": "ContactPoint",
        email: "hadi.aboudaya@hotmail.com",
        telephone: "+33783267868",
        contactType: "professional",
        availableLanguage: ["English", "French", "Arabic"],
      },
    },
  };
}
