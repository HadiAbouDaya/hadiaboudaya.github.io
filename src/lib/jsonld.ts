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
    sameAs: [
      "https://linkedin.com/in/hadiad",
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

export function breadcrumbJsonLd(
  items: { name: string; href: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: `${SITE_URL}${item.href}`,
      })),
    ],
  };
}
