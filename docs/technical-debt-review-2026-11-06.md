# Website technical-debt review — 6 November 2026

## Scope and approach

Reviewed the public UI, runtime helpers, static preview, browser QA and build checks. Three independent source reviews covered public components, runtime/private-boundary code and tooling. This uses the AI-DLC refactor profile at Minimal depth with focused bug fixes. T3 methodology mode applies: native project hooks and engine gate receipts were unavailable, and no engine completion or human approval was fabricated. There was no existing active intent to resume.

The acceptance criteria were to fix reproducible correctness issues, reduce unused or duplicated maintenance surfaces, preserve public design/content/URLs and private data, and verify the resulting static export. New product design, ideation and infrastructure stages are omitted because this is maintenance of the existing website. The owner subsequently authorized deployment. Delivery will use the existing checked PR and GitHub Pages pipeline from `refactor/website-technical-debt` to main.

## Findings, changes and evidence

| Finding | Change | Verification |
| --- | --- | --- |
| Search inherited prototype properties from its synonym dictionary. Queries such as `constructor` and `__proto__` threw instead of matching literally. | Synonyms are expanded only for own dictionary keys. | `search.test.mjs` covers reserved keys, later search recovery, ordinary synonyms and all-term matching. |
| The search loader trusted a TypeScript cast and only validated the response envelope. Malformed matching-revision items could be cached and crash rendering. | Validate item fields, IDs, categories, metadata and public internal destinations before caching. Invalid responses enter the existing Retry flow. | `search-validation.test.mjs` covers malformed entries and destinations. Browser QA intercepts an invalid item, checks visible recovery and retries successfully. |
| Keepsake manifest validation accepted non-string text and malformed gallery entries or missing asset references. | Require record-shaped text/assets, string values and gallery fields, and own asset references before rendering. | Synthetic crypto tests reject malformed/inherited entries and retain valid/empty catalogs in schemas 1–3. No real private content was accessed. |
| Preview applied byte ranges to HEAD and rejected unknown range units. | Apply recognized byte ranges only to GET; ignore Range for HEAD and unsupported units. | Preview fixtures verify full HEAD metadata, unknown units, suffix/open-ended/case-insensitive ranges and invalid-range handling. This follows [HTTP range semantics](https://www.rfc-editor.org/rfc/rfc9110.html#section-14.2). |
| Public QA scripts duplicated browser launch policy; the performance suite hard-coded Chromium even when WebKit was selected. | Share engine/executable selection across the six public suites; fail explicitly for unsupported selectors. Performance honors the selected engine. The audit can use the same existing-origin selector when HTTPS is needed. | Browser configuration tests cover Chromium defaults/overrides, WebKit isolation and invalid selectors. The integrated Chromium suite runs against the fresh export. |
| Six unused modules retained 481 lines of obsolete UI/hooks. | Remove LazyLoad, Magnetic, Skeleton, TypingEffect, useMediaQuery and useSpotlight, plus the unused lazy animation. Keep live CSS surface effects and correct their comments. | Confirmed no live import path or code consumer before removal. Build, typechecking and public browser checks verify remaining references. These modules were already outside the live graph; no bundle-speed improvement is claimed. |
| Privacy/contact/structured-data code duplicated identity and contact values. | Read email, phone, social links and location from existing SOCIAL_LINKS/PROFILE records. | Production content verification and public browser checks pass with the same public values. |
| TypeScript allowed unused declarations and the lint config downgraded important React checks to warnings. | Enable noUnusedLocals/noUnusedParameters and restore the recommended React lint severities. | Full lint, typecheck and production build pass. |

## Verification

- AI-DLC adoption/integrity check: passed; upstream framework files are unchanged.
- Tooling tests: **76 passed**.
- Runtime tests: **16 passed**.
- Lint and TypeScript: passed, including the stricter settings.
- Production export: passed; **90 HTML documents**, **85 public pages**, approved CV/media checks and public projections verified. The private-boundary check found **zero plaintext private media**.
- Full public Chromium regression suite: passed, including 18 no-JavaScript route/viewport checks, 11 interaction scenarios, four search recovery/input scenarios, contact/article checks and globe resource-budget checks. All four synthetic contact submissions were intercepted; no messages were sent.
- Representative accessibility/layout audit: **40 passed**, zero failed route/theme/viewport checks.
- Final independent integration review: no actionable regressions found.
- Whitespace validation: passed.

## Limits and remaining debt

WebKit engine selection has unit coverage, but an actual WebKit run was not performed. The encrypted area was reviewed through source, synthetic tests and the export boundary; private decrypted albums were not opened. Automated accessibility checks do not establish complete WCAG conformance.

The existing documented ESLint major-version migration remains separate from this cleanup. No dependency major upgrades, broad animation/component rewrites, content revisions, CV changes, original-media changes or encrypted-object regeneration were needed for these fixes.
