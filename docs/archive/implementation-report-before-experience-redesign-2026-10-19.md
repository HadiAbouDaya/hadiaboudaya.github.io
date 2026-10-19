# Website and Knowledge implementation report

19 October 2026. Local implementation based on commit `fe66dd6461e7bfaf51c57d153e27c73a6dbf39fe`. No commit, push, workflow dispatch or deployment was performed. The local export is available through `pnpm preview` at http://127.0.0.1:3000/.

## Result

The site now presents AI consulting and hands-on engineering together. Eight Selected Work cases explain the need, contribution, stage and outcome; each resolves its engagement period and Experience relationship from the shared chronology. AWS is the latest experience. One independent-consulting parent contains five dated engagement groups, alongside nine other professional entries and three education entries. McGill is an exchange semester within the emlyon MSc.

The homepage retains the globe and established visual identity, with a stable AI Consultant role, selected work, contact and quieter bilingual CV downloads. About, footer, author information, metadata and machine-readable profile exports follow the reconciled public story. Both CV PDFs are exact copies of the approved originals, with verified hashes and one-page render checks.

All 56 learning records remain: 9 professional certifications, 4 programmes, 40 courses and 3 enablement badges. The archive retains 64 active records; the identifying portal page retires while its approved media remain. All 65 baseline event records have a disposition in private Knowledge. Eleven articles received targeted editorial reconciliation, primary-source links where used and editorial update dates without changing publication history. Peripheral historical vendor and issuer claims retain explicit verification limits.

## Architecture and maintenance

- Server-rendered Experience, Work, event details and article cards, with small client controllers for interaction. Experience has a single responsive DOM hierarchy and unique anchors.
- A public search projection loaded when search opens, with a shared in-flight request, session cache, content revision checks, retry state and deterministic result order. Global layouts pass only the revision token. Search includes all cases, nested engagements and both CVs; raw search queries are excluded from analytics.
- Shared native dialog behaviour for search, navigation and image viewing: focus isolation, dismissal, restoration and navigation focus. Theme bootstrap and provider share a valid stored preference / OS / dark-fallback policy with guarded storage.
- Corrected carousel navigation, responsive image fallbacks, stable reduced-motion component trees, cancelled animation frames/timers and time-based globe rotation with integer backing dimensions.
- One article geometry/active-time controller serves both reading progress and deliberate reading metrics. Analytics has bounded lifecycle states, route exclusions, explicit capture settings and no persistent identifier. Loopback previews are excluded.
- A validated, cached server MDX catalog with safe YAML, source/asset validation and a Markdown/GFM renderer allowlist. Calendar formatting is deterministic across time zones.
- Explicit shared social metadata, a real 1200×630 `/og-default.png`, safe JSON-LD, correct canonical URLs, generated LLM text and sitemap. Month milestones do not become synthetic exact publication dates.
- Image families have explicit owners for colliding stems. All 267 original rasters and all 795 responsive URLs remain. Content/settings/version caching shares equivalent encodes, checks source freshness and bounds concurrency. Frozen toolchain, useful test commands, strict artifact verification and a static preview replace assumptions about a running Next server.

## Verification

The final integrated workspace build passed after correcting two integration defects: ordinary Markdown blockquotes rejected by an overly broad guard, and nested metadata losing inherited sharing images. Browser review also found and fixed credential filter/hash navigation and modal CSS overriding panel utilities.

| Check | Observed result |
| --- | --- |
| Frozen dependency installation | Passed with Node 22 and pnpm 11.1.2 |
| Lint / TypeScript | Passed with no errors or warnings |
| Tooling/content tests | 18 passed |
| Runtime/MDX/reading/analytics tests | 16 passed |
| Export | 96 HTML pages; CSP on 96/96; no verifier warnings |
| Public metadata/content checks | 92 professional pages, 181 valid JSON-LD blocks, 166 search records (75,229 bytes), no private-source markers |
| Routes / anchors / internal links | All eight cases present; retired portal page absent; internal references and unique IDs verified |
| Assets / CVs | Original raster hashes, derivative dimensions/ownership/coverage and both exact PDF hashes passed |
| Image repeatability | Two fresh generations produced identical manifests; warm run encoded zero transforms; changing a source refreshed its family |
| Knowledge independence | Passed: isolated 435-file source candidate, no Knowledge or environment files; frozen install, 34 tests, lint, build, artifact checks and post-build typecheck |

Normal browser checks cover desktop Home, mobile Work/About, both themes, responsive overflow, keyboard search order, nested Experience reveal and incompatible filter reset, Escape/focus restoration, mobile menu destination focus, case-study relationships, repeated gallery navigation, lightbox dismissal and contact required-field validation. Contact validation did not submit a message or book a meeting. The credential regression was rechecked: Courses -> search AZ-900 -> Enter reveals and focuses cert-4 with an appropriate filter.

Search revision mismatch recovery was exercised after rebuilding an open preview: the retry loaded the matching index. Default requests now revalidate the index once when opening a newly loaded application, while subsequent opens use its in-memory cache.

Raw CDP browser diagnostics were rejected because the browser permission was denied. No workaround was attempted. Network request counts, simulated browser media preferences, script-disabled browser execution and formal live Core Web Vitals are not claimed. Source/artifact checks establish server-rendered content and reduced-motion/print rules; normal UI tests and unit tests cover the permitted behaviour. No live deployment or external service delivery/retention audit was performed.

The isolated snapshot uses build-input SHA-256 `62413910365ea0d077cb2cb3c0ffff021f69800fcdf18af3812e1c26ad5684a9` on Node `v22.22.0` / pnpm `11.1.2`. Its full source manifest and command logs are preserved privately. The current application/build inputs match the verified candidate; documentation records the results afterward. Additional artifact acceptance verifies `Supportful Salesforce`, `Independent MOPO`, `MinervaHub portal`, both CVs, month precision and a matching revision without the global blog inventory.

## Knowledge delivery

Every original active Knowledge file was preserved by exact bytes and SHA-256 before editing. All three were updated. The active set now includes MasterFile, TODO, BlogInstructions, README, Sources, Update_Log and MediaGuide. The MasterFile contains 4,050 lines (335,900 bytes), retains all 21 legacy subject areas and a lossless labelled history annex, and adds detailed engagement, credential, event, article and CV registers with provenance and public/private limits. It is a substantive private reference rather than a short public profile.

The public media authoring guide was moved into ignored Knowledge. The original external career kit and canonical CVs were used read-only; their separately scoped reconciliation actions are recorded privately. Knowledge remains ignored and absent from the application/build ingestion path. Its local verification and manifests are separate from Git status and public release checks. Final closure passed 59 Knowledge verification checks; all seven active file hashes, all 269 original media files and the 17 external career-source fingerprints were checked. The original Master grew from 1,411 to 4,050 lines while preserving the exact original and a labelled lossless history annex. Current application/build inputs still match the isolated checked candidate after the pause/resume; only documentation and private Knowledge changed during closure.

## Parked items

These do not require invented public facts or block the implemented work:

- AskAI scope/dates, separate early-client dates, precise leadership appointment periods and exact diploma wording.
- Current issuer validation for Cloud Practitioner expiry and Claude issue/expiry; attributed current records are retained. Azure Fundamentals versus AI Fundamentals verification-link identities were checked against issuer pages.
- Additional measurement settings, adoption totals, telephone payments/refunds and sensitive/confidential metrics where evidence does not establish public claims.
- Peripheral historical model/pricing/market assertions beyond the targeted editorial fixes.
- Separate external career-kit follow-ups defined by the approved scope.
- Deployment, production route/MIME/cache and live post-deployment verification, explicitly deferred until the user requests publication.

The active private TODO and source/update ledgers retain the precise questions and verification statuses. Original records and CVs were not rewritten to manufacture agreement.

## Brief coverage

The following maps all 60 named items to the implemented local work. Existing customer-asset retention supersedes the brief's conflicting removal instructions. RECORD items include the complete repository Knowledge delivery and the separately recorded external-kit follow-ups, not a claim that the external kit was edited.

| Brief item | Implemented coverage |
| --- | --- |
| STR-01: Make consulting and delivery equally visible | profile, Experience and eight problem-led cases |
| STR-02: Show potential through established responsibilities | profile, Experience and eight problem-led cases |
| STR-03: Make the sources compatible without making them identical | profile, Experience and eight problem-led cases |
| IA-01: Organise professional evidence by purpose | navigation, Work index and relationship backlinks |
| IA-02: Keep consulting relationships visible at every depth | navigation, Work index and relationship backlinks |
| EXP-01: One consulting parent, not multiple independent jobs | server timeline, nested engagements, native disclosures and unique anchors |
| EXP-02: Preserve detail without making the page exhausting | server timeline, nested engagements, native disclosures and unique anchors |
| EXP-03: Do not duplicate the parent or its children | server timeline, nested engagements, native disclosures and unique anchors |
| EXP-04: Logos and organisation labels | server timeline, nested engagements, native disclosures and unique anchors |
| HOME-01: Make the primary identity immediately clear | stable hero, selected proof, derived latest experience and learning counts |
| HOME-02: Replace stale latest-role content | stable hero, selected proof, derived latest experience and learning counts |
| HOME-03: Lead with selected proof | stable hero, selected proof, derived latest experience and learning counts |
| HOME-04: Rebalance secondary cards | stable hero, selected proof, derived latest experience and learning counts |
| HOME-05: Align shared labels | stable hero, selected proof, derived latest experience and learning counts |
| ABOUT-01: Use the short current professional summary | concise introduction, revised journey, accurate education and languages |
| ABOUT-02: Correct the career journey without repeating Experience | concise introduction, revised journey, accurate education and languages |
| ABOUT-03: Replace ambiguous education shorthand | concise introduction, revised journey, accurate education and languages |
| ABOUT-04: Clarify experience and international labels | concise introduction, revised journey, accurate education and languages |
| ABOUT-05: Keep languages accurate | concise introduction, revised journey, accurate education and languages |
| WORK-01: Create a focused project index | eight static cases with stages, engagement periods and evidence links |
| WORK-02: Standardise the reader's questions | eight static cases with stages, engagement periods and evidence links |
| WORK-03: Keep case-study dates distinct from milestones | eight static cases with stages, engagement periods and evidence links |
| ROUTE-01: Reconcile existing project stories | legacy summaries, own canonicals, retired portal page and retained media |
| ROUTE-02: Do not create competing copies | legacy summaries, own canonicals, retired portal page and retained media |
| ROUTE-03: Handle the identifying legacy route differently | legacy summaries, own canonicals, retired portal page and retained media |
| PRIV-01: Anonymise the full content object | neutral new prose, scoped outcomes and approved original media retention |
| PRIV-02: Publish supported outcomes without private details | neutral new prose, scoped outcomes and approved original media retention |
| PRIV-03: Avoid unsupported compliance language | neutral new prose, scoped outcomes and approved original media retention |
| SKILL-01: Group skills by practical purpose | six evidence-linked capability groups on Work |
| SKILL-02: Connect important skills to evidence | six evidence-linked capability groups on Work |
| EDU-01: Make institutional relationships unambiguous | separate degrees and McGill exchange; milestone semantics |
| EDU-02: Preserve milestone meanings | separate degrees and McGill exchange; milestone semantics |
| CERT-01: Preserve the current inventory, improve classification | all 56 records classified as 9 certifications, 4 programmes, 40 courses and 3 badges |
| CERT-02: Give primary credentials prominence | all 56 records classified as 9 certifications, 4 programmes, 40 courses and 3 badges |
| CERT-03: Treat newer records correctly | all 56 records classified as 9 certifications, 4 programmes, 40 courses and 3 badges |
| CERT-04: Make counts derived and accurate | all 56 records classified as 9 certifications, 4 programmes, 40 courses and 3 badges |
| CERT-05: Correct course-title implications | all 56 records classified as 9 certifications, 4 programmes, 40 courses and 3 badges |
| EVENT-01: Keep event types distinct | 64 active records; role, precision and date-meaning distinctions; 65-record private baseline |
| EVENT-02: Separate date concepts | 64 active records; role, precision and date-meaning distinctions; 65-record private baseline |
| EVENT-03: Make judging and recognition specific | 64 active records; role, precision and date-meaning distinctions; 65-record private baseline |
| EVENT-04: Surface practical training outcomes | 64 active records; role, precision and date-meaning distinctions; 65-record private baseline |
| EVENT-05: Preserve attendance counts with their scope | 64 active records; role, precision and date-meaning distinctions; 65-record private baseline |
| EVENT-06: Isolate uncertain leadership dates | 64 active records; role, precision and date-meaning distinctions; 65-record private baseline |
| BLOG-01: Keep useful writing, strengthen practitioner evidence | 11 targeted editorial reconciliations with original publication dates retained |
| BLOG-02: Reconcile personal-product descriptions | 11 targeted editorial reconciliations with original publication dates retained |
| CV-01: Make current bilingual PDFs easy to find | exact English/French PDFs and shared download links; hash/render checks |
| CONTACT-01: Preserve the existing working contact identity | existing contact identity, native validation and accessible status feedback |
| SEARCH-01: Make delivery evidence searchable | lazy public projection, engagement/case/CV coverage and keyboard order |
| SEARCH-02: Rebuild derived public data | lazy public projection, engagement/case/CV coverage and keyboard order |
| META-01: Align identity across metadata | shared social metadata, actual PNG, safe schemas, generated text exports and sitemap |
| META-02: Reconcile all sharing surfaces | shared social metadata, actual PNG, safe schemas, generated text exports and sitemap |
| DATA-01: Inspect the actual repository first | typed relationships, deliberate sorting, small client islands and reusable interaction primitives |
| DATA-02: Model relationships rather than repeating facts | typed relationships, deliberate sorting, small client islands and reusable interaction primitives |
| DATA-03: Use shared factual sources | typed relationships, deliberate sorting, small client islands and reusable interaction primitives |
| DATA-04: Make sorting deliberate | typed relationships, deliberate sorting, small client islands and reusable interaction primitives |
| DATA-05: Preserve accessibility and responsive behaviour | typed relationships, deliberate sorting, small client islands and reusable interaction primitives |
| RECORD-01: Add a dated current public-profile record | private MasterFile, inventories, source register, preserved originals and execution ledger |
| RECORD-02: Update the current credential inventory | private MasterFile, inventories, source register, preserved originals and execution ledger |
| RECORD-03: Preserve what is intentionally private | private MasterFile, inventories, source register, preserved originals and execution ledger |
| RECORD-04: Save implementation history | private MasterFile, inventories, source register, preserved originals and execution ledger |
