# Website and Knowledge implementation report

19 October 2026. The user approved final review and deployment of the current implementation. The compact Contact CV layout is the release design; the earlier wireframes are retained as history. The previous deployment hold is superseded.

## Final release review

The release retains the home globe and AI Consultant positioning, the cinematic Experience timeline, ten professional roles, five consulting groups, three education entries and eight substantial project narratives. Selected Work remains retired. Experience uses the shared page heading, readable typography, reversible native scroll effects, official client logos, a neutral additional-consulting mark and transparent Savencia vector.

The Contact CV links fit their labels, remain 48px high and appear only on Home/Contact. Send Message and Book a Meeting remain aligned. The specified Events and Certifications explanatory copy is removed. Approved original media and exact bilingual CV PDFs are preserved.

The final review also fixed two small-screen/theme issues: article comparison tables now scroll inside a focusable region instead of widening the page, and navigation remains readable over the dark home hero in light mode. Long article text wraps. Article frontmatter now uses a YAML-only parser directly, with bounded metadata, duplicate-key/custom-tag rejection and aliases disabled. No executable frontmatter engine remains.

Dependencies were refreshed to compatible releases, including Next 16.4.2, React 19.3.1, PostHog 1.438.12 and Sharp 0.35.5. The production audit reports zero advisories. One development-only `braces` advisory remains in the Next lint plugin, with no published patch; its repository-controlled lint patterns do not enter the browser export. See [dependency maintenance](../README.md#dependency-maintenance).

## Release checks

A fresh copy containing all 445 nonignored source files, with no Knowledge folder, environment files or existing dependencies, passed frozen installation, 45 tooling/content/controller tests, 16 runtime tests, full lint, type checking before build, production export and both strict artifact verifiers. Export: 87 HTML pages with CSP, 83 professional pages, 163 JSON-LD blocks, 165 search records, 269 original rasters and 801 responsive variants. No artifact warnings or checked private markers. Original media and approved PDF hashes pass.

Browser review covers desktop and 320px/390px mobile, both themes, Contact action geometry/download sizing, Experience filters and project search/reveal/focus, logo proportions, mobile menu, credential filters, article rendering/table scrolling, and event gallery Escape/focus return. The final 320px article has 310px document width, with the 512px table contained in a 278px region; keyboard scrolling works. No external contact submission or meeting booking was made. Reduced-motion/unsupported-browser/print fallbacks are source-inspected; live field performance is not inferred from local checks.

All seven active private Knowledge files are reconciled with this release, while their prior exact bytes and the complete Master legacy annex remain preserved. Knowledge stays ignored and excluded from source ingestion, build, artifact and CI. Deployment and live verification are recorded after the authorised push succeeds.

## Historical refinement records

The sections below describe earlier dated candidates. Their former deployment holds, CV proposals and counts do not override the final release above.

## Previous completed logo/UX baseline

## Earlier verified result (historical presentation)

Education and short professional roles show their information directly. The scholarship, degree context, short contributions and methods are visible without a click. Consulting clients are visible articles beneath one independent practice. Each of the eight substantial projects presents its delivery stage and purpose, with one native disclosure for contribution and outcome. No nested disclosures remain.

The cinematic career rail, company panels, approved original assets and 18px desktop / 16px mobile reading size remain. The header is shorter, quick links reach professional experience/consulting clients/education, and mobile indentation leaves more reading room. Official MinervaHub/TowardsChange logos and a neutral connected-projects consulting icon replace initials. Smaller logo boxes are 64px desktop / 52px mobile with 4% image padding; tight client identities wrap below the logo as needed. Originals are retained. The scrolling Experience navigation is opaque, and mobile navigation controls have 44px targets.

The presentation projection removes repeated contribution lists while preserving all 36 original narrative paragraphs once, plus distinct additional contributions. Canonical career/project data, CVs and existing customer media were not rewritten. Search, event links and direct project fragments keep their IDs, open the relevant single project disclosure and receive focus. Filters persist through reload and Back/Forward using a small URL-state helper; pending focus/scroll callbacks cancel on new input.

Selected Work remains retired. The earlier site-wide content and architecture work is retained: AI Consultant positioning and home globe, ten professional roles, five consulting groups, three education records, all 56 learning records, 64 active events, eleven articles, public profile/search/metadata generation, exact bilingual CV PDFs and the private Knowledge boundary.

See [the detailed UX review](experience-ux-review-2026-10-19.md) for findings and acceptance, [the design rationale](experience-design-2026-10-19.md), and the [original implementation report](archive/implementation-report-before-experience-redesign-2026-10-19.md) for historical brief coverage. Previous Work/typography reports, exact source/document snapshots and candidate hashes remain dated history.

The earlier logo/CV revision introduced a bilingual CV band, subsequently rejected by the user. Actual download controls appear only on Home and Contact; About/footer controls are removed and search/public-profile references lead to `/contact/#cv-downloads`. Native downloads retain the exact PDFs. Direct, cross-page and same-fragment search focus the section; the scrolling Contact header is opaque. The specified Events explanatory paragraph and Certifications count subtitle are removed. Official artwork comes from [MinervaHub](https://www.minervahub.it/) and [TowardsChange](https://www.towardschange.ch/); no new career claims were imported.

## Previous verification (counts remain unchanged)

| Check | Observed result |
| --- | --- |
| Tooling/content/controller tests | 45 passed |
| Runtime/MDX/analytics tests | 16 passed; 61 total, zero failures/skips |
| Lint and post-build typecheck | Passed without diagnostics |
| Static build and release checks | 87 HTML/CSP pages; no artifact warnings |
| Metadata/public content | 83 professional pages, 163 JSON-LD blocks, 165 search records, 75,316 bytes; no private-source markers |
| Experience interaction contract | Zero education disclosures, zero nested disclosures, eight project disclosures with visible stage/purpose and focusable anchors |
| Complete narrative preservation | All 36 original paragraphs present once in the rendered page; 18 role/client/education article anchors |
| Retired routes | All nine Work URLs absent from export and local HTTP 404 |
| Assets/CVs | 269 raster originals and 801 variants, ownership/dimension/hash checks and both approved PDF hashes passed |
| Browser review | Current: desktop/320px/390px layouts and both themes, logos/consulting icon, CV deep links and search/focus, no overflow. Earlier Experience filter/history/project scenarios remain dated prior evidence |
| Download placement | All 87 exported HTML pages scanned: two PDF links each on Home/Contact, zero on other pages; both local HTTP PDFs match approved hashes |
| Diagnostics | No observed browser warnings/errors; viewport reset and original dark theme restored |

Earlier logs, original asset provenance, browser/artifact observations and source hashes are in `Knowledge/_updates/20261019T201245Z-experience-logos/`. Source inventory SHA-256 is `e388de48e99959445eedef1e1110c8fa5e7553a8abd11c40a4902ab0c9a7acf6` across 436 files. Earlier Experience UI/UX checks remain in `Knowledge/_updates/20261019T155720Z-experience-ux/`. Inventories exclude private Knowledge/environment/generated output and top-level docs; this is not a repeated isolated-build assertion. No tests were added merely to mirror CSS or text changes.

The browser review is normal UI and DOM geometry. No repeated isolated install/build, browser script disabling, media-preference simulation, print execution, raw CDP Network or live Core Web Vitals were performed. Previous denied diagnostics were not bypassed. No external form, message or booking was submitted.

## Private Knowledge and preservation

All seven active Knowledge files, including the comprehensive MasterFile, record the superseding interaction model and current results. The entire lossless legacy annex and career/credential/event/article inventories remain intact. Exact pre-edit snapshots, shared-navigation source copies and the controller's original source are preserved; active hashes and preservation checks are separate from application tests. App/build/CI does not ingest Knowledge.

## Parked items

Deployment and live verification remain withheld until explicitly requested. Existing evidence gaps and issuer/date/metric questions stay in the private backlog; no facts were invented to fill them.
