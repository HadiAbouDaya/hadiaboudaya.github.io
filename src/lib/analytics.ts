import posthog from "posthog-js";

export const EVENTS = {
  // Conversions
  CONTACT_FORM_SUBMITTED: "contact_form_submitted",
  CTA_CLICKED: "cta_clicked",
  CALENDLY_CLICKED: "calendly_clicked",

  // Content engagement
  BLOG_POST_CLICKED: "blog_post_clicked",
  BLOG_SCROLL_DEPTH: "blog_scroll_depth",
  BLOG_READ_COMPLETED: "blog_read_completed",
  EVENT_CARD_TOGGLED: "event_card_toggled",
  EVENT_FILTER_CHANGED: "event_filter_changed",
  CERTIFICATION_FILTER_CHANGED: "certification_filter_changed",
  SEARCH_PERFORMED: "search_performed",
  SEARCH_RESULT_CLICKED: "search_result_clicked",

  // Navigation & UX
  THEME_TOGGLED: "theme_toggled",
  EXTERNAL_LINK_CLICKED: "external_link_clicked",
  PAGE_SUGGESTION_CLICKED: "page_suggestion_clicked",
  MOBILE_MENU_TOGGLED: "mobile_menu_toggled",
} as const;

export function trackEvent(
  event: (typeof EVENTS)[keyof typeof EVENTS],
  properties?: Record<string, unknown>
) {
  if (typeof window !== "undefined" && posthog) {
    posthog.capture(event, properties);
  }
}
