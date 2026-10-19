import { configureAnalytics, isProfessionalPath } from "./lib/analytics";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (typeof window !== "undefined") {
  const localPreview = ["localhost", "127.0.0.1", "[::1]", "::1"].includes(window.location.hostname.toLowerCase());
  const allowed = () => !localPreview && isProfessionalPath(window.location.pathname);
  const analytics = configureAnalytics({
    enabled: Boolean(key),
    canCapture: allowed,
    load: async () => {
      // Delay optional telemetry, and recheck the route before both import and initialization.
      await new Promise<void>((resolve) => {
        if ("requestIdleCallback" in window) window.requestIdleCallback(() => resolve(), { timeout: 2000 });
        else setTimeout(resolve, 1000);
      });
      if (!allowed() || !key) return null;
      const { default: posthog } = await import("posthog-js");
      if (!allowed()) return null;
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        defaults: "2026-01-30",
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        capture_exceptions: false,
        capture_performance: false,
        capture_heatmaps: false,
        capture_dead_clicks: false,
        rageclick: false,
        disable_scroll_properties: true,
        disable_session_recording: true,
        disable_surveys: true,
        disable_external_dependency_loading: true,
        advanced_disable_flags: true,
        advanced_disable_feature_flags: true,
        persistence: "memory",
        disable_persistence: true,
        person_profiles: "never",
        respect_dnt: true,
        ip: false,
        // No deferred batch can leak a professional event into a later personal-page visit.
        request_batching: false,
        before_send: (event) => {
          if (!event || !allowed()) return null;
          const path = event.properties.$pathname;
          if (typeof path !== "string" || !isProfessionalPath(path)) return null;
          // Drop SDK-generated events and URL/referrer query strings as well as custom raw inputs.
          if (event.event !== "$pageview" && event.event.startsWith("$")) return null;
          event.properties.$current_url = `${window.location.origin}${path}`;
          delete event.properties.$set;
          delete event.properties.$set_once;
          for (const property of Object.keys(event.properties)) {
            if (/referr|initial_|query|search|email|message|name$/i.test(property) && property !== "$pathname" && property !== "query_length") {
              delete event.properties[property];
            }
          }
          delete event.$set;
          delete event.$set_once;
          return event;
        },
      });
      return posthog;
    },
  });

  const routeChanged = () => analytics.navigate(window.location.pathname);
  // Next's router and native Back/Forward both commit through the History API.
  // Observe committed paths rather than transition starts, which can be cancelled.
  for (const method of ["pushState", "replaceState"] as const) {
    const original = window.history[method];
    window.history[method] = function (...args: Parameters<History[typeof method]>) {
      original.apply(this, args);
      routeChanged();
    };
  }
  window.addEventListener("popstate", routeChanged);
  routeChanged();

  // A tiny delegated click island keeps PostCard's prose and layout on the server.
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[data-blog-slug]") : null;
    if (target) analytics.track("blog_post_clicked", { slug: target.dataset.blogSlug });
  });
}
