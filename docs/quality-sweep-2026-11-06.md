# Website quality sweep — 6 November 2026

## Scope and publication status

Reviewed the static Next.js portfolio, all 85 public sitemap routes, the shared UI,
article and event templates, content ingestion, image delivery, search, contact,
analytics, static preview and deployment workflow. Reviewed the encrypted personal
space's code and public boundary without accessing its credentials or private
content. Approved CV bytes, original media and encrypted vault objects are unchanged.
Changes are local; this sweep does not publish or change hosting configuration.

## Changes

### Security and privacy

- Reduced GitHub Actions permissions: builds are read-only; Pages/OIDC permissions
  exist only in the main-branch deployment job. Disabled persisted checkout tokens.
- Pinned all five GitHub Actions to verified commit SHAs. Non-main manual runs
  validate but cannot publish.
- Added `script-src-attr 'none'` to block inline event handlers while retaining the
  inline scripts required by the current static Next.js bootstrap.
- Corrected the optional CDN CSP: header and meta policies intersect, so its
  shared media policy must permit the encrypted root's decrypted blob playback.
  Individual root policies still constrain their resources and connections.
- Fixed a local preview disclosure: a symlinked `404.html` could serve a file
  outside the export. Added containment tests and stream cancellation on disconnect.
- Audited dependency advisories, restricted MDX parsing, analytics sanitization,
  and vault validation/session lifetime. No additional exploitable issue identified.

### Search and AI discoverability

- About's `ProfilePage` now carries a named `Person`, with a valid portrait URL.
- Author/publisher identities are meaningful within each document, with stable
  IDs and profile URLs; articles identify language and their parent blog.
- Article social cards retain site metadata and image alternative text. Event
  cards use their event image where available.
- Removed artificial midword cuts in article descriptions; search engines can
  select snippets from complete editorial excerpts.
- Sitemap modification dates no longer substitute historical event occurrence
  dates for unknown page-edit dates.
- Generated public profile/CV links target the correct English and French PDFs.
- Export checks now reject incomplete profile/author identity and missing or
  insecure sharing-image URLs.

These changes follow Google's guidance on crawlable, useful content and accurate
structured data. `llms.txt` remains a convenient public text projection; neither
it nor special markup guarantees inclusion or citations in AI answers.

### Design, accessibility and interaction

- Moved layout defaults into the components cascade layer. Tailwind page-specific
  widths and top spacing now take effect, restoring intended reading widths and
  clearance below the fixed mobile header.
- Mobile navigation recognizes article/event sections and restores meaningful
  focus when visitors select the current page.
- Article fragments clear the fixed navigation; older/newer article links wrap
  full titles instead of truncating to ambiguous labels on narrow screens.
- Event grids use consistent card widths and follow chronological DOM reading
  order without empty grid holes. Year labels are headings and filter result
  counts are announced.
- Search suggestions restore typing focus; empty results provide recovery;
  close/suggestion controls have larger touch targets.
- Fixed visible-label/accessibility-name mismatches in search, event covers and
  gallery buttons. CV downloads/gallery controls are named groups and credential
  cards expose article semantics. Card links receive block-level keyboard outlines.
- Print styling keeps dark-mode text readable without background graphics and
  removes fixed navigation and interactive controls.

### Performance and maintenance

- Blog cover `sizes` describes the actual reading column. Only the featured
  above-fold cover loads eagerly with high fetch priority; remaining covers retain
  lazy loading. Article cover images also explicitly request high priority.
- The header uses a new 120px derivative of the existing logo, reducing its
  exported image from 43,372 to 4,388 bytes. The original remains unchanged.
- The decorative globe paints at most 30 fps, caps backing resolution at 2x,
  and stops for Save Data as well as reduced motion, hidden tabs and offscreen
  content. Rotation remains elapsed-time based and resumes without jumps.
- Added durable browser checks for the canvas resource budget and the UI fixes.
- Added `pnpm audit:site`: every public route at mobile/desktop widths in both
  themes, axe A/AA checks, overflow, headings, image loading, HTTP and JS errors.
  Reports retain incomplete checks for manual review. CI runs ten representative
  routes; the full local sweep includes every article and event.

## Validation

- Frozen install: passes with Node 22.23.4 and pnpm 11.1.2 (isolated local toolchain).
- Tooling tests: 59 passing; runtime tests: 16 passing.
- Production export: 90 HTML documents, CSP on all 90, 85 public pages, 167
  JSON-LD blocks and 167 search records. Export checks report no warnings.
- Public boundary: zero private markers and zero plaintext personal media;
  encrypted-object and exact approved-CV checks pass.
- Chromium browser suite: passes 18 no-JavaScript route/viewport checks, ten
  interaction scenarios, search failure/timeout/IME recovery, contact/article
  checks, and globe resource-budget checks. Contact submissions are intercepted.
- Dependency audit: zero known advisories across 598 dependencies.
- Lint, TypeScript and whitespace checks: pass.
- Whole-site scan: **340/340** route/theme/viewport checks pass (85 pages × two
  widths × two themes). Zero detected axe A/AA violations, page overflows,
  main-heading failures, image-load failures, HTTP failures or uncaught JS errors.
- Visual review: six main public pages inspected at mobile/desktop sizes in light
  and dark themes; no concrete clipping, overlap or layout regression found.
- After the final image-priority/logo changes: **40/40** representative template
  checks pass, and the full browser suite, lint, types and production export pass
  again. These focused rechecks supplement the 340-route sweep above.

### Local mobile performance measurements

Lighthouse 13.6.0, default simulated mobile network/4x CPU, against the local
uncompressed static preview:

| Route | Performance | LCP | Total blocking time | Layout shift |
| --- | ---: | ---: | ---: | ---: |
| Home | 98 | 1.50 s | 156 ms | 0 |
| Experience | 96 | 2.25 s | 41 ms | 0 |
| Michelin principle article | 80 | 5.25 s | 40.5 ms | 0 |

All three returned 100 for Lighthouse accessibility, best practices and SEO.
These scores describe automated checks, not accessibility certification or
search ranking.

The article's high simulated LCP warranted an additional run with actual
DevTools network/CPU throttling: performance 91, LCP 2.66 s, blocking time 110 ms,
layout shift 0. These are different measurement methods, **not** a before/after
speed improvement. The fetch-priority hint is now correct, but its correction did
not improve the simulated LCP in these runs. The logo byte reduction is verified.

The preview sends uncompressed responses; the live GitHub Pages host was verified
to send gzip. Remaining lab opportunities include shared CSS/font blocking and
unused portions of framework/client bundles. Production field measurements should
guide further architectural changes; these local results cannot establish live
Core Web Vitals or guarantee faster visits.

External link check: 164 unique external main-content URLs across 85 public pages.
154 returned HTTP 200; nine returned 403 and LinkedIn returned 999 (access/bot
blocks). No 404/410, timeouts or 429 responses. Status checks do not prove the
correctness of every remote credential or JavaScript-rendered page. All public
page titles and descriptions are unique. No contact messages were submitted.

Live HTTP checks confirmed HTTPS 200 and HTTP/github.io redirects to the canonical
HTTPS domain. Live headers confirm GitHub Pages does not apply `_headers`; gzip delivery is active.

## Remaining limitations and follow-up

- Header-only protections (`frame-ancestors`, HSTS, `nosniff`, Permissions-Policy)
  require a capable CDN/host. The repository contains compatible rules, but they
  are not active on GitHub Pages. Moving hosting requires a separate deployment.
- CSP still allows inline script blocks for the static framework bootstrap.
  Blocking inline event handlers narrows exposure but does not eliminate it.
- ESLint 9 is upstream EOL. Installed React, accessibility and import plugins do
  not declare ESLint 10 compatibility. Retain the working lint stack until a
  coordinated upgrade is available; zero advisories is not a support guarantee.
- Automated accessibility checks cannot establish complete WCAG conformance.
  Incomplete checks and assistive-technology behavior still need human review.
  The video-caption check cannot detect burned-in captions: the Bobine sample
  visibly has them in the inspected frame, but synchronization/accuracy over the
  entire clip was not verified. Gradient/backdrop contrast checks also retain
  manual-review entries rather than being incorrectly reported as passes.
- Lab measurements are not real-user Core Web Vitals. Search Console/CrUX field
  data and actual AI citations were not available or verified in this session.
- Private decrypted albums were not opened or visually reviewed; code, crypto
  tests and export boundary checks are the applicable evidence for that area.

## Research consulted

- [Google: AI features and websites](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Google: Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google: sitemap modification dates](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: snippets and descriptions](https://developers.google.com/search/docs/appearance/snippet)
- [Next.js: image loading and priority](https://nextjs.org/docs/app/api-reference/components/image)
- [web.dev: optimizing LCP and distinguishing lab/field data](https://web.dev/articles/optimize-lcp)
- [MDN: Save Data preference](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData)
- [GitHub: secure Actions use](https://docs.github.com/en/actions/reference/security/secure-use)
- [MDN: CSP policy intersection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy)
- [Deque: axe documentation](https://www.deque.com/axe/core-documentation/)
- [ESLint: version support](https://eslint.org/version-support/)
