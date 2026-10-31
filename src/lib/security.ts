// Content-Security-Policy for the static export.
//
// GitHub Pages cannot send custom HTTP response headers, so this policy
// is delivered as a <meta http-equiv> tag from the root layout (see
// src/app/(portfolio)/layout.tsx). Directives that browsers ignore in a meta tag
// (frame-ancestors) and headers with no meta equivalent (HSTS,
// X-Content-Type-Options, X-Frame-Options, Permissions-Policy) live in
// public/_headers instead: any header-capable static host or CDN placed
// in front of the site applies them from there. Keep the two in sync.
//
// 'unsafe-inline' for scripts/styles is required by the inline theme
// script, Next.js inline bootstrap scripts, JSON-LD blocks, and
// framer-motion inline styles. PostHog and Formspree are the only
// third-party origins the site talks to (Calendly is a plain link).
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://*.posthog.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self' https://*.posthog.com https://formspree.io",
  "form-action 'self' https://formspree.io",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "upgrade-insecure-requests",
].join("; ");


/** The private space has no third-party integrations. Only ciphertext is fetched. */
export const LUNA_CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "media-src 'self' blob:",
  "worker-src 'self'",
  "connect-src 'self'",
  "form-action 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  // All resources are same-origin and relative. Avoid upgrading loopback preview
  // HTTP assets to nonexistent HTTPS endpoints in WebKit; production uses HTTPS.
].join("; ");
