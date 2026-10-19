export const EVENTS = {
  CONTACT_FORM_SUBMITTED: "contact_form_submitted",
  CTA_CLICKED: "cta_clicked",
  CALENDLY_CLICKED: "calendly_clicked",
  BLOG_POST_CLICKED: "blog_post_clicked",
  BLOG_SCROLL_DEPTH: "blog_scroll_depth",
  BLOG_READ_COMPLETED: "blog_read_completed",
  EVENT_CARD_TOGGLED: "event_card_toggled",
  EVENT_FILTER_CHANGED: "event_filter_changed",
  CERTIFICATION_FILTER_CHANGED: "certification_filter_changed",
  SEARCH_PERFORMED: "search_performed",
  SEARCH_RESULT_CLICKED: "search_result_clicked",
  THEME_TOGGLED: "theme_toggled",
  EXTERNAL_LINK_CLICKED: "external_link_clicked",
  PAGE_SUGGESTION_CLICKED: "page_suggestion_clicked",
  MOBILE_MENU_TOGGLED: "mobile_menu_toggled",
} as const;

export type AnalyticsEvent = (typeof EVENTS)[keyof typeof EVENTS];
export type AnalyticsState = "disabled" | "loading" | "ready" | "failed";
type Properties = Record<string, string | number | boolean>;
export interface AnalyticsClient {
  capture(event: string, properties: Properties): unknown;
}

const ALLOWED_PROPERTIES = new Set([
  "success", "label", "target", "href", "url", "location", "context", "slug", "title",
  "depth", "time_on_page", "reading_time", "actual_time", "expanded", "category", "type",
  "result_count", "result_id", "position", "theme", "opened", "query_length", "source", "language",
]);

export function isProfessionalPath(pathname: string): boolean {
  return !/^\/luna(?:\/|$)/i.test(pathname);
}

/** Whitelist only deliberate site metrics; never forward arbitrary form/search values. */
export function sanitizeAnalyticsProperties(properties: Record<string, unknown> = {}): Properties {
  const safe: Properties = {};
  for (const [key, value] of Object.entries(properties)) {
    if (!ALLOWED_PROPERTIES.has(key)) continue;
    if (typeof value === "boolean" || (typeof value === "number" && Number.isFinite(value))) {
      safe[key] = value;
    } else if (typeof value === "string") {
      if (["href", "url", "target"].includes(key)) {
        if (/^(mailto|tel):/i.test(value)) {
          safe[key] = value.split(":", 1)[0].toLowerCase();
          continue;
        }
        try {
          const url = new URL(value, "https://hadi.aboudaya.com");
          if (!/^https?:$/.test(url.protocol) || !isProfessionalPath(url.pathname)) continue;
          safe[key] = value.startsWith("/") ? url.pathname : `${url.origin}${url.pathname}`;
        } catch { /* Invalid destinations do not belong in analytics. */ }
      } else {
        safe[key] = value.slice(0, 180);
      }
    }
  }
  return safe;
}

/** Testable lifecycle. The SDK is loaded once; disabled/failed states never retain events. */
export function createAnalyticsController(options: {
  enabled: boolean;
  load: () => Promise<AnalyticsClient | null>;
  canCapture: () => boolean;
  maxQueue?: number;
}) {
  let state: AnalyticsState = "disabled";
  let client: AnalyticsClient | null = null;
  let startup: Promise<void> | null = null;
  let route = "";
  let lastPageview = "";
  const queue: { event: string; properties: Properties }[] = [];
  const limit = Math.max(1, Math.min(100, options.maxQueue ?? 40));
  const allowed = () => options.enabled && isProfessionalPath(route) && options.canCapture();

  function capture(event: string, properties: Properties) {
    if (!allowed() || state === "disabled" || state === "failed") return;
    if (state === "ready" && client) {
      try { client.capture(event, properties); } catch {
        state = "failed";
        queue.length = 0;
      }
    } else {
      if (queue.length === limit) {
        const custom = queue.findIndex((item) => item.event !== "$pageview");
        queue.splice(custom < 0 ? 0 : custom, 1);
      }
      queue.push({ event, properties });
    }
  }

  function initialize() {
    if (startup || client || state === "failed" || !allowed()) return;
    startup = options.load().then((loaded) => {
      client = loaded;
      if (!allowed() || !loaded) {
        state = "disabled";
        queue.length = 0;
        return;
      }
      state = "ready";
      for (const item of queue.splice(0)) capture(item.event, item.properties);
    }).catch(() => {
      state = "failed";
      queue.length = 0;
    }).finally(() => { startup = null; });
  }

  return {
    navigate(pathname: string) {
      // Ignore query strings and fragments. Replace-state and hash navigation cannot duplicate views.
      route = `${(pathname.split(/[?#]/, 1)[0] || "/").replace(/\/+$/, "")}/`;
      if (!allowed()) {
        queue.length = 0;
        state = "disabled";
        lastPageview = "";
        return;
      }
      if (state === "failed") return;
      state = client ? "ready" : "loading";
      if (lastPageview !== route) {
        lastPageview = route;
        capture("$pageview", { $pathname: route });
      }
      initialize();
    },
    track(event: AnalyticsEvent, properties?: Record<string, unknown>) {
      capture(event, { ...sanitizeAnalyticsProperties(properties), $pathname: route });
    },
    get state(): AnalyticsState { return state; },
    get queuedCount() { return queue.length; },
  };
}

let controller: ReturnType<typeof createAnalyticsController> | undefined;
export function configureAnalytics(options: Parameters<typeof createAnalyticsController>[0]) {
  controller ??= createAnalyticsController(options);
  return controller;
}

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  if (typeof window === "undefined" || !isProfessionalPath(window.location.pathname)) return;
  controller?.track(event, properties);
}
