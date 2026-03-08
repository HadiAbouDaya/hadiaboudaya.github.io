const SITE_URL = "https://hadi.aboudaya.com";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Hadi Abou Daya",
    url: SITE_URL,
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
    author: {
      "@type": "Person",
      name: "Hadi Abou Daya",
      url: SITE_URL,
    },
    image: post.coverImage
      ? `${SITE_URL}${post.coverImage}`
      : `${SITE_URL}/Media/branding/og-default.jpg`,
    url: `${SITE_URL}/blog/${post.slug}`,
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
