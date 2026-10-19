import type { Metadata } from "next";

export const DEFAULT_SOCIAL_IMAGE = {
  url: "/og-default.png", width: 1200, height: 630,
  alt: "Hadi Abou Daya · AI Consultant & Software Engineer · Paris",
} as const;
// Next replaces nested page metadata objects, so each page supplies its image explicitly.
export const DEFAULT_OPEN_GRAPH: Metadata["openGraph"] = {
  type: "website", locale: "en_US", siteName: "Hadi Abou Daya", images: [DEFAULT_SOCIAL_IMAGE],
};
export const DEFAULT_TWITTER: Metadata["twitter"] = {
  card: "summary_large_image", images: [DEFAULT_SOCIAL_IMAGE.url],
};
