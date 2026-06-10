function initPostHog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  import("posthog-js").then(({ default: posthog }) => {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      defaults: "2026-01-30",
    });
    window.__ph = posthog;
    for (const [event, properties] of window.__phq ?? []) {
      posthog.capture(event, properties);
    }
    window.__phq = [];
  });
}

if (typeof window !== "undefined") {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(initPostHog);
  } else {
    setTimeout(initPostHog, 3000);
  }
}
