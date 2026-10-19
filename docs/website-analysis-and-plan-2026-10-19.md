# Hadi Abou Daya website and Knowledge implementation plan

Date: 19 October 2026. Revision 3. Baseline: `main`, commit `fe66dd6`. Status at planning handoff: final planning deliverable; implementation had not started.

Implementation was subsequently authorised on 19 October. This file preserves the planning baseline; see [the implementation report](implementation-report-2026-10-19.md) for executed changes, verification and parked items. The user subsequently authorised final review and deployment on 19 October; the current release result is recorded in that report.

The website needs a substantial restructuring of professional evidence around a shared factual model, alongside a complete refresh of the private Knowledge folder. Make consulting relationships, personal contribution, delivery stage and useful outcomes clear publicly, while making the MasterFile comprehensive enough to support future authoring without losing the underlying detail. Preserve the globe and the established blue/cyan visual identity. Replace the fragmented career structure, improve how visitors find work, and reconcile the public profile with the source-backed private reference.

The supplied 2,129-line implementation brief is the content specification, amended by the user's latest instructions. Its ready-to-use public copy is the starting point for implementation. This plan adds repository-specific architecture, file ownership, migration decisions, failure cases and verification requirements. This delivery plans the work; it does not implement or deploy the website changes described below.

### Superseding Experience decision — 19 October 2026

The user subsequently rejected Selected Work and chose a cinematic Experience timeline with company panels, a connected career rail and nested consulting clients. The Work hub and eight detail routes are now retired; project evidence lives within Experience. See [the design rationale](experience-design-2026-10-19.md) and [the current implementation report](implementation-report-2026-10-19.md). Work-page requirements below are preserved planning history and are superseded by this later instruction. Customer-asset retention and the no-deployment boundary continue to apply.

### Latest user decisions

**Keep customer assets already on the website.** Existing customer logos, images and screenshots may remain, including their established asset paths and identity visible within those approved assets. Do not remove, rename, blur or regenerate an existing customer original merely to satisfy the brief's earlier asset-anonymisation rule. Record the current asset paths and hashes as the preservation baseline. This user instruction supersedes conflicting asset-removal requirements throughout the brief.

Continue using neutral customer descriptions in newly written case-study/profile prose as specified by the brief. Retaining an approved logo or its URL is an intentional exception to artifact-wide anonymity; do not claim the site is fully anonymous or make a global customer-name denylist a release gate. This permission covers existing assets, not new private CRM records, internal documents or additional unsupported customer disclosures. The earlier requirement to retire the old portal page remains a page-migration decision; its media files stay available.

**Rebuild weak implementations where justified.** The plan includes targeted replacements of state, rendering and content pipelines where source evidence shows a correctness, performance or maintenance problem. Preserve established behaviour and visual identity; do not retain a brittle implementation solely to minimise the diff. Conversely, do not migrate frameworks or introduce infrastructure without a demonstrated benefit.

**Update the entire `Knowledge/` folder and substantially expand `MasterFile.md`.** This is required implementation scope, not a read-only context review or optional cleanup. Maintain a complete private reference covering the supported life/career history, detailed engagements, projects, education, credentials, events, capabilities, preferences and website operations. The MasterFile must contain useful detail itself rather than becoming a thin index or a copy of the short public profile. Preserve dated originals, update every existing active Knowledge file and record sources/genuine gaps. Section 19 defines this workstream and its completion gates.

## 1. Scope and evidence

### Workspace coverage

An inventory made before the verification build covered **45,072 filesystem files**, including ignored and hidden files. Git tracked **394 files**. Counts are a baseline snapshot; generated directories change when builds run.

| Area | Baseline files | Approximate bytes | Review and planned treatment |
| --- | ---: | ---: | --- |
| `src/` | 90 | 425,911 | Review data, components, pages, hooks and shared utilities; change the affected paths listed below |
| `content/` | 11 | 154,393 | Review article inventory, personal-product consistency and dated claims; preserve useful writing |
| `public/` | 280 | 25,897,582 | Inventory assets and public text; inspect 267 media images through contact sheets, with targeted full-resolution review before reuse |
| `scripts/` | 3 | 6,406 | Review media generation, optimisation and build verification |
| `.github/` | 1 | 1,202 | Review actual GitHub Pages build and deployment workflow |
| `Knowledge/` | 3 | 95,955 | Full refresh required: expand MasterFile, update backlog/blog guidance, add maintenance/source records and preserve dated originals |
| `.claude/` | 2 | 6,174 | Read local design skill; inspect settings structure without reproducing permission command values |
| `.env.local` | 1 | 122 | Inspect key names only; two public PostHog configuration variables; do not print values |
| `.next/` | 1,559 | 485,613,202 | Generated framework output/cache; inspect relevant output boundaries and regenerate |
| `out/` | 1,880 | 66,970,781 | Inspect actual exported pages, payloads, sitemap, assets and sensitive-content presence |
| `node_modules/` | 38,496 | 532,010,426 | Inventory dependency files; inspect package/lock metadata and relevant installed SDK behaviour; do not pretend every dependency source file was manually audited |
| `.git/` | 2,735 | 116,123,446 | Check status, baseline commit and tracked/ignored boundaries; do not rewrite history |
| Root configuration | Remaining files | Various | Review package scripts, Next, TypeScript, ESLint, workspace, lockfile and domain configuration |

The raw local inventory is `/tmp/hadi-website-audit/full-file-inventory.json`. Contact sheets and their path index are in the same temporary directory. These are analysis artifacts, not website assets. Protected `.agents`, `.codex` and `.aws` mounts contained no ordinary inventoried files; they are not website content sources.

This is a comprehensive first-party website review with dependency and generated-output classification. It is not a line-by-line audit of all 38,496 installed dependency files, Git object contents, every frame of video/audio, or every detail inside reduced contact-sheet thumbnails.

### Sources and authority

1. Latest explicit user instructions and the supplied 19 October brief.
2. Maintained career-folder instructions, current profile, 18 October detailed engagements and direct confirmations.
3. Career timeline, credential/speaking register, claim questions and current approved bilingual CV artifacts.
4. Current first-party site implementation and observed live behaviour.
5. The pre-refresh ignored `Knowledge/MasterFile.md` and older source snapshots supply historical detail; the refreshed file will be the consolidated private reference with explicit source authority.

The current master calls itself a single source of truth but contains superseded dates, client descriptions, figures and upcoming-role language. Archive that version intact, then replace the active file with an explicitly dated, source-backed comprehensive revision. Do not let the old snapshot override newer confirmations, erase its original history or treat a generated summary as independent career evidence.

### Observed website and baseline checks

- Live desktop review: Home, Experience, About, Certifications and Events; search was opened and queried.
- Live mobile review: Experience at a requested audit breakpoint of 390 × 844 and its menu. The temporary viewport override was reset.
- Live MCP query: one Anthropic learning-announcement result, with no applied production case.
- Live Experience: stale Supportful dates, separate MOPO/freelance entries and no AWS/MinervaHub record.
- Live About: stale current-Supportful paragraph and ambiguous emlyon/McGill shorthand.
- Live credentials: 56 records, currently 15 labelled certifications and 41 courses.
- Existing event inventory: 65 mixed records. Neither this total nor the speaking-filter count is a count of delivered talks.
- `pnpm lint`: passed, zero errors and two existing warnings.
- `pnpm typecheck`: passed.
- `pnpm build`: passed, including responsive image generation and post-build verification.
- `pnpm check:build`: passed on the baseline export: 724 referenced image variants exist; CSP meta found on 88/88 HTML pages.
- Literal source-media reference check: 258 distinct references, no missing literal targets.
- No contact message was sent and no meeting was booked. External credential status, live form delivery, legal compliance and all article vendor claims were not established by these checks.

Lint warnings are the unused `content` binding in `src/app/blog/page.tsx` and platform-detection state set in an effect in `Navbar.tsx`. Fix them while touching those files; they are not production build failures.

## 2. Findings and priorities

| Priority | Finding | Evidence and implication | Required action |
| --- | --- | --- | --- |
| P1 | Professional editorial content needs reconciliation | Experience/event objects conflict with the brief's neutral public descriptions; existing customer assets are now approved | Update written records and case structure while preserving approved media and its paths |
| P1 | Output checks need an explicit public-content boundary | The earlier identity scan found 49 text-like files, but identities in approved asset paths are now permitted | Check unexpected private fields/documents and stale editorial records; do not reject approved assets or references |
| P0 | Professional chronology and relationship structure are outdated | AWS/MinervaHub missing; Supportful/MOPO dates stale; consulting fragmented | Canonical typed hierarchy with exact approved dates and stages |
| P1 | The private Knowledge reference is materially stale and incomplete | MasterFile still calls AWS upcoming, uses old consulting dates, has the older 52-record learning snapshot, contradictory blog counts and missing newer project scope | Complete Knowledge refresh with a detailed self-contained MasterFile, source reconciliation, preserved history and local delivery verification |
| P1 | Best evidence is difficult to find | No `/work/`; search MCP misses production work | Eight problem-led cases, navigation and ranked public search |
| P1 | Two responsive timeline trees duplicate anchors | Desktop and mobile render `TimelineCard` IDs simultaneously | One responsive semantic tree with stable engagement anchors |
| P1 | Machine-readable profile contradicts visible evidence | `worksFor` still Supportful; `llms-full.txt` says Present; McGill degree wording | Derive public projections from reconciled sources |
| P1 | Credential taxonomy overstates the collection | Binary type model; home says 56+ professional credentials | Four categories; preserve 56 distinct genuine records and derive exact counts |
| P1 | Event storage conflates historical date meanings | First-of-month dates rendered as exact days; all records emitted as one-day events | Date precision/meaning and appropriate structured data |
| P1 | No current bilingual CV downloads | No current PDF assets in public inventory | Exact approved bytes, stable URLs and shared descriptive links |
| P1 | Search interaction has structural accessibility and selection risks | Separate desktop/mobile inputs share refs; visual category grouping differs from raw ranked order | One dialog tree, accessible focus lifecycle and a shared rendered/keyboard result sequence |
| P1 | A responsive image family can display the wrong source | Different JPEG/WebP originals map to the same derivative filenames; the workshop's WebP reference currently receives square JPEG-derived output | Explicit source ownership, collision failure and decoded aspect-ratio checks; retain originals and URLs |
| P2 | Global/client content boundaries ship unnecessary collections | Every HTML page carries the blog-search prop; the archive imports full event detail before expansion | On-demand public search index, summary projection and server-rendered detail with small client islands |
| P2 | Interaction lifecycle has concrete correctness bugs | Carousel navigation does not settle; motion changes can remount children; hidden navbar effects remain installed | Replace those controllers and preserve element identity, cancellation and route boundaries |
| P2 | Article engagement events use incorrect geometry | The first three reading-depth markers are inserted before the sole prose child | One measured article-progress contract with active-time completion |
| P2 | Homepage identity waits for rotating text | Stable consultant positioning absent from initial role text | Fixed identity with useful proof and subordinate motion |
| P2 | Analytics statements exceed what initialization alone supports | Policy says no tracking cookies; installed SDK defaults use localStorage+cookie unless overridden | Verify actual effective configuration and align implementation/policy; no legal verdict inferred |
| P2 | Authoring guidance is in the public asset tree | `public/Media/IMAGE_GUIDE.md` is copied verbatim into `out/` | Move guidance outside public; correct obsolete instructions and enforce output boundaries |
| P2 | Static hosting limits migration options | `output: export`, GitHub Pages workflow | Distinct historical accounts for ordinary old routes; retire the old portal page while retaining its media |
| P2 | Build verification covers only narrow failure modes | It checks CSP exists somewhere, rather than requiring it on every HTML page | Strengthen artifact checks for content, relationships, links, canonicals and assets |
| P3 | Peripheral polish can distract from the brief | Broad visual effects, dormant expertise component, long opinion pieces | Improve restraint where it aids the profile; defer unrelated redesign and article expansion |

P0/P1 items belong in the first coherent release. P2 items tied to touched flows belong in the same release; deeper article research and optional visual polish can follow after the factual migration.

## 3. Recommended design and information architecture

### Design direction

Use the globe as the memorable visual. Keep the existing Geist typography, surface tokens, blue primary and cyan accent. Simplify the surrounding motion and competing emphasis. No framework migration, CMS replacement, invented brand, sector specialisation or global palette reset is needed.

Representative existing palette tokens:

| Role | Value |
| --- | --- |
| Light page | `#ffffff` |
| Light background sections | `#f4f6fb` |
| Dark page | `#0a0f1a` |
| Dark background sections | `#060a12` |
| Primary | `#2563eb` |
| Accent | `#06b6d4` |

Keep paragraph lines near 65–75 characters in case-study prose. Use left-aligned project content, clear date labels and stage text. Stage colour is supplementary. Reserve stronger treatment for selected proof, not every card and badge.

### Navigation and page jobs

| Destination | Job |
| --- | --- |
| `/` | Explain identity, show selected proof, offer contact and CV access |
| `/about/` | Short professional introduction, development interests and concise personal journey |
| `/experience/` | Employment/practice relationships and chronology |
| `/work/` | Selected professional cases, followed by distinctly labelled personal products if included |
| `/events/` | Speaking, training, community and genuine historical milestones |
| `/certifications/` | Classified certifications, programmes, courses and badges |
| `/blog/` | Existing articles and practitioner perspectives |
| `/contact/` | Employment/project/technical conversation routes |

Add Selected Work between Experience and Events in desktop navigation, mobile navigation, footer and relevant next-page suggestions. Preserve the logo home link. With seven main links plus search/theme controls, move desktop navigation to a wider breakpoint if intermediate widths become cramped. Do not solve that by shrinking labels and touch targets.

### Page composition

```text
Home
  Globe + name + fixed AI Consultant identity
  One sentence about needs, design and hands-on delivery
  View selected work | Get in touch
  CV in English | CV en français
  Three selected cases with stage and supported outcome
  Latest experience | Featured event | Latest article | Learning access

Experience
  Professional chronology
    AWS
    Independent AI Consulting
      Always visible practice overview and five dated engagement summaries
      Expand an engagement to show project detail and case links
    Savencia and earlier roles
  Education in a separate semantic section of the same responsive tree

Selected Work
  Short purpose statement
  Eight professional case links
  Optional separately labelled personal products

Case study
  Title + relationship + engagement period + stage
  Need | Contribution | Approach | Supported outcome | Technologies
  Back to engagement | Selected related case | Contact
```

The significant visual change is the Experience layout. A tall consulting parent does not fit the existing start-year dual-lane calendar reliably. Use a readable professional list with nested engagements and a compact education section, using responsive layout rather than duplicate DOM trees. Retain All, Professional and Education filters: All shows both semantic sections, Professional shows the complete professional hierarchy, and Education shows education only. An incoming professional fragment resets an incompatible filter to All before revealing its target. Do not add a year-filter feature simply because the brief discusses it conditionally.

## 4. Canonical content model

### Concrete decisions

- Keep TypeScript content, which already suits this small static site. Add explicit public types and pure selectors rather than introducing a database or CMS.
- Separate top-level professional entries, education and consulting engagements. Relationships use stable IDs, not duplicated strings or array order.
- Use `YYYY-MM` for career precision and validated ISO dates for genuinely exact events. Derive display periods from structured values.
- Keep presentation copy distinct by surface when brevity requires it; derive titles, dates, organisation labels, relationship links and stages from shared factual records.
- No private provenance fields in imported public objects. A field called `private` inside a bundled object is still exposed.
- Keep internal source references, disputed detail and retired page references outside runtime content. Public projections are explicitly allowlisted; references to approved existing customer media are permitted.
- Derive home latest experience with a deliberate selector rather than `experiences[0]`.
- Sort top-level professional entries and consulting engagements by descending end month, then start month and stable ID. Education may use its own clearly specified order.
- A work case points to an engagement or standalone experience. Dates are labelled engagement period if exact project dates are unknown.
- Support multi-workstream stage information. TowardsChange must never receive one blanket production badge.

### Proposed module boundaries

| Module | Responsibility |
| --- | --- |
| `src/data/experience.ts` | Public standalone roles, consulting parent and engagement records |
| `src/data/work.ts` | Eight public case-study bodies, stage information and relationships |
| `src/data/about.ts` | Short editorial introduction, journey, language facts and evidence-linked skills |
| `src/data/certifications.ts` | Genuine credential inventory and classification |
| `src/data/events.ts` | Distinct milestones/events with precision and date meaning |
| `src/data/profile.ts` | Proposed shared professional identity, location and approved CV public URLs |
| `src/lib/career.ts` | Proposed period formatting, sorting, relationship lookup and latest-experience selectors |
| `src/lib/public-content.ts` | Proposed explicit public projections for search and text exports |
| `src/types/index.ts` | Discriminated content types and relationships; split into small type files only if it materially improves readability |

Use separate collections or discriminated unions to make a consulting child impossible to render accidentally as a top-level job. Do not retain multiple independent representations of the same practice. A subgroup can carry dates while its client children intentionally do not.

### Essential invariants

1. Exactly one top-level independent AI consulting practice.
2. Exactly five engagement groups within it, with three undated individual early-client children in their shared subgroup.
3. Supportful has three anonymous project contexts.
4. AWS and Savencia remain standalone; WordPress is a separate 2020 period.
5. All relationship IDs, work routes and engagement anchors resolve.
6. No child engagement appears again as a top-level job.
7. Date ranges are valid and month precision is not inflated to exact days.
8. No runtime record contains new unapproved customer disclosures, internal evidence paths or internal employment details. Approved existing customer media and its paths are permitted.
9. No total sums overlapping practice and engagement durations.
10. Publication/modification timestamps remain distinct from professional periods.

## 5. Experience and factual migration

### Top-level professional entries

| Entry | Approved public period | Required treatment |
| --- | --- | --- |
| AWS | Jul 2026–Oct 2026 | Delivery Consultant AI/ML, ProServe; customer pilot leads |
| Independent AI Consulting | Aug 2023–Jul 2026 | Self-employed/Freelance; one parent |
| Savencia | Jul 2025–Dec 2025 | Data Scientist Intern; analysis and recommendations |
| Mobile Arts | Jun 2022–Aug 2023 | Client requirements, production ML and qualitative commercial purpose |
| Decentra Tech | May 2021–May 2022 | Edge CV; narrow Nano model benchmark |
| Vee Smart | Feb 2021–Apr 2021 | Machine Learning Engineer Intern; preserve code link |
| USJ / Kefraya-AI | Jan 2021–Feb 2021 | University project; supported satellite-imagery wording |
| Eddy's Group | Sep 2020–Dec 2020 | Laravel Developer Intern; remove first-software-role claim |
| Freelance WordPress Development | Jun 2020–Oct 2020 | Separate earlier freelance web work |
| Fomaco | Jun 2019–Aug 2019 | Assistant Technician Intern; no AI/software-duration implication |

AWS public wording and end month are explicit choices. Do not infer a current employer, use Present, disclose the departure explanation or describe a future day in October as an already completed event.

### Consulting hierarchy

| Engagement | Period | Contribution and stage |
| --- | --- | --- |
| Supportful | Dec 2025–Jul 2026 | Production sales integration, anonymous portal collaboration, sports production systems |
| MOPO | Aug 2023–Dec 2025 | Project leadership from concept through production launch |
| MinervaHub | Apr 2025–Jun 2025 | Needs-led employee-portal blueprint and roadmap |
| TowardsChange | Sep 2024–Nov 2024 | Separate on-premise selected-user pilot and FridayGPT cloud contributions |
| Additional AI consulting | Sep 2023–Aug 2024 | Shared period for AI.skilled, ShebangNow and Traveln.ai |

Each engagement heading, dates and short contribution summary remain visible. Use one disclosure per engagement, with plain project headings inside; avoid nested stacks of accordions. Prefer native `details`/`summary` for server-readable content, or an equally accessible control if the final design requires it. Deep links must open an enclosing disclosure after hydration and place the target below the fixed header. The summary itself should be useful before JavaScript runs.

### Claim corrections that must survive every projection

- Salesforce is a CRM. Python/FastMCP exposes actions within the requesting user's existing permissions. Agent execution/state/memory/recovery/evaluation/approval work belongs to the agent harness, not automatically to the MCP server.
- Portal demonstrations contributed to signed contracts collaboratively. No invented value, contract count or sole closing credit.
- Sports web/WhatsApp agents cover payments and refunds. Telephone booking is established; telephone payments/refunds are not.
- AWS is a customer pilot reflecting sovereignty and security requirements, not a formal compliance certification or production rollout.
- MOPO project leadership does not mean CTO/founder, sole authorship or formal line management. Replace secured-funding language with contribution to pitching/fundraising preparation.
- MinervaHub is advisory work. Do not describe a deployed portal or claim budget approval/adoption. Keep education separate from public client identity.
- TowardsChange needs two visibly separate architecture descriptions and outcomes.
- AI.skilled: guided three engineers; do not assert formal people management. Traveln.ai: planning/search, without completed-booking claims. Do not invent stages for early client applications.
- Savencia produced causal analysis and recommendations. An optimisation objective is not an achieved yield increase or approved budget.
- Decentra: 60 FPS applies to the optimised model on Jetson Nano. Do not extend it to a combined ADAS pipeline or introduce benchmark settings.
- MOPO metrics are confidential. Do not newly publish the Mobile Arts numeric result under this handoff; its evidence was not classified as confidential. No AskAI entry without established scope/dates/stage.

### Education and background

Use emlyon Data Science & AI Strategy, Sep 2024–Jan 2026; McGill exchange semester, Apr–Jul 2025; USJ-ESIB software engineering, Sep 2018–May 2023. ZAKA is professional training, Aug–Nov 2022. Use established programme wording pending exact diploma evidence rather than inventing an equivalence or joint degree.

Keep Arabic Native, French Fluent, English Fluent. Use software development since 2020 and AI/ML work since 2021. Separate lived/studied locations, remote client geographies and professional travel. Do not infer a country visit or its absence from a remote client relationship.

## 6. Selected Work implementation

Create `src/app/work/page.tsx`, `src/app/work/[slug]/page.tsx` and reusable work components. Generate static params for published cases. Unknown cases use `notFound()`. Keep the index and prose server rendered; use client code only for actual interactions.

| Route | Parent link | Stage and supported outcome |
| --- | --- | --- |
| `/work/salesforce-agent-mcp/` | Supportful | Production; several authorised CRM actions in one conversation, less manual updating |
| `/work/aws-agentic-platform-pilot/` | AWS | Customer pilot; company knowledge, enterprise actions and workflows |
| `/work/mopo-conversational-ai/` | MOPO | Concept through production launch; collaborative project leadership |
| `/work/minervahub-portal-advisory/` | MinervaHub | Advisory; blueprint and roadmap informed next-phase prioritisation |
| `/work/towardschange-enterprise-knowledge/` | TowardsChange | Two workstreams with their own stages and architectures |
| `/work/client-engagement-portal/` | Supportful | Delivered portal and prospective-client demos contributing to contracts |
| `/work/sports-booking-agents/` | Supportful | Production web/WhatsApp, telephone booking and analytics |
| `/work/savencia-causal-inference/` | Savencia | Analysis and recommendations for industrial decisions |

These eight routes match brief §11 and are the settled initial route set. Each case answers need, personal contribution, approach, delivery stage, supported outcome and technologies. Use the brief's supplied copy, tightening repetition without changing claim strength.

Index cards show title, relationship, stage and a short useful outcome. Avoid a large filter system for eight cases. Add filters only if they solve a real scan problem; any filters must keep the distinction between stage and type clear.

Supportful cases use neutral customer contexts in newly written prose, metadata, breadcrumbs, related cards and search descriptions. Approved existing customer media can retain its branding, filenames and asset URLs; do not require edits to its pixels. New alt text must truthfully describe what the image communicates, without promising anonymity that the retained image does not provide. Do not create a second sports case under an older project name. Cases link back to the relevant engagement, not simply the top of Experience.

Where imagery is unavailable, use typography and a factual decision diagram rather than invented screenshots. AWS diagrams must stay generic and public-safe. TowardsChange diagrams require two panels; do not merge on-premise Mistral with Azure retrieval into a fictional combined deployment. Do not copy private implementation diagrams from the career kit.

Personal products may follow professional work as a separate group. Bobine, CopyAlpha and research prototypes retain their classifications. The first release does not require new personal-project pages or new blog articles.

## 7. Home About shared identity and CVs

### Homepage

Implement the supplied fixed AI Consultant heading and needs-to-delivery sentence. Keep Paris visible. Primary action: View selected work. Secondary: Get in touch. English/French CV links sit nearby with quieter treatment. Retain the latest-post link below the professional actions if it fits.

The role must exist in static HTML and be readable immediately. If animated role text remains, treat it as supplementary and avoid repeated screen-reader announcements. Do not make name/essential copy invisible until motion executes. Replace `h-screen` with a tested content-safe minimum height if extra copy/actions clip on short mobile or landscape screens.

Add Salesforce/MCP, MOPO and AWS pilot proof cards. MinervaHub may be fourth if it improves consulting emphasis without crowding the page. Follow with latest AWS experience, event, article and accurately labelled learning access. Do not let a mixed credential counter carry the professional story.

### About and expertise

Use the two short introduction paragraphs in brief §9. Keep current development interests distinct from demonstrated expertise. Update the professional journey without reproducing all Experience bullets. Preserve specific personal background; remove the Supportful-as-today ending and generic padding. No feedback quotes, invented motivation or imposed industry specialisation.

`HOMEPAGE_EXPERTISE` and `HomeExpertise.tsx` currently exist but are not mounted on Home. Replace the obsolete data with a compact evidence-linked capabilities collection, rendered after the professional cases on the Work index. Remove the unused HomeExpertise component after checking references; do not restore an old long service inventory on Home or expand About into one.

Group capabilities by purpose: enterprise agents/integration, reliability, knowledge systems, cloud/delivery, applied ML/data and consulting. Link the most important groups to actual cases. Do not infer professional Playwright/CI regression experience from the website's own future verification tooling.

### Shared profile surfaces

Align footer, blog author card, manifest description, Person/WebSite JSON-LD, root metadata, Open Graph image text/alt and both AI-readable text files. Suggested visible footer identity: AI Consultant / Software Engineer / Paris, France. Keep existing intended contact destinations.

### Exact CV asset plan

Copy current approved files unchanged into `public/cv/`:

| Public URL | Baseline bytes | SHA-256 |
| --- | ---: | --- |
| `/cv/HadiAbouDayaCV.pdf` | 200,755 | `86a0c686f3704baf9f539207de7b64c88e708e65d81e768c1e6bfe584caee021` |
| `/cv/HadiAbouDayaCV-fr.pdf` | 185,700 | `f34bd1369215c4a7c2c451c95084e36cb682c082a03147eefdbeb75a380772e2` |

Both local sources parsed as one-page PDFs and matched the 18 October artifact manifest in the evidence audit. Recheck hashes immediately before copying in case approved sources change. Centralise URLs; label links CV in English and CV en français on Home, About and Contact, with footer access if useful.

Validate exported hash equality, HTTP content type, successful opening and download behaviour. Never regenerate PDFs, publish DOCX/source documents, restore removed English availability text, or copy administrative details into website prose. Approved PDF content remains the user's chosen document content.

### Contact

Use the inclusive role/project/technical-conversation introduction. Keep email, LinkedIn, GitHub, Calendly and the current profile-matching phone number. Add `autocomplete` where appropriate, meaningful sending/error announcements and a direct-email fallback. Do not transmit name, email or message bodies into analytics.

Keep entered values after errors, allow vertical textarea resizing and make the direct-email fallback clickable. When success replaces the form, announce it and move focus deliberately to the success heading. Test native validation without sending, then verify sending/success/error states through controlled local mocked responses; never send a real smoke-test inquiry or create a booking.

## 8. Route and archive policy

### Hosting decision

The project uses Next.js static export and deploys the `out` artifact through GitHub Pages. Next.js server redirects, rewrites, custom response headers and middleware are not available in that deployment mode. See the [official static-export documentation](https://nextjs.org/docs/app/guides/static-exports).

Default to a distinct short historical account at ordinary existing event URLs. Give it its own truthful copy and a clear link to the canonical full work case. Verify each retained date's meaning before calling it a start, launch or completion milestone. Where the date is an indexing value, use supported month-level historical context without attaching later capabilities to that day. This retains inbound links without duplicating full case-study copy or requiring infrastructure changes. A self-canonical historical account is valid when it is genuinely distinct; do not blindly canonicalise every historical page to a different page.

If a real hosting-layer permanent redirect is later selected, verify that layer first, then test HTTP status and destination. A client navigation or meta refresh must not be reported as an HTTP 301. Do not introduce a new hosting provider for this content update.

### Migration decisions

| Existing route or class | Action |
| --- | --- |
| `/events/mopo-multi-llm/` | Short distinct historical account with verified date meaning, otherwise month-level context; link to MOPO case and remove funding overclaim |
| `/events/causal-inference-savencia/` | Short distinct historical account with verified date meaning, otherwise month-level context; link to causal-analysis case without an unsupported start claim |
| `/events/decentra-tech-edge-ai/` | Keep earlier story, correct model/Nano FPS scope; avoid implying all later capabilities existed on start date |
| Old portal event page | Retire page generation and internal references as specified by the brief; the host returns 404 for that page. Preserve all approved media files from its asset directory and reuse them where useful |
| `/events/freelance-ai-launch/` | Keep Aug 2023 launch event; link to consulting practice, without backdating all later clients |
| `/events/vee-smart-nlp/` | Keep with internship classification and code link |
| `/events/kefraya-ai-vine-detection/` | Keep as university work, supported imagery and modest result description |
| `/events/bobine-ai-video-generator/` | Keep as personal product with dated component-cost qualification |
| `/events/copyalpha-launch/` | Keep as personal product; no adoption/revenue/return implication |
| `/events/medical-ai-research/` | Keep collaboration/prototype classification |
| `/events/mobile-arts-ml/` | Keep team-trip meaning; do not replace it with a technical delivery case |
| `/events/eddys-group-backend/` | Keep corrected internship, remove first-software-job claim |
| `/events/freelance-wordpress/` | Keep separate 2020 period |
| `/events/fomaco-technician/` | Keep technician internship classification |

Locate the retired portal page in brief §12 during implementation. Its page-route assertion must not include its asset directory: a retired event page can return 404 while its approved media URLs continue returning 200. Keep route-migration records separate from media-preservation records.

Count surviving distinct event records only. A historical milestone and its case can both exist for different purposes, but search should not return two full versions of the same case. Remove pure duplicate project records or reduce them to real milestones consistently. Update related-card selection after migration.

## 9. Public content and media boundaries

The accepted publication boundary now distinguishes approved existing media from newly written public records. Keep existing customer assets and their established URLs. Audit new prose, organisation fields, outbound links, metadata, JSON-LD, search and AI-readable exports for factual accuracy and appropriate disclosure. Asset identities and their required references are permitted and must not fail output checks.

`public/Media/IMAGE_GUIDE.md` is authoring guidance, not a customer media asset. Next copies it into the deployment artifact even though no page links to it. Move/rewrite it as `Knowledge/MediaGuide.md` outside the served asset tree and correct stale `.png` assumptions and obsolete resume-path suggestions. This cleanup is about keeping authoring instructions out of production; it does not justify removing approved customer images.

Preserve customer-logo and screenshot originals byte-for-byte by default, including their existing filenames. Keep a baseline path/hash manifest and verify those sources survive the migration. Responsive derivatives may be regenerated deterministically, while established public derivative URLs remain valid. Inspect images at full resolution for composition and accessible descriptions; do not turn that inspection into a new asset-approval process. If a newly discovered issue falls outside customer branding, such as credentials or private records, isolate that concrete finding instead of removing the entire collection. The 267-image contact-sheet review remains a triage record, not a complete pixel audit.

The source has no missing literal media references at baseline. Preserve that property. Correct descriptive asset-directory mismatches only when they cause confusion or exposure; a YOLO workshop image currently lives beneath an Azure-credential directory and needs visual suitability review, not an automatic broken-image verdict.

Keep the manual `optimize-media.mjs` recompressor out of routine builds. It overwrites originals and is unrelated to factual content migration. Preserve original formats and visual quality unless a measured issue requires optimisation. The existing variant pipeline is appropriate for static export.

For edited source images, avoid relying on `existsSync` alone to skip variants if old variants can survive locally. Clean output first or make freshness/content hashing explicit. Check all originals and generated variants in the final artifact.

Do not place the brief, career kit, private notes, environment values, source-document paths or this audit's raw inventory under `public/`. Git ignore is not a publication boundary for files copied into `public/`. Conversely, deleting a public deployment asset does not erase Git history or third-party caches; do not promise that.

## 10. Credentials events and editorial consistency

### Credential taxonomy

Preserve all 56 genuine records. Proposed categories are professional certifications, programmes/specialisations, courses and enablement/accreditation badges. Keep issuer/topic filters separate from completion type.

A provisional mapping from current records is 9 professional certifications, 4 programmes/specialisations, 40 courses and 3 enablement badges. Validate the complete per-record mapping against completion evidence before fixing displayed totals. Do not publish these provisional subtotals as issuer-verified facts.

Feature Claude Architect, the established AWS exam credentials, PMP and Azure fundamentals appropriately. Keep the four Anthropic courses distinct from Claude Architect. Cisco introductory courses are not full CCNA credentials. ZAKA and Coursera specialisations remain programme completions according to their evidence. Preserve individual courses that are genuinely distinct completions.

Derive exact counts, remove the unnecessary plus sign and update type badges, filters, home copy, metadata and credential JSON-LD together. Only appropriate records become professional credential schema entries; do not describe internal enablement badges as professional exams.

Preserve current attributed Claude Sep 2026/Sep 2027 fields. Verify Cloud Practitioner renewal evidence if reachable; do not revert Jul 2029 expiry to older notes. Prefer a public credential URL over an earner-facing one when an existing known public equivalent is available. Do not claim all links were issuer-validated merely because they are present.

### Event date and role model

Add explicit date precision and meaning: exact event day, month, programme period, start milestone, completion, announcement or publication. If a first-of-month value only supports sorting, do not print its day as a verified occurrence. Add start/end dates for multi-session events only where evidence supports them.

Reconcile at least PMP award/announcement, combined AWS credential announcement, ZAKA start/completion/featured graduate, Cisco date difference, Deep Learning completion/announcement, Google/Stanford distinct completions, McGill exchange start and emlyon programme start/end.

An archive entry is not automatically a one-day Schema.org Event. Use suitable creative-work/educational/event representation or omit optional schema if precision is inadequate. For real online events, use the correct attendance mode. Do not emit a programme start as a graduation day.

Distinguish speaker, trainer, mentor, organiser, judge, attendee and promotional spotlight. Rename the existing broad speaking/workshop filter to **Speaking, Training & Mentoring**, keep role indicators visible and move purely promotional spotlights into Conferences & Community. This filter counts archive records, not delivered talks or unique people. Keep organising/judging records in the category matching their actual role. Do not count the speaker spotlight and advertised talk as two talks.

Show specific training outcomes: practical tasks completed and further-training requests where confirmed. Keep counts event-scoped: sessions, people and conference-wide attendance are different units. Preserve team credit for hackathon wins and the precise EPITECH/Vueling jury context, without implying a conference-wide jury appointment. State **Speaker at the 2026 AWS re:Invent 2025 re:Cap community event**, without implying flagship-conference speaking. If the optional OpenAI bootcamp recognition is retained, use team attribution, second out of nine, and no invented event date. Startup Weekend's competition funding pool is not money raised or won by Hadi. Avoid an aggregate reach figure built from overlapping events.

### Blog editorial worklist

Full-text review of all 11 MDX articles found concrete editorial inconsistencies beyond the brief's personal-product notes. Correct internal contradictions and public-identity risks in the factual release; keep broad research into vendor/model claims as a separately bounded editorial follow-up. Do not rewrite dated articles as if later knowledge existed when they were published.

| Article file | Concrete review or change |
| --- | --- |
| `three-strategic-shifts-single-day-ai.mdx` | Explain how four events form three shifts, or align title/body count. Correct Wednesday/Thursday mismatch for 2 April 2026. A claim attributed to Financial Times currently links to TechCrunch: supply the primary source or identify secondary attribution |
| `anthropic-claude-mythos-system-card-analysis.mdx` | Reconcile the 16-year vulnerability age with its stated 2003 origin in a 2026 article. Add the primary report and credited secondary-video links. Neutralise an additional named organisation in a first-person agent-building claim unless public relationship/disclosure is established |
| `arc-agi-3-benchmark-broke-every-frontier-model.mdx` | Carry the body's selected-human-baseline qualification into the unqualified humans-100% lead/excerpt/search snippet. Verify exact benchmark/version claims against its primary source before changing figures |
| `deepseek-engram-llm-memory.mdx` | Reconcile parameter-allocation units in the body with compute/memory-allocation wording in takeaways; link exact experimental claims to the paper |
| `aws-lambda-vs-inngest.mdx` | Add primary documentation/release references for precise capabilities, figures and attributed comparisons. Retain dated framing; no unsupported current-pricing update |
| `meta-vl-jepa-analysis.mdx` | Link the named primary paper and distinguish its findings from editorial predictions |
| `tesla-ai-day.mdx` | Link the presentation recommended by the article; preserve 2021 context and distinguish announcements from demonstrated capabilities |
| `copyalpha-crypto-copy-trading-platform.mdx` | Reconcile duplicate-detection claims with the numbered validation chain and later position sizing. Remove unsupported universal guarantees or profit-locking implications. Subscription implementation is distinct from paid adoption |
| `ai-marketing-stack-2026.mdx` | Preserve practitioner workflow focus. Source concrete vendor/model/pricing changes before revision; do not convert personal recommendations or tool-use anecdotes into independently verified career evidence |
| `sk-hynix-hbm-ai-memory-crisis.mdx` | Keep historical/company/market assertions tied to dated sources; flag unsupported precise claims for targeted primary-source review |
| `critical-thinking-and-llms.mdx` | Preserve opinion framing. Do not turn personal experience or observations into established empirical/career claims |

The additional named organisation requires factual review of the first-person work claim. The new approval for existing media does not independently establish an article's relationship/contribution claim. Review that prose on its evidence; do not remove an approved customer image as a substitute. Global customer-name scanning is no longer an anonymity gate.

Personal testimony about trading losses, time spent researching, team failures and tool use remains authored testimony. It cannot be imported into professional cases, outcome claims or profile summaries as independent evidence without corroboration. Source-link repairs do not themselves prove an article's interpretation or every underlying number.

## 11. Search and interaction architecture

### Public search projection

Index case-study title, neutral client context, problem, contribution summary, technologies, stage and outcome. Include consulting child engagements with truthful parent context. Existing search omits Experience bullets, so adding a technology only to a bullet will not fix discoverability.

Add a work result category and prioritise exact applied-case matches over tangential learning announcements for the same query. Use title/phrase relevance and an explicit case boost, not universal suppression of useful learning results. Keep all hrefs normalised and resolvable, including correct slash-before-fragment form.

Cache/build the index from public projections rather than rebuilding every content field unnecessarily on each keystroke. For this dataset a small local index is sufficient; no hosted search service is needed. Build-time validation must forbid private provenance from entering the client payload.

| Query | Required leading relevant evidence |
| --- | --- |
| MCP, FastMCP, Salesforce | Production Salesforce/MCP case |
| AWS, AgentCore, A2A | AWS pilot and accurate related experience |
| MinervaHub | Advisory case or engagement |
| MOPO | Concept-to-production case and consulting relationship |
| TowardsChange, Mistral | Engagement/case with separate stages |
| Causal inference | Savencia analysis |
| Consulting | Practice and advisory/delivery evidence |
| CV, resume, English CV, French CV | Download access or clearly labelled page route leading to the current files |

Current synonym mapping interprets `cv` only as computer vision. Retain technical discoverability while supporting visitor resume intent, preferably through explicit download/page search entries and phrase matches rather than replacing the abbreviation globally.

### Interaction corrections

1. Render one responsive search dialog and input rather than hidden desktop/mobile copies sharing the same refs.
2. Provide a dialog name, modal semantics, labelled search input and labelled close button.
3. Put focus in the visible input, contain Tab while open, close with Escape/backdrop as appropriate, restore focus to the trigger and prevent background interaction/scroll.
4. Use one flattened **rendered order** for visual highlight, ArrowUp/Down, Enter and tracking positions. Current grouped rendering can diverge from the raw relevance array used by Enter.
5. If using listbox semantics, implement the full combobox/listbox relationship and active descendant; otherwise use ordinary accessible link/button navigation consistently.
6. Deep-link navigation must reveal the engagement if necessary, reset an incompatible filter to All and focus/scroll the correct unique target. Preserve existing non-sensitive `#exp-*` inbound fragments: keep the original ID on retained entries; for restructured entries, add one unique compatibility anchor adjacent to the canonical target. In particular, preserve `#exp-supportful`, `#exp-mopo` and `#exp-freelance-ai-consultant` by mapping them to their engagement or practice. Do not retain the old separate job cards. Avoid polling for duplicated or hidden IDs.
7. Respect reduced motion for programmatic scrolling as well as CSS transitions.
8. Announce results/empty states without announcing every visual highlight or all duplicate hidden trees.

Apply the same focus lifecycle to the mobile navigation and image lightbox. Preserve the existing filter pills' useful roving keyboard behaviour. Contact feedback needs status/error announcements rather than purely visual icon changes.

Implement one small client Modal primitive around native `<dialog>` for search, mobile drawer and lightbox. Its contract is open state, accessible label, initial focus, close request/reason and rendered children; layout-specific content stays in the caller. Use modal opening for background isolation, keep Escape/backdrop handling explicit, and let the persistent controller coordinate any exit animation before closing. On route navigation, focus the destination rather than restoring a detached opener; ordinary dismissal restores the trigger. Reduced motion closes without animation delay. Validate the native focus/scroll behaviour in the supported browsers and keep this primitive independent of event/search data. This replaces three bespoke modal lifecycles without adding a UI framework.

### Reading width contrast and interaction details

The mobile timeline currently keeps long prose indented beside a logo. At 390 px, the rail, logo, gap and padding leave an unnecessarily narrow reading column. Put the logo/title/date in a compact header, then let descriptions, bullets, engagement sections and case links use the card's available width. Do not accumulate indentation with every consulting/project level. Include a 320 px check for long titles.

Meaningful secondary text needs stronger tokens. Source-token calculations put light `text-fg-lo` on white near 2.56:1, and the dark muted token on the base surface near 4.03:1. Those pairs are below 4.5:1 for normal text. Measure actual composited raised/transparent surfaces before choosing revised tokens. Increase essential 10–11 px search metadata and verify focus-ring visibility. Low contrast can remain for decoration, not dates or needed context.

Event cards currently combine a large button-like wrapper with an inner navigation link. Separate the title link and a native expansion button, keeping interactive elements as siblings. Expose expanded state and its controlled content. Inspect dense-grid packing so visual order does not conflict with reading/focus order. Make carousel/lightbox controls visible on focus and touch, not only hover. Evaluate spoken video for captions/transcripts where appropriate; no assumption was made about its audio.

Mobile-menu opener needs expanded/control state and current-route semantics. Move focus into the menu on open, close with Escape and restore the trigger; the live mobile audit observed focus remaining on the opener and Escape not closing it. Ensure the drawer scrolls on short viewports. Lightbox already has Escape/arrows/scroll locking; complete its dialog naming, focus containment/return and image-count announcements rather than replacing working behaviour wholesale.

Correct collection headings that jump from the page heading directly to card `h3` elements. Use heading levels to express actual sections and consulting relationships. Keep the existing filter pills' keyboard handling and adapt new completion-type filters to it.

The globe already defers animation, pauses offscreen and renders a static reduced-motion frame. Preserve those strengths. Add preference-change handling and static redraw on resize, and keep essential actions visible while keyboard-focused despite scroll-driven hero fading. Professional copy must remain readable without animation/hydration; print must include expanded engagement detail and no hidden duplicate trees. A small pause control is optional if it improves motion accessibility without competing with the visual.

## 12. Metadata text exports and publishing

### Metadata

Use the brief's homepage title/description. For full page title strings, use `title.absolute` where needed because the root already adds `| Hadi Abou Daya`. Do not accidentally produce the name twice. Keep case titles, canonicals, Open Graph URL/title/description/image alt, Twitter cards and breadcrumbs consistent.

Remove the stale current `worksFor: Supportful` from Person JSON-LD. Do not replace it with inferred current AWS employment or flatten every consulting child into a current employer. Prefer a simple accurate profile. Explain McGill as an exchange in public descriptions and education presentation.

Default sharing currently has both a generated `opengraph-image.tsx` and an explicit static `og-default.jpg`. The live extensionless generated image returns HTTP 200 with `Content-Type: application/octet-stream`; its exported generator's `contentType` declaration does not set GitHub Pages response headers. Use a real **`/og-default.png`** exported asset as the single site-default sharing image.

Keep the image renderer as an explicit static GET route at `src/app/og-default.png/route.ts` with `dynamic = "force-static"`, move the current ImageResponse rendering implementation there, update its visible professional title, and remove the automatic `src/app/opengraph-image.tsx` convention so it cannot override explicit metadata. Validate that `next build` emits a real `out/og-default.png` file, not an extensionless response or HTML directory. This uses the existing build pipeline without a separate asset-copy step. The normal metadata uses the `.png` asset URL explicitly for Open Graph and Twitter, with shared dimensions and alt text. Case-specific approved images may override it. Reconcile JSON-LD and article fallback URLs; remove the old JPG only after checking remaining uses.

The `.png` URL permits the static host to infer an image MIME type without a hosting migration. Require live HTTP 200, `Content-Type: image/png`, 1200 × 630 dimensions and successful decoding after deployment. Event pages currently inherit the homepage `og:url`; add route-specific event URLs and require emitted event/work sharing URLs to match their canonical page.

Add `/work/` and published case routes to sitemap. Remove retired routes and use truthful content-modification dates rather than repurposing role dates or stamping every page on each build. Update current hard-coded hub dates during the real content change.

### AI-readable profile files

`public/llms.txt` and `public/llms-full.txt` are separate stale public profile sources today. They contain degree shorthand and outdated chronology; the full file also says Supportful Present. Replace those public source files with static GET route handlers at `src/app/llms.txt/route.ts` and `src/app/llms-full.txt/route.ts`, each using `dynamic = "force-static"` and the shared approved public projection. Next generates their text during `next build`, before the existing image-generation and artifact-verification steps. Removing the old public files avoids duplicate-path conflicts or overwrites. Include Selected Work and current bilingual CV URLs. Validate the generated files' content type, hierarchy, dates and absence of private fields. Do not export the private evidence bank.

No RSS/feed implementation was located. Updating feeds means updating one only if it is found or deliberately introduced, not adding a new dependency to satisfy a conditional list in the brief. The manifest description does exist and needs identity alignment.

### Analytics and privacy accuracy

The installed PostHog source defaults include `autocapture: true`, `persistence: localStorage+cookie` and session-recording capability enabled unless overridden. Root initialization supplies key, host and defaults date, without explicit persistence/capture overrides. That alone does not establish the effective dashboard configuration or that recordings are occurring.

The integration owner should inspect effective capture settings, storage/cookies and representative outbound payloads on a professional route, search and client navigation into/out of the personal route. For professional custom events, retain aggregate navigation/result-count metrics and remove raw search-query text and contact-message values. Exclude `/luna/` from professional analytics, including automatic capture, pageview events and queued custom events across client transitions. Select explicit SDK persistence/autocapture behaviour after that bounded inspection and before changing policy wording. Do not assert a legal compliance defect based only on policy text. If custom tracking is disabled/unconfigured, do not let `__phq` grow indefinitely in a long session.

This is a bounded implementation follow-up owned by integration, not an open-ended blocker for confirmed content. If effective dashboard settings cannot be inspected, record the limitation and keep broader analytics/policy redesign in a separate follow-up; the chronology, anonymisation, cases and CV release can proceed. Any analytics changes actually included must pass their specified payload/storage checks and match policy wording.

Use [PostHog's official configuration documentation](https://posthog.com/docs/libraries/js/config) and the installed version's source when implementing. Do not invent a consent/legal requirement without a separate grounded assessment.

### Personal page boundary

`/luna/` is a separate personal experience with noindex metadata, its own CSS/audio and hidden professional navigation. Preserve its behaviour and assets. Keep it out of professional navigation, search, sitemap and AI text exports. Noindex is not access control; this plan does not promise authenticated privacy or authorise moving/deleting the page.

Check whether root canonical/OG metadata inherited there unintentionally points at Home and set accurate route-specific metadata when touching the shared metadata layer. Implement and verify the explicit professional-analytics exclusion above without changing the audio experience. Do not introduce personal photographs into shared professional previews.

## 13. Concrete file work map

| Existing files or proposed additions | Work |
| --- | --- |
| `src/types/index.ts`, `src/data/experience.ts`, new `src/lib/career.ts` | Relationship/date/stage types, canonical chronology and pure selectors |
| New `src/data/work.ts`, `src/app/work/page.tsx`, `src/app/work/[slug]/page.tsx`, `src/components/work/*` | Eight server-rendered professional cases and index |
| `src/components/experience/ExperienceTimeline.tsx`, `TimelineCard.tsx`, new engagement component | Single responsive tree, nested disclosures and unique anchors |
| `src/app/experience/page.tsx` | Intro, metadata and education/professional structure |
| `src/app/page.tsx`, `src/components/hero/HeroContent.tsx`, `src/components/home/HomeHighlights.tsx`, new `HomeSelectedWork.tsx` | Stable identity, proof selection, latest AWS experience and exact learning label |
| `src/components/hero/CanvasGlobe.tsx`, `GlobeWrapper.tsx` | Preserve signature; change only for measured accessibility/performance needs |
| `src/data/about.ts`, `src/app/about/page.tsx`, `src/components/about/*`, `HomeExpertise.tsx` | Short summary, journey, education/geography and reconciled capability copy |
| New `src/data/profile.ts`, `src/data/social.ts` | Shared public identity/contact/CV destinations without private fields |
| `src/data/navigation.ts`, `src/components/layout/Navbar.tsx`, `MobileMenu.tsx`, `Footer.tsx`, `src/components/ui/PageNextSection.tsx` | Selected Work access, breakpoint/focus correctness, shared labels |
| `src/data/events.ts`, `eventCategories.ts`, `src/components/events/*`, event pages | Archive migration, stage/role/date semantics, relationship links and related content |
| `src/data/certifications.ts`, `src/components/certifications/*`, certification page | Four completion types, issuer links, counts, filter/card labels |
| `src/lib/search.ts`, `src/components/ui/SearchDialog.tsx`, `src/app/layout.tsx` | Public index, work category, hierarchy traversal and dialog corrections |
| New `src/app/search-index.json/route.ts`, public projection/loader modules | Compact versioned static search index fetched on demand; remove global blog-search data and browser collection imports |
| `src/lib/mdx.ts`, new `src/lib/dates.ts`, new shared metadata/JSON-LD helpers | Validated server content repository, deterministic calendar formatting, safe serialization and consistent URL construction |
| `src/lib/jsonld.ts`, all affected page metadata, `src/app/opengraph-image.tsx`, chosen default OG asset | Consistent profile/project/credential/event representations and sharing |
| New `src/app/og-default.png/route.ts` | Replace automatic extensionless image route with a generated real `.png` default and verified MIME type |
| `src/app/sitemap.ts`, `public/llms.txt`, `public/llms-full.txt`, `public/manifest.json` | Reconciled discovery output |
| New `src/app/llms.txt/route.ts`, `src/app/llms-full.txt/route.ts` | Static text generation from public projections, replacing old public text sources |
| `public/Media/IMAGE_GUIDE.md`, approved existing customer media | Move authoring guidance outside production; preserve customer-original paths/bytes and valid derivative URLs |
| New `public/cv/*`, optional shared `CVLinks.tsx` | Exact approved PDFs and reusable language-labelled links |
| `src/app/contact/page.tsx`, `ContactInfo.tsx`, `ContactForm.tsx` | Inclusive intro, CV links, accessible validation/status; no real submissions |
| `src/components/blog/AuthorCard.tsx`, personal-product article/events | Professional identity and accurate personal-product descriptions |
| `src/app/blog/page.tsx` | Remove baseline unused-variable warning; preserve current archive |
| `src/components/ui/ImageLightbox.tsx`, `CreativeCarousel.tsx`, `src/lib/hooks/useReducedMotion.ts`, `src/lib/motion.ts` | Targeted focus, keyboard, viewport and motion fixes identified by UX review |
| `src/components/ui/ImageWithFallback.tsx`, `ThemeProvider.tsx`, `ThemeToggle.tsx`, `src/app/layout.tsx` | Explicit responsive image/error contract and consistent bootstrap/provider theme policy |
| `src/components/blog/BlogReadTracker.tsx`, `ReadingProgress.tsx`, article-progress controller | Correct shared article geometry and visibility-aware completion without DOM sentinel mutation |
| `ScrollReveal.tsx`, `StaggerChildren.tsx`, `Magnetic.tsx`, `CountingNumber.tsx`, certificate/card presence roots | Stable wrappers, correct measurement refs and lifecycle cancellation |
| `src/instrumentation-client.ts`, `src/lib/analytics.ts`, privacy page | Explicit intended telemetry and policy alignment based on effective configuration |
| `src/app/globals.css` | Targeted timeline/work layout, scroll offsets, contrast, motion and print treatment; preserve token system |
| `scripts/verify-build-output.mjs`, proposed validation scripts | Enforce real content, asset, route, privacy and relation checks |
| `scripts/generate-image-variants.mjs`, derivative source-ownership/asset manifest | Resolve collisions, reuse identical transforms, bounded concurrency and hash/settings freshness while retaining required URLs |
| `package.json`, `.github/workflows/deploy.yml` | Wire meaningful checks into CI and keep static artifact deployment coherent |
| `next.config.ts`, `tsconfig.json`, ESLint, lockfile, workspace and domain files; `src/lib/security.ts`, `public/_headers`, `public/robots.txt` | Preserve unless a demonstrated implementation need requires adjustment; do not claim `_headers` is enforced by GitHub Pages |
| `Knowledge/MasterFile.md`, `Knowledge/TODO.md`, `Knowledge/blogs/BlogInstructions.md` | Rewrite/update all active existing files under the mandatory Knowledge workstream; preserve source detail and archive originals |
| New `Knowledge/README.md`, `Sources.md`, `Update_Log.md`, `MediaGuide.md`, dated `_archive/` and local manifest | Private reading order, provenance, change history, current asset guidance and verifiable ignored-file delivery; keep out of Git/public artifacts |
| Local agent settings, `.env.local` | Read as configuration only; preserve values and avoid unrelated changes |
| `.next/`, `out/`, `tsconfig.tsbuildinfo` | Regenerate; never edit exported pages as the source of truth |
| `node_modules/`, `.git/`, protected mounts | Preserve; no vendor edits or Git-history rewriting |
| `src/app/luna/*`, `src/components/luna/*`, personal media/audio | Preserve and regression-check shared changes |

Everything not requiring a change is deliberately retained after coverage review. Do not turn a full-file audit into unnecessary file churn.

## 14. Implementation sequence and parallel ownership

### Phase 0 Establish a reproducible baseline

Record source commit, clean/dirty state, approved source hashes, current route inventory, counts and baseline checks. Retain local evidence outside public. Confirm applicable repository instructions. Capture representative current screenshots using the normal browser workflow.

Exit: reproducible baseline, explicit retired-page routes and an approved customer-asset path/hash manifest. The media manifest records existing public files and is safe to version outside `public/`; it is not a list of secret customers. Validate it locally and in CI using the same checked-in assertions. Remove the previous plan's required customer-identity Actions secret and global denylist: they conflict with approved asset retention and introduce an unnecessary deployment dependency. Keep generic output checks for private-source files, environment material, internal provenance and accidental publication of the brief/career kit. Existing PostHog deployment secrets remain unchanged.

### Phase 1 Build the factual foundation

Introduce types, relationships, shared selectors and exact chronology. Add the work collection using neutral public labels. Reconcile claim boundaries in existing data objects, preserve approved customer assets and move public authoring guidance. Validate graph/date/public-field and asset-preservation invariants.

Exit: correct public editorial data, preserved approved media, no unapproved private runtime fields, no duplicate consulting employment and a settled route set. No feature branches should deploy partial migration content yet.

### Phase 2 Build Experience and Selected Work in parallel

After the data contract is stable, split independent work:

| Owner | Exclusive responsibility |
| --- | --- |
| Data/integration owner | `types`, canonical data/selectors, shared profile, merge conflicts and final factual review |
| Experience/UI owner | Experience components and page, nested disclosures, education layout and deep-link behaviour |
| Work owner | Work index/detail/components and case presentation, consuming agreed public data |
| Archive/credentials owner | Event/credential components and classification mappings after agreed type changes |
| Interaction/runtime owner | Shared modal/gallery/motion/theme/image primitives and article telemetry lifecycle; coordinate Navbar, root layout and analytics edits with integration |
| Build/artifact owner | Content/asset manifests, image source ownership, validators, package/lockfile and CI; sole owner of build-tool mutations |
| Knowledge/evidence owner | All `Knowledge/` files and local preservation/reconciliation manifests; coordinates factual IDs with integration and records implemented state only after checks |
| Verification reviewer | Read-only review and artifact assertions; no concurrent edits to another owner's files |

Workers must not revert unrelated changes. Shared types/data, root layout, global CSS, navigation and package scripts need one coordinating owner. Establish contracts before parallel UI work; otherwise agents will recreate incompatible facts and routing.

Fix image-source collisions and establish data/projection contracts before broad UI migration. The runtime owner establishes the stable disclosure/modal/gallery contracts before dependent pages wire them in. The build owner and integration owner define the shared content revision and compact search response before removing the old global prop chain. Transform caching and smaller static-component boundaries follow correctness fixes, with measurements taken at each layer; optional dependency cleanup comes last.

Knowledge work has two checkpoints: C1 archives/reconciles the evidence and prepares the complete current MasterFile alongside Phase 1; C2 reconciles actual routes, assets, commands, architecture and check results after Phases 4–5. Personal history and evidence expansion can run alongside UI work. Do not mark planned website changes as implemented in Knowledge before C2 verification.

Exit: eight cases reachable, complete hierarchy visible, cases/engagements linked both ways, keyboard/mobile behaviour working.

### Phase 3 Reconcile entry points and downloads

Update Home, About, navigation/footer/author identity and capabilities. Copy exact approved PDFs. Implement inclusive Contact wording and accessibility improvements. Review desktop and small-screen hierarchy before refining decorative effects.

Exit: a visitor can understand the profession immediately, reach strongest work, inspect chronology and open either CV.

### Phase 4 Reconcile archive and derived surfaces

Convert ordinary project archive pages to distinct short milestones; remove identifying route generation. Fix dates, roles, education, claims and classification. Rebuild search, metadata, JSON-LD, sitemap, AI-readable files, manifest and chosen OG default from approved public projections.

Exit: no stale parallel profile, duplicate full case copy or dead search result. New editorial descriptions use the agreed labels, and approved existing customer assets remain available.

### Phase 5 Verify the complete artifact

Run content checks, actual lint/type/build scripts, export assertions and representative browser checks. Review final changed files and final artifact against the entire brief. Revisit any warning or mismatch introduced by the refactor. Keep unresolved evidence fields isolated with the specified fallback.

Exit: all acceptance groups satisfied or a narrow explicit exception recorded with a safe fallback. A green build alone is not content acceptance.

### Phase 6 Delivery and deployment verification

Deliver file/route changes, check results, representative screenshots, approved CV hashes, unresolved evidence, the completed local Knowledge refresh with before/after manifests, and external career-folder follow-up status. Git diff alone cannot evidence changes to ignored Knowledge files. Deploy only within the authorised publication workflow. After deployment, verify live key pages/PDFs, retired-page status and continued availability of retained customer assets; local build success is not deployed success.

Use one coherent Pages artifact so changed routes, data, search and assets arrive together. Keep a known revision for rollback, preserving approved customer assets. Recheck factual corrections and any genuinely private-material exclusions before rollback; do not confuse an approved logo with a new confidential disclosure.

## 15. Meaningful verification and release gates

### Actual repository commands

```sh
pnpm lint
pnpm typecheck
pnpm build
pnpm check:build
```

`check:build` repeats the post-build verifier explicitly; it is useful for independently validating an artifact. `pnpm start` is `next start`, which is not the production preview for a static export. Preview the built `out/` with an ordinary static server and verify deep routes there, not only in `next dev`.

The project has no existing test script. Add a small content/relationship validator and artifact checks where they protect the structural/privacy risks. Do not add a large test framework for copy edits. Wire any new command only after it exists and its runtime supports the TypeScript import strategy.

### Data assertions

- Exactly one consulting parent; correct five child groups; Supportful project contexts correct.
- Children are not top-level jobs, and early clients have no invented individual periods.
- Approved public dates/titles/stages match generated summaries.
- All IDs are unique and all references/routes exist.
- All public periods valid; exact-day output requires exact evidence.
- Each professional case has its expected engagement, stage and supported outcome.
- Credential mapping covers every genuine record once; totals derive from classified records.
- Events totals derive from retained records; role-specific counts have correct definitions.
- Newly authored public editorial copy contains no em dashes. About contains no feedback quotes, imposed sector specialisation or invented motivation; languages contain no invented CEFR levels.
- AWS community recap, MWC jury and optional bootcamp wording retain the exact event scope and collaborative credit specified in Section 10.
- Calendar-day/year rendering and grouping match under UTC, Paris and Los Angeles; invalid calendar inputs fail with source/field errors.

### Artifact assertions

- Every expected public route exports; unknown and retired routes are absent and return the host's real 404 behaviour.
- Approved existing customer originals retain their expected paths and bytes; existing derivative URLs remain valid. Customer branding in these images and identity in their asset paths are permitted.
- Newly written editorial/search/schema objects respect agreed neutral labels and do not introduce unsupported customer claims. Approved media references are explicitly allowed; no blanket identifier or pixel-removal rule applies.
- No private kit, brief, environment files, local source paths or authoring guidance in output.
- Public projection uses allowlisted fields; no internal evidence metadata in serialized payloads.
- Every internal href/file target resolves. Fragments target unique IDs, including only one consulting/child anchor per page.
- Work canonicals, breadcrumbs, title templates and sharing metadata resolve correctly.
- The default sharing image is a real `.png` file with correct bytes, dimensions and successful decoding; deployed headers report `image/png`.
- Current CV bytes equal approved hashes; no duplicate stale assets linked elsewhere.
- All referenced responsive media variants exist and CSP meta is required on every applicable HTML page, not only one page.
- Public assets are inventoried even if unreferenced. Keep the approved customer collection; do not delete unreferenced customer assets as automatic dead-code cleanup. Preserve approved PDFs unchanged.
- Sitemap excludes removed routes and personal page; AI-readable output matches canonical facts.
- Unrelated HTML/RSC no longer carries the global blog-search collection. Search receives only its public projection on demand, and long event details are absent from archive JavaScript.
- Derivative families resolve to the declared source; decoded dimensions/aspect ratios are correct. Two clean generations are deterministic, warm runs invalidate changed source/settings, and approved originals retain hashes.

### Browser acceptance matrix

| View/flow | Required checks |
| --- | --- |
| Home | Stable profession before animation; proof cards; latest AWS; current links; short-screen layout |
| Experience | Correct hierarchy, single anchors, readable summaries, Supportful three contexts, TowardsChange two stages |
| Engagement deep link | Direct loads of new and legacy fragments, same-page navigation, refresh, filter changes and Back/Forward reveal the correct disclosure with focus/header offset |
| Filters | All/Professional/Education preserve relationships; no duplicate top-level children or empty broken layouts |
| Work index | Eight professional cases, meaningful stage labels and useful card hierarchy |
| Production/pilot/advisory cases | Salesforce, AWS and MinervaHub each convey appropriate stage and outcome |
| TowardsChange case | Two architectures remain distinct at desktop/mobile widths |
| Search | Required queries; applied ranking; visual selection matches Enter; visible input; focus trap/restore; Escape; empty state |
| Credentials | Four completion types and topic filters; exact counts; correct visible labels and usable issuer links |
| Events | Date precision, role clarity, migrated milestone links and no duplicate full cases |
| About | Concise introduction, correct education/geography, languages and current development interests |
| CV links | Both PDFs open/download, correct type/bytes, descriptive language labels |
| Contact | Labels/native validation plus mocked sending/success/error; success focus, retained error inputs, resizable textarea and clickable email fallback |
| Mobile menu/lightbox | Focus enters/returns, Escape closes, background isolated, opener expanded state, current route and short-screen internal scrolling |
| Light/dark/reduced motion | At least 4.5:1 for meaningful normal text, applicable 3:1 control/focus contrast, preference changes, resize redraw, visible focused hero actions and reduced programmatic motion |
| Print/no JavaScript | Expanded engagement details and useful professional relationships; no skeleton-only evidence or animation-hidden essential text |
| Gallery/media | Full-resolution retained screenshot review, informative alternatives, focus/touch-visible controls and captions/transcript assessment for spoken video; missing alternatives logged explicitly |
| Personal page | Existing audio/navigation behaviour survives shared changes; excluded from professional discovery |

Focused architecture regressions include carousel button-to-wheel interruption, viewport resize, reduced-motion changes without child remount/focus loss, source changes after an image error, theme storage denial/invalid values, article completion after waiting at the end, hidden-tab active-time accounting, search revision mismatch/retry and repeated-route listener cleanup. Use pure unit checks for data/geometry/state transitions and representative browser checks for actual focus, layout and loading. Do not write tests that merely mirror static copy.

Use representative widths of 360/390 px, 768 px, 1024 px and a normal desktop width, plus short landscape and 200% text zoom. Avoid claiming a complete screen-reader certification from DOM checks; include practical keyboard and accessible-name checks.

Performance checks should compare the before/after exported payload and representative browser traces. Keep new case prose server rendered, share lightweight projections, avoid shipping full long data objects globally, and verify image loading. Do not report invented Lighthouse/Core Web Vitals scores or guarantee field performance from a local build.

## 16. Unresolved evidence and fallbacks

| Item | Safe implementation treatment |
| --- | --- |
| AskAI scope/dates/stage | Omit public dated experience; leave isolated follow-up |
| Separate early-client dates | Shared subgroup period only |
| Cloud Practitioner expiry | Preserve attributed current record or omit disputed prominent expiry; log issuer verification |
| Claude current status | Preserve current attributed issue/expiry, without asserting fresh issuer validation |
| PMP/Cisco/combined learning dates | Separate announcement/completion and use lower precision where needed |
| Exact diploma title | Established programme description; no invented equivalence |
| Student representative year/unit and ambassador subperiods | Broad supported contribution without false precision |
| Aggregate speaking reach | Event-specific supported counts only |
| Decentra benchmark settings | Nano/model result only; no invented precision/resolution/batch details |
| Personal-product adoption/revenue | Built functionality and explicit personal-product stage |
| Research publication/clinical validation | Collaboration/prototype only |
| Existing customer media | Approved to retain, including branding/paths; preserve by default. Separately isolate any concrete credential/private-record issue discovered beyond that approval |
| Current vendor/model/pricing blog assertions | Preserve dated context; fact-check primary sources before revising concrete claims |

These items do not block confirmed work. Do not ask questions already answered by the brief or direct confirmations.

The repository's `Knowledge/` refresh is now explicitly authorised implementation scope and is required for the overall task. The separate `/home/oem/Desktop/HadiAbouDaya/` career kit remains an evidence source; this instruction does not silently authorise rewriting that external folder. Record any needed career-kit corrections or future reconciliation precisely, preserving its original sources and CVs. No Knowledge or career-kit implementation write has been performed during this planning delivery.

## 17. Coverage against the brief

| Brief change IDs | Plan coverage | Main acceptance evidence |
| --- | --- | --- |
| STR-01, STR-02, STR-03 | Sections 3–7 | Consulting and engineering visible; factual compatibility across sources |
| IA-01, IA-02 | Sections 3–6 | Work navigation and persistent practice/engagement/case relationships |
| EXP-01, EXP-02, EXP-03, EXP-04 | Sections 4–5 | Single consulting parent, correct nesting, logos/labels, mobile/filter integrity |
| HOME-01, HOME-02, HOME-03, HOME-04, HOME-05 | Sections 3, 7, 12 | Fixed identity, AWS latest, selected proof, accurate count/shared labels |
| ABOUT-01, ABOUT-02, ABOUT-03, ABOUT-04, ABOUT-05 | Sections 5, 7 | Short About, current journey, exchange, chronology/geography, languages |
| WORK-01, WORK-02, WORK-03 | Sections 4, 6 | Eight cases, reader questions, stage and date precision |
| ROUTE-01, ROUTE-02, ROUTE-03 | Sections 8–9 | Explicit page migration policy, no full duplicate copies, retained customer-media URLs |
| PRIV-01, PRIV-02, PRIV-03 | Sections 2, 5, 9, 15 | Neutral new editorial records and bounded claims; existing customer assets explicitly retained under the user's newer instruction |
| SKILL-01, SKILL-02 | Section 7 | Purpose-based skills linked to evidence |
| EDU-01, EDU-02 | Sections 5, 10, 12 | Institutional relationships, training type and milestone meanings |
| CERT-01, CERT-02, CERT-03, CERT-04, CERT-05 | Section 10 | All records retained, four types, accurate counts/title implications |
| EVENT-01, EVENT-02, EVENT-03, EVENT-04, EVENT-05, EVENT-06 | Sections 8, 10 | Roles, dates, recognition/training outcomes, scoped counts and uncertain periods |
| BLOG-01, BLOG-02 | Sections 6–8, 13, 16 | Existing writing retained; cases prioritised; products correctly classified |
| CV-01, CONTACT-01 | Section 7 | Exact PDFs, accessible language links and intended contact routes |
| SEARCH-01, SEARCH-02 | Section 11 | Applied query results, correct ranking/destinations and public-only projections |
| META-01, META-02 | Section 12 | Title/template, sharing/schema, canonical and sitemap consistency |
| DATA-01, DATA-02, DATA-03, DATA-04, DATA-05 | Sections 1, 4, 5, 11–15 | Inspected architecture, shared facts, relationships, sorting and accessibility |
| RECORD-01, RECORD-02, RECORD-03, RECORD-04 | Sections 16, 19 | Required repository Knowledge reconciliation and precise separately scoped external career-kit follow-ups |
| Brief sections 23–25 and 27 | Sections 14–20 | Dependency order, real commands, acceptance gates, fallbacks and honest delivery |

## 18. Code and architecture refactors

The content migration is also an opportunity to replace weak implementations. The following decisions are grounded in current source, not a general preference for rewriting. The goal is correct behaviour, less duplicated state/data and measurable browser/build improvements while preserving the signature globe, approved assets and static deployment.

### Release scope and delivery order

Use three delivery tracks, with explicit gates for each rather than making every engineering improvement a prerequisite for corrected professional content:

| Track | Scope | Completion rule |
| --- | --- | --- |
| A Professional content release | Brief requirements with the existing-asset exception; content/date validation, consistent metadata/serialization, image-source collision correctness, the new career/work/search boundaries and reliable interactions in the changed visitor flows | All content, asset-preservation, route and representative browser gates in Sections 14–15 pass |
| B Scheduled engineering refactors | Existing theme/image-state robustness, gallery/motion/cancellation improvements outside the content critical path, article-progress measurement, telemetry lifecycle and measured build/dependency cleanup | Deliver in bounded changes with each package's tests and measurements; may follow Track A without blocking the factual release |
| C Complete local Knowledge refresh | Every active Knowledge file, a substantially expanded self-contained MasterFile, source/uncertainty records, dated preservation and local delivery verification | C1 evidence consolidation and C2 implemented-state reconciliation pass Section 19; required before the overall task is called complete |
| Deferred unless evidence warrants | Broad memoisation, global media-query infrastructure, provider consolidation, renderer/framework replacement and further geometry batching | No implementation obligation without a measured benefit or concrete unmet requirement |

Track B is part of the planned engineering work, but an unavailable analytics dashboard or unfinished reading-progress redesign must not delay the confirmed chronology, cases, asset retention and CVs. Apply telemetry/progress acceptance checks when those packages are delivered. If a shared component is changed in Track A, its existing behaviour and the directly affected correctness requirements must pass then; do not defer a regression introduced by the migration. Track C is required and may run alongside A/B; a deployed site with an unchanged Knowledge folder is not completion of the overall request. Report each track separately.

### Shared state and media primitives

**Unify theme initialization.** `layout.tsx` catches storage errors and falls back to dark unless light is established. `ThemeProvider.tsx:22–44` starts light, casts any stored string to a valid theme and reads/writes localStorage without error handling. Those policies can disagree for invalid storage, inaccessible storage or an unspecified OS scheme. Replace them with one explicit policy: valid stored light/dark wins, otherwise use the supported OS preference, otherwise preserve the established dark fallback. The provider adopts the bootstrap-applied root class rather than independently repainting it on mount. Keep storage best-effort, respond to cross-tab preference changes, and only follow OS changes when no explicit choice is stored. Avoid two separate mounted flags for a single toggle. Test valid/invalid/throwing storage, first paint, explicit toggle and system changes; no hydration flash or broken toggle is acceptable.

**Rebuild the image fallback box contract.** `ImageWithFallback.tsx:24–37` retains failure state across `src` changes and applies intrinsic dimensions as forced inline CSS dimensions in the error branch. A 1200 px cover can therefore become a fixed 1200 px fallback on a narrow page. Its skeleton also relies on the caller providing a positioned ancestor and guesses box classes by parsing Tailwind strings. Replace this with an explicit responsive wrapper/aspect-ratio contract, an inner image and source-keyed loading/error state. Preserve the image's accessible name in fallback output, avoid a shimmer covering an ancestor's whole card, and let responsive layout size the box. Check broken source followed by valid source, cached loads, avatar/logo/cover shapes and a 320 px error view. Do not use the refactor to alter approved customer-image bytes.

**Keep primitives small.** `cn`, current typography tokens, ordinary Badge/SectionHeading/Button usage and existing filter keyboard behaviour do not need a new design-system framework. Add native prop typing or small variants when touched code needs them. Do not create a universal schema-driven UI or a global state store for local disclosures.

### Measured payload and image baseline

The architecture reviewer inspected the complete existing export. These are local artifact measurements; compression estimates are not actual network transfers or browser timing results.

| Metric | Measured baseline | Implication |
| --- | ---: | --- |
| HTML pages containing the global blog-search prop | 88/88 | Unrelated pages and the personal page carry data for a closed search dialog |
| Repeated blog-search JSON projection | 4,618 raw bytes, 11 records per page | About 406 KB of repeated unescaped source JSON across HTML alone; do not equate this with wire savings |
| Full event collection | 70,374 raw bytes, approximately 19.0 KB gzip | Browser archive imports long details before expansion |
| Representative event-card projection | 33,905 raw bytes, approximately 8.9 KB gzip | About 52% less raw data for the collection at this boundary; final route savings require measurement |
| Responsive image derivatives | 795 files, approximately 26.89 MB | Keep required public URLs while making generation deterministic |
| Byte-identical redundant derivative files | 281 files, approximately 6.77 MB | Reuse encode work; preserving physical URLs means these bytes are not automatically removed from the artifact |
| Source pairs colliding on derivative destinations | 2 | The generator can produce the wrong image at a valid URL |

### Search data and static rendering boundaries

Remove `blogPosts` from the global Layout → Navbar → SearchDialog prop chain. Navbar should own opening search, not transport its data on every page. Generate a compact public-only index through `src/app/search-index.json/route.ts` with `dynamic = "force-static"`. It contains validated public search records, schema version and content revision, not full event descriptions, credential objects or private provenance. Fetch it on first search open, with loading, error and retry states. Cache a successful validated index for the mounted application session and share an in-flight request so repeated opens do not duplicate work. The browser search engine imports only matching/ranking logic, not canonical collections.

Use a build revision shared by the search response and client loader to detect schema/content mismatch after a deployment. CI can provide the public Git revision; local builds derive a source-content revision during preparation. Pass only this small revision token through the root contract, add it to the search request's cache key and reject a mismatched response with a recoverable reload/retry state. This is versioning, not a secret. Test an old open page against a newer exported index; do not assume every CDN or browser cache updates instantaneously.

Split the archive collection into an EventSummary projection and the full server-side Event record. The archive initially receives the title, summary, date meaning, role, category, first image, tags and the existing detail destination. Retain the useful inline expansion as **short contextual summary plus the detail-page action**, not the full case prose, all image arrays and enrichment fields. Full galleries and long descriptions live on the existing event detail page. This is the settled behaviour change: no new per-event fetch API is needed just to expand a card. Keep keyboard expansion and truthful preview content; do not claim full detail is still inline.

Make `EventDetail` a Server Component for heading/prose/links and isolate a client EventGallery that receives only approved media URLs and captions/options. The render-function composition currently used by ImageLightbox must stay inside that client gallery; do not pass a function prop across the server/client boundary. Split category/filter classification data from the React icon map so build-time projection helpers do not import UI code.

Render BioSection, JourneySection, static highlight/card text and PostCard structure on the server where they only consume content. Keep genuinely interactive wrappers, gallery controls and click-tracking islands small. Do not assume root Theme/Motion providers automatically make server-rendered children client code. After the refactor, check client-reference manifests and emitted JavaScript: static prose should stay readable in HTML/RSC without being duplicated in executable client collections. Preserve the existing server-rendered MDX body composition.

Apply the same boundary to Experience: sort/compose canonical entries on the server and pass stable IDs, classification and rendered entry slots to the small filter/deep-link controller. It may hide/show the professional and education sections and reveal the targeted native disclosure, but it must not import the full canonical career collection into browser JavaScript. Keep one DOM target per entry, native disclosure state and a readable All view before hydration. This separates facts/prose from view state without creating a second mobile rendering or a global state store.

### Deterministic image generation with retained URLs

`generate-image-variants.mjs` drops the source extension, so `profile/headshot.jpg` competes with `profile/headshot.webp`, and a workshop's `2.jpeg` competes with `2.webp`. The second pair is visibly different: the JPEG is 1080 × 1080, the WebP 1600 × 1131, but the current WebP reference resolves through square generated variants. Existence checks pass despite the wrong source being selected.

Introduce explicit derivative-family ownership metadata. For these existing families, use the currently referenced WebP source as authoritative; preserve the JPEG originals and every current derivative destination. Fail generation on any unclassified future collision instead of letting traversal order or `existsSync` select the picture. If both originals later need separate responsive families, give the additional family a distinct path without removing the established one. Validate the chosen source, decoded dimensions and aspect ratio at each derivative URL.

Cache transform work by source hash, effective width, encoder options and relevant pipeline version. Small sources currently produce identical 480/960/1440 destinations after width clamping. Encode once for an identical transform, then write the buffer to every required destination as ordinary files. Start with a bounded concurrency of four source transforms and measure generation time/peak memory; reduce it if resource usage regresses. Do not run unbounded Sharp operations, delete approved originals, use hardlinks in place of portable Pages artifact files, or claim the measured 6.77 MB disappears while those URLs remain physical files.

Require deterministic results from two clean runs, source-hash/settings-based invalidation for warm runs, changed-source freshness, original hash preservation and unchanged required URL inventory. Record encode count, elapsed generation time and peak memory separately from browser payload size. Keep the manual original-recompression script outside normal builds.

### Toolchain and dependency maintenance

The observed local toolchain is Node 22.22.0 and pnpm 11.1.2, while CI selects floating Node 22 and pnpm major 10. Pin a single tested pnpm version through `packageManager` and the CI action, using the local passing pnpm 11.1.2 baseline as the candidate; verify a frozen-lockfile install and full build before landing that alignment. Keep the supported Node release line explicit and align `@types/node` with that runtime rather than current type major 25. Do not fold an unrelated Next/React major upgrade into this refactor.

`shiki` and `rehype-pretty-code` are direct dependencies but absent from the current MDX pipeline. Remove them if final import/reference checks confirm no use; do not add syntax highlighting just to justify keeping packages. Move TypeScript, type declarations and CSS compilation tooling to development dependencies where appropriate, while ensuring CI installs build dependencies. The reviewed related installed directories occupy about 13 MB locally; this is an install-footprint observation, not promised browser-byte savings. Re-run frozen install, CSS/MDX checks and the complete export after lockfile changes.

Keep framework-generated RSC `.txt` payloads. They are navigation artifacts, not disposable duplicate documents. Retain the stack, static export, GitHub Pages, Tailwind typography and lazy-loaded globe/search. Broader provider rewrites or replacement of Framer Motion require new measurements after these narrower changes.

### Server content repository and deterministic dates

`src/lib/mdx.ts:8–47` rereads and parses the full directory for collection lookup, a single-post lookup, slug listing and search projection. Layout, metadata, detail pages, adjacent-post navigation and sitemap repeat these calls. Replace those helpers' independent collection work with one server-only validated repository interface: a sorted collection, slug map, compact listing projection, compact search projection and explicit source/updated dates. Reuse parsed data within the supported render/build-worker scope and instrument the reads to demonstrate that duplicate work falls. Avoid a persistent module cache that makes development edits stale; verify hot edits explicitly. This is a small local content repository, not a CMS, remote database or promise of one read across every build worker.

The parser's `as BlogPost` assertion is not runtime validation. Validate nonempty title/excerpt strings, string-array tags, slug uniqueness, real calendar dates, update dates, approved URL protocols and local asset existence before rendering. Fail with the source file and field when input is malformed; an expected blog directory disappearing must fail validation rather than silently publish an empty archive. Keep public projections explicit so a body/private authoring field cannot be added accidentally to global client props.

Introduce `src/lib/dates.ts` as the sole calendar-formatting boundary. Distinguish a day, month, period, occurrence date, publication date and content-update date. Current `new Date('YYYY-MM-DD')` plus local formatting can display the previous day/year in negative UTC offsets; the evidence audit reproduced 1 January appearing as 31 December in Los Angeles. Use validated UTC calendar formatting or component-based calendar formatting, stable numeric month sorting and an explicit clock only where current-time behaviour is actually required. Do not let hydration, sorting or duration labels vary by browser timezone. Verify UTC, Europe/Paris and America/Los_Angeles, leap days, invalid dates and month-only values.

Keep published history intact. `dateModified`/sitemap `lastModified` should use an explicitly maintained content-update date when one is established, otherwise omit unsupported modification precision. Occurrence and employment dates are not modification dates.

### Renderer and metadata boundaries

Keep MDX restricted to validated repository-authored content. Installed MDX v6 blocks expressions and removes imports/exports by default; do not incorrectly describe the current renderer as unrestricted JavaScript execution. However, gray-matter supports non-YAML engines, and the MDX pipeline still compiles content. Reject non-YAML language markers before frontmatter parsing, preserve existing expression/import restrictions and reject unexpected JSX/HTML nodes or use an explicit small allowed set. Fenced code examples remain ordinary text. Do not add remote arbitrary MDX, runtime compiler options, query-supplied scope or user-submitted components as part of this project.

Centralise JSON-LD rendering in a small server component and serializer that escapes `<` before script insertion. Current pages use direct `JSON.stringify` independently. Verify a title containing a closing-script sequence remains JSON data without creating another element. This is a shared output contract, not a claim that current content contains an exploit. It follows the [official Next.js JSON-LD guidance](https://nextjs.org/docs/app/guides/json-ld).

Use shared site/default-image and URL helpers across metadata, schema and sitemap. They must distinguish page URLs, asset URLs, absolute external URLs and fragments instead of concatenating the site origin blindly or appending a slash to files. Set article-specific Twitter image values to match the selected cover rather than accidentally inheriting the default. Validate emitted output, not only helper return values. Review MDX dependency maintenance separately; renderer replacement is not required for the first content release unless compatibility or a concrete unsupported need justifies it.

### Interaction lifecycle replacements

- **Carousel:** `CreativeCarousel.tsx:68–76` sets `isNavigating` without clearing it at navigation completion. Replace guessed 320/360 px step sizes with measured slide positions and an explicit idle/programmatic/user-interrupted navigation state. Clear or settle pending navigation on scroll completion, pointer/wheel/keyboard interruption and resize. Use one gallery controller for the multi-image layouts retained on detail/work pages; remove the superseded archive-preview carousel once cards use their summary-only expansion. Check dots, arrows, touch, wheel, resize, single-image/no-overflow states and lightbox entry at the selected image.
- **Stable motion wrappers:** `ScrollReveal`, `StaggerChildren` and `Magnetic` switch between motion and native wrapper types when reduced-motion state changes. Keep stable underlying elements/component identity and change animation props/behaviour instead. Test that an input value, disclosure state, focus and child mount count survive a preference change. Do not replace one avoidable remount with CSS-hidden duplicate trees.
- **Presence and measurement:** `CertFilter` uses `popLayout` around custom `CertCard` children without attaching the measurement ref at the actual DOM root. Forward the ref to that root or place the measurable motion element directly under presence. Search's internal AnimatePresence is currently destroyed by the Navbar's conditional unmount; give the persistent overlay owner control of enter/exit, with focus/scroll-lock cleanup matching its lifecycle. These changes preserve useful transitions without reintroducing initial-page fades.
- **Scheduled work:** cancel `CountingNumber` animation frames, search focus timers, hash-navigation retries and any superseded work on unmount/preference/route changes. Prefer deterministic post-navigation target resolution over fixed polling where a stable anchor/disclosure controller is available. Verify repeated navigation does not accumulate observers, timers or listeners.
- **Professional navbar boundary:** do not install search shortcuts and scroll listeners in a component that later returns null for `/luna/`. Split the professional navbar controller from the small route boundary, so its effects unmount outside professional pages. Initialise scrolled state from restored scroll position rather than waiting for the next scroll event. Keep existing public route URLs unchanged.
- **Globe:** `CanvasGlobe.tsx:149–152` compares integer backing-store dimensions to potentially fractional CSS-size × DPR. Compare rounded pixel dimensions so the canvas does not repeatedly reset at fractional sizes. Advance rotation by elapsed time rather than frames so 60/120/144 Hz displays run at the same speed. Cache only invariant geometry, preserve visible dots/arcs and defer further batching or DPR-quality changes until profiling shows a need. Handle preference changes, resize and visibility cleanup without replacing the globe.

These refactors have bounded ownership and observable behaviour checks. Broad memoisation, a shared global media-query registry and motion-provider consolidation remain optional profiling follow-ups. The existing `LazyLoad` component is unused; remove it only after confirming references, and do not report its behaviour as an active page defect.

### Correct article measurement and telemetry lifecycle

`BlogReadTracker.tsx:72–86` places sentinel nodes by counting direct child elements. `PostContent.tsx` passes one wrapper containing the full prose. As written, the first three markers land before the prose, rather than at 25%, 50% and 75% of the article's height. The completion marker is also unobserved on its first intersection, even if the dwell-time condition was not yet met. Waiting at the end may therefore never emit the completion event. Elapsed wall time currently includes time spent in a hidden tab.

Replace DOM mutation with a dedicated article-progress controller observing the real prose region. Use measured article bounds, a passive scroll listener with at most one pending animation frame, a ResizeObserver for late layout changes and a visibility-aware active-time clock. Display progress and emit milestone events from the same geometry contract. Define progress as the viewport's reading position through the scrollable article range; short articles that fit in one viewport may reach the geometric end immediately, but completion still requires active dwell time. Emit each 25/50/75/100 milestone at most once per article visit. Keep the completion predicate live until both end-reached and active-time conditions hold, even if their order changes. Reset on slug change and clean up listeners, observers, timers and pending frames. Do not add sentinel elements to React-owned prose.

Verification must cover variable paragraph heights, headings/code blocks, image resize, quick scroll to the end followed by waiting, hidden-tab time, article-to-article navigation and repeated mounting. Progress events are engagement estimates, not proof that a visitor read or understood the article. Existing analytics history is not retroactively corrected by this change.

`analytics.ts` queues indefinitely when no SDK becomes available, while `instrumentation-client.ts` owns asynchronous initialization separately and has no explicit failed/disabled state. Replace the loose window-global protocol with a small typed telemetry controller: disabled/loading/ready/failed states, one initialization promise, a bounded pending-event queue, safe failure handling and one flush. Preserve public event names where their meaning remains the same; explicitly annotate any corrected reading-depth semantics.

Use a route-aware bridge for pageviews and custom events. Disable automatic history pageview capture when emitting manual pageviews, so initial load and client navigation each produce at most one eligible pageview. Suppress the personal route at both capture and queue-flush time; never replay personal-route events after returning to a professional page. Initial load on the personal route must not initialize professional tracking. Raw contact fields and raw search queries stay outside the event payload. Choose explicit autocapture/recording settings that satisfy that route boundary rather than assuming an initialization-only path check handles later navigation. Verify with a fake transport and controlled navigation; no real contact submission is needed. Broader dashboard/policy investigation remains separately bounded as described in Section 12.

### Rendering regression to preserve

There is no current root `src/app/template.tsx`. An earlier full-route fade/remount wrapper was removed to resolve page-entry flicker. Keep that fix: do not restore a root animation template, duplicate a page for a transition, or put essential content back behind an initial invisible state. Current `AnimatePresence initial={false}` handling on initial filter views is intentional. Preserve an immediate readable first render and reserve transitions for user-driven changes.

### Source and acceptance references

The server/client boundary plan must follow the actual import graph: a client wrapper receiving server-rendered children does not by itself turn those children into client modules. Narrow interactive boundaries and avoid passing large raw content objects unnecessarily. See the [Next.js Server and Client Components documentation](https://nextjs.org/docs/app/getting-started/server-and-client-components). Any use of React `cache` must account for its server-render scope; it is not a persistent filesystem cache shared across all static-build workers. See the [React cache reference](https://react.dev/reference/react/cache).

## 19. Complete Knowledge folder refresh

### Required outcome and current baseline

Update **every active file in `Knowledge/`**, including nested files, and make `Knowledge/MasterFile.md` a substantially more complete, current and useful private reference. At this audit the folder has three files: a 1,411-line, 95,626-byte MasterFile, an eight-line empty-backlog TODO and a two-line blog-style note. This is a major content/evidence reconciliation, not a frontmatter-date change or a shorter website summary pasted into the master.

Keep the MasterFile self-contained for ordinary authoring and interview preparation: it should explain the supported life/career story, detailed work and meaningful outcomes without requiring the reader to follow every link. Links provide provenance and deeper originals; they do not replace the actual content. Completeness means coverage of supported facts and honest gaps, not an arbitrary word target or invented detail.

### File plan

| File | Required work |
| --- | --- |
| `Knowledge/MasterFile.md` | Rebuild the active comprehensive reference with a table of contents, current chronology, full engagement/project bank, complete inventories, scoped metrics, sources, uncertainties, preferences and website operations |
| `Knowledge/TODO.md` | Replace the empty backlog with actionable website, engineering, Knowledge and editorial tasks; preserve dated completion evidence and genuinely unresolved questions |
| `Knowledge/blogs/BlogInstructions.md` | Expand the existing direct/opinionated style into practical writing, sourcing, update and publication rules while preserving Hadi's voice |
| New `Knowledge/README.md` | Define reading order, active versus archived files, maintenance workflow, source authority and the private/public boundary |
| New `Knowledge/Sources.md` | Index exact source files/sections, dates, authority/limitations and verification status; distinguish the career kit, user instructions, website code and external issuer evidence |
| New `Knowledge/Update_Log.md` | Record dated factual corrections, added detail, explicit presentation choices, affected files and actual verification/delivery status |
| New `Knowledge/MediaGuide.md` | Move/rewrite `public/Media/IMAGE_GUIDE.md` here with actual filenames, current media/source ownership, approved customer-asset retention, CV paths and generation/verification guidance |
| New dated `Knowledge/_archive/` snapshot plus separate `Knowledge/_updates/` delivery records | Immutable original files/baseline manifest; separate after-manifest, coverage report and verification results |

Before implementing, recursively re-inventory the folder. The current three-file list is a baseline, not permission to overlook newly discovered nested files. Every active input must have an explicit updated, retained-with-reason or archived disposition. Archived originals remain immutable; updating everything does not mean rewriting historical backups.

### Source authority and the three maintained layers

1. **Underlying career evidence:** the latest direct user confirmations and source-specific documentary records establish their respective facts. Read the maintained kit's `AGENTS.md`, start guide, profile, detailed engagements, timeline, consulting examples, credential/speaking register, claim questions and original source index. Use the 18 October confirmations for the details now established. Read supplemental current evidence such as the voice-agent record where relevant.
2. **Private repository Knowledge:** consolidate the supported detail and current user preferences, retaining provenance and private context. Replace the old blanket single-source-of-truth claim with a clear role as the consolidated private reference. A later file-edit timestamp does not make a weaker source more authoritative.
3. **Public website/CV projections:** curate the appropriate subset for visitors. Website code/output establishes what is implemented and published, not independent proof of personal achievement. Approved CVs establish the chosen artifact/presentation; do not regenerate them or treat a generated CV as a fresh factual source.

Keep source meaning intact when records differ. The agreed AWS public presentation and the separately documented administrative chronology belong to different fields/contexts; do not rewrite either to make it appear to corroborate the other. Keep narrowly sensitive documentary detail in its original private record with a source pointer, rather than copying correspondence or unrelated administrative material into the MasterFile.

An older MasterFile may be the only available record for a personal memory or early project detail. Preserve it with its actual provenance: use user-reported only where the original user statement is established; otherwise label it **legacy recorded claim; original provenance unverified**. A potentially generated summary must not become a direct confirmation merely through preservation. Where newer evidence contradicts it, update the active fact and retain a concise reconciliation note plus the unchanged original snapshot. Do not erase useful personal history just because the website does not display it.

Preserve the maintained kit's source IDs S01–S15 when referring to them, with their original meanings. Assign a separate local namespace to the current brief, latest user instructions, code/output snapshots and legacy MasterFile; do not reuse a source ID for a different document. A duplicate summary of the same underlying statement is not independent corroboration.

### MasterFile structure and detailed coverage

Preserve coverage of all 21 existing top-level sections while reorganising them to avoid duplicate current-role blocks and conflicting counters. Use this reconciliation map:

| Legacy section or subject | Expanded current content and required treatment |
| --- | --- |
| 0 Basic Profile | Current professional positioning and location; dated contact/preference records; latest experience instead of unsupported current-employer claims; concise orientation and source/freshness notes |
| 1 Early Life & Family; 2 School Years | Preserve unique supported childhood, family, school, interests, tutoring/camp and early programming details; retain the distinction between personal recollection and independently documented facts |
| 3 USJ-ESIB; 5 Advanced Studies | Full education paths, programme periods, McGill exchange, scholarship, coursework, academic projects and student activities; correct joint-degree/training implications and isolate exact-diploma/representation uncertainties |
| 4 Work Experience; 6 Savencia; 7 Supportful; 8 AWS | One master career chronology with accurate classifications/overlaps, then detailed standalone roles and one consulting practice with all five engagement groups; merge repeated role narratives without losing unique evidence |
| 9 Community/Teaching/Leadership; 14 Speaking Topics | Full supported volunteering, teaching, mentoring, organising and judging record; audience-specific topics/materials, role attribution, event-specific outcomes and source-limited dates/counts |
| 10 Certifications/Learning | Complete current inventory, initially reconciling 56 website records against the older 52-record snapshot, with four completion classes and verification notes; preserve issuer links and history without duplicate credentials |
| 11 Events Timeline | Complete historical event/milestone ledger with date precision/meaning, role, topic, organisation, source and associated work; preserve history even when a public project page becomes a case or retires |
| 12 Technical Toolbox | Purpose-based skills linked to actual projects and contribution; distinguish used in delivery, studied/trained and current development interests; add the newer agent/integration/reliability evidence |
| 13 Personal Projects & Experiments | Full supported product/research/academic project bank, including architecture, personal role, stage and useful lessons; distinguish functionality, roadmap and commercial adoption |
| 15 Blog Posts | Complete article inventory with original publication history, summaries/topics, source-link status, editorial corrections and current/retired destinations; retain eleven current records without contradictory total claims |
| 16 Personal Life/Interests/Values | Preserve known interests/travel and directly stated aims; distinguish study/residence, remote work and visits; leave unsupported values/motivations/reflections as genuine gaps |
| 17 Metrics/Impact | A scoped claim register with measurement context, attribution, source, caveats and publication status; remove misleading totals and funding/adoption interpretations |
| 18 Portfolio Website | Actual stack, routes, content model, assets/CVs, search, metadata, analytics, commands, deployment and architecture decisions; separate current, planned, locally verified and deployed states |
| 19 Journey Narrative | An accurate narrative consistent with the full record and brief, preserving distinctive personal context; keep short public versions separate from detailed private narrative |
| 20 To-Fill Checklist | Reconcile every old gap against current confirmations; close already answered evidence questions with a source and carry genuine unknowns into the active TODO without re-asking resolved questions |

Add a source/freshness guide, public/private presentation rules, concise decision history and an update ledger where the old structure lacked them. Keep detailed content in the MasterFile rather than moving every substantive paragraph to supporting files.

Add a complete CV/artifact register inside the MasterFile: the English and French canonical PDFs and DOCX files, language, revision/as-of date, exact source path, byte size, SHA-256, provenance and approved formatting/presentation rules. Distinguish those four current artifacts from dated archives, tailored application copies and confirmed submitted copies. Preserve the chosen language-specific availability wording; recording the artifacts is not permission to rewrite or regenerate them. References to submission require actual confirmation, not a filename suggesting an application.

### Full engagement and project detail

For each substantive role/engagement/project, record the supported fields: stable ID, relationship, role/classification, period and precision, business/user need, constraints, Hadi's contribution, collaborative attribution, architecture/technologies, delivery stage, supported outcome, evaluation/reliability work, source references, publication-safe summary and unresolved details. Do not fill unsupported fields with generic consulting prose.

Required expansion includes:

- AWS customer-pilot capabilities and architecture/requirements work, A2A, Transform prototype and Redshift contribution, with onboarding/team recognition kept subordinate and correctly attributed.
- Supportful sales-copilot/FastMCP work, agent-harness behaviours, authorised CRM operations and qualitative user benefit; portal collaboration/commercial demonstration outcome; sports web/WhatsApp, telephone booking and conversational analytics with channel-specific scope.
- Existing deeper bank/fund/manufacturer application examples where supported, preserved at the appropriate private detail level rather than lost because public copy is shorter.
- MOPO concept-to-production project leadership, technical/business coordination, retrieval/speech/backend/deployment work and fundraising preparation boundaries.
- MinervaHub discovery, organisational pain points, blueprint/access/governance/architecture advice and prioritisation roadmap, without inventing deployment or approved funding.
- TowardsChange's on-premise selected-user pilot and FridayGPT cloud contributions as separate workstreams, plus exploratory prototypes where supported.
- The shared early-client subgroup with AI.skilled, ShebangNow and Traveln.ai detail, keeping individual dates/stages unknown where unconfirmed. AskAI remains an explicitly unresolved record, not a fabricated engagement.
- Savencia causal work and communication of recommendations; Mobile Arts requirements/ML delivery; Decentra's edge work and narrow benchmark; early internships/university projects with accurate classifications.
- Supported personal/academic work such as Bobine, CopyAlpha, Research to Voice, snow-coverage forecasting, licence-plate recognition, exercise/pose tools and medical/dental collaboration. Preserve distinctive details from historical records with their source status; no invented publication, deployment, revenue or returns.

The private master may retain legitimate technical detail, measurement context and existing private-to-public identity mappings from the evidence bank. It must also state which details are unsuitable for automatic public reuse. The user's permission to keep existing website assets is recorded as a dated presentation choice, not a general publication licence for every private client detail.

### Inventories metrics and evidence status

Use stable credential/event/project IDs where available, and retain aliases/legacy routes as private history. Reconcile rather than silently replace inventories:

- Credential totals derive from unique current records, with categories and issuers. The old 52-record list remains a dated snapshot. Claude is distinct from its courses; AWS enablement badges are distinct from professional exams; renewals do not become duplicate credentials.
- Every current website event and every legacy MasterFile event has a disposition. A retired public page does not delete the historical experience. Keep event dates, announcements, programme periods and case engagement periods distinct. A speaker promotion is not another talk.
- Record all current articles and personal products with their actual state. Correct the contradictory four/eleven blog totals and outdated framework labels; do not call future `/work/` pages or engineering refactors implemented until they exist.
- Keep quantitative claims with their original meaning: revenue comparison versus profit, model/device FPS versus an entire pipeline, competition funding pool versus money raised, sessions versus unique people, and dated API-call estimate versus complete current cost.
- Retain confidential metrics only where the evidence permits private retention; preserve the instruction that MOPO metrics remain confidential without seeking or inventing missing numbers. The private Mobile Arts record may preserve its supported comparison/context while the handoff's public wording remains qualitative.
- Issuer links/current website entries establish attributed records, not a fresh issuer verification. Store observed issue/expiry, source date and verification status; leave disputed expiry evidence visible as a narrow gap.

Use readable status labels such as directly confirmed, source-documented, historical user-reported, currently reported publicly, unresolved, planned, locally verified and deployed. Apply them where they change interpretation, especially dates, metrics, credentials and implementation state. Avoid cluttering every biographical sentence with redundant labels.

Resolve or explicitly disposition these concrete findings:

| Finding | Required reconciliation |
| --- | --- |
| 64 event rows in the legacy Master versus 65 current website records | Add the missing August student webinar from its actual source and reconcile every row; do not inflate speaking totals |
| Four newer credential records absent from the old 52-entry inventory | Add/reconcile the current records with their types, issuer links and verification status, retaining the old list as history |
| Azure credential label/link mapping discrepancies flagged in the audit | Check each link against its intended title/document before correcting; preserve old URLs in the dated snapshot, not as a second current qualification |
| Four versus eleven article totals | Reconcile the complete current article inventory and preserve publication history |
| Thirteen versus fourteen country-count descriptions | Reconcile named locations and the meaning of each count; prefer the supported list over an unsupported aggregate |
| MinervaHub placed among personal/university projects | Move the current record to the confirmed advisory engagement and preserve the old contextual description as history |
| Legacy capstone score, moderation recall and detailed downstream application stacks | Preserve useful detail with its actual source and measurement/publication limits; do not silently delete it or upgrade it to newly verified achievement |

An unresolved issuer/link or count basis gets a named gap and safe presentation, not an invented resolution. None of these checks requires asking again for project facts already established by the direct confirmations.

### TODO blog guidance and media maintenance

`TODO.md` becomes the active execution/evidence backlog. Each entry has a concrete action, related record/file, priority or phase, status and acceptance evidence. Separate unresolved facts from unfinished implementation and optional editorial ideas. Close an item only when the evidence/change exists; a planned action is not completion. Preserve a dated completed section or link to the update log rather than deleting all history. Replace the old Claude-specific promise to ask before every execution with the actual authorised workflow: follow the user's current scope, progress routinely and ask only for genuinely missing material information.

Expand `blogs/BlogInstructions.md` while retaining its direct, clean, opinionated voice. Add rules for specific titles, coherent arguments, evidence for precise claims, primary-source links, quote/attribution accuracy, dated model/pricing claims, honest first-person experience, private-client boundaries, no em dashes in newly authored prose, article metadata and publication-versus-update history. Include the concrete article worklist in this plan by reference, with its status tracked locally. Do not sanitise the writer's personality into generic corporate copy or require a blanket fact-check of every archived sentence before unrelated website work can ship.

`MediaGuide.md` documents the actual current originals and source ownership, naming conventions, accepted image formats, responsive derivatives, sharing-image workflow, exact CV asset sources, commands and verification. Reconcile its old empty checkboxes against files that actually exist. Explicitly preserve approved customer originals/URLs and distinguish that permission from permission for new disclosures. Keep any proposed pipeline behaviour marked planned until implemented and verified.

### Preservation private delivery and validation

Before overwriting active Knowledge files, take a dated snapshot of the pre-existing active tree and record hashes/sizes. Store immutable original copies at `Knowledge/_archive/<UTC-revision>/files/<original-relative-path>` and a fixed `baseline.json` alongside `files/`. Store the separate after-manifest, disposition/coverage report and verification report under `Knowledge/_updates/<UTC-revision>/`. Hash only the explicitly inventoried content files; manifests/reports exclude themselves from hash coverage. Build the input list before creating outputs and exclude all prior/current `_archive/` and `_updates/` trees from recursive re-copying. Record symlinks as links and do not follow them outside Knowledge. Preserve relative paths and original metadata/content; never rewrite old frontmatter to make a snapshot appear current. Record its superseded status in the archive index/update log instead.

Keep `Knowledge/*` ignored. Do not force-add the private folder, copy it into `public/`, publish it as a Pages artifact, or let application code, route generation, build hooks or copy/glob steps import/read/ingest **any part of Knowledge**. Local private verification tools are separate from the public build. Public customer-asset permission does not change this boundary.

Execute a build-independence check in an isolated candidate-source checkout/copy with Knowledge absent, leaving the original private folder untouched. Include intended new application source files if the candidate is not yet committed; record the exact source revision/tree manifest, dependency/toolchain versions, commands and results. Run the candidate's frozen install, build and artifact checks there, with only the required public build configuration. Do not claim independence solely from a text search or a normal workspace build that can still see Knowledge. Keep the report locally in the update directory. Local reconciliation can separately compare public factual fields with the typed public data; private detail does not flow automatically into the site.

Delivery must include a local file inventory and before/after manifest inside the private Knowledge workflow, plus a concise non-sensitive summary in the normal handoff. Reopen the actual files at their requested paths, verify representative detailed sections and sources, check local links and report completion independently of Git status. If the future implementation runs in a checkout lacking Knowledge or the evidence kit, record the missing local-delivery dependency rather than claiming a committed code change updated private files elsewhere.

Track C acceptance requires:

- Every existing active Knowledge file is updated or explicitly retained with a justified disposition; no nested file is overlooked.
- The old tree is recoverable from a verified dated snapshot with matching original hashes.
- The new MasterFile covers all 21 legacy subject areas and the newer detailed engagements, preserves unique supported material, and is materially complete on its own.
- Current chronology, relationships, classifications, stages and public-wording limits agree with the latest confirmed sources and public factual model.
- Current credential, event, article and project inventories reconcile with their sources; historical snapshots remain labelled history and duplicates/contradictory counters are resolved.
- Every concrete finding in the reconciliation table has a resolved or explicit-gap disposition, including the missing webinar, newer credentials/link mapping, article/country counts, MinervaHub classification and legacy metric/stack evidence.
- The Master contains all four canonical CV artifacts with source/revision/hash and presentation rules, distinguishing archives and confirmed submissions without changing the artifacts.
- Important sources, date meanings, measurement limits, current user preferences and unresolved questions are explicit. No fabricated facts or unsupported current claims fill gaps.
- README, Sources, Update_Log, TODO, BlogInstructions and MediaGuide agree on the current workflow, source authority and implemented-versus-planned state.
- C1 facts/evidence reconciliation is checked before final public copy; C2 website/asset/command/architecture fields are reconciled after implementation checks.
- All Knowledge content remains outside public output and ordinary Git staging; an executed isolated-source build with the folder absent proves public-build independence.
- Ignored-file writes are proven by actual file reads, hashes and a local manifest. A clean Git diff is not accepted as proof of Knowledge completion.

Updating the MasterFile does not alter persistent Codex memory or the external career kit. Those are separate stores; this scope concerns the repository's Knowledge folder and its source-backed maintenance.

## 20. Plan review and completion standard

Review the plan in separate passes: factual coverage against every brief change ID; implementation against the real static-export architecture; public-output/privacy failure cases; and visitor flows/accessibility at desktop/mobile sizes. A final independent review should challenge missing dependencies, unsupported assertions and anything that could make a green build misleading.

### Completed review record

Three parallel reviewers audited architecture, career/content evidence and user experience, then challenged and re-reviewed the draft. Further passes covered the asset-retention clarification, deeper code/architecture findings and the newly required complete Knowledge refresh. This revision incorporates those findings and resolves the final scope comments.

| Review | Corrections incorporated | Final verdict |
| --- | --- | --- |
| Architecture and publishing | Static-host migration, measured payload boundaries, versioned on-demand search, server content composition, image collisions/encode reuse, scoped output checks and retained assets | No remaining substantive blocker; toolchain candidate has an implementation-stage frozen-install/full-build gate |
| Evidence and editorial | All brief changes/eight routes, exact CV hashes, bounded claims, 11-article worklist, asset-retention exception, validated content/calendar/renderer boundaries and explicit A/B release scope | Final comments resolved: stale denylist wording removed and broader telemetry/progress work separated from the factual release |
| UX and accessibility | Responsive hierarchy, modal/focus contracts, gallery settling, stable motion identity, ref/cancellation correctness, theme/image error states and preserved globe/page-entry behaviour | Ready for implementation; no remaining substantive UX blocker |
| Knowledge completeness and local delivery | All 21 legacy subject areas, newer detailed evidence, four canonical CV artifacts, source identity/provenance, concrete inventory discrepancies, immutable snapshots and isolated builds without Knowledge | Both content/evidence and architecture reviewers confirmed no remaining blocker after the final corrections |

Final mechanical review covers all **60 named brief change IDs** and **eight case routes**, with the newer customer-asset permission explicitly overriding conflicting requirements and the complete Knowledge refresh added as required scope. Markdown fences are balanced and both approved CV hashes match the current local files. The unchanged application baseline passed lint/type/build/export checks in the initial audit; no application tests are claimed for unimplemented refactors. Only this planning documentation changed. No website implementation, Knowledge rewrite, external career-kit update or deployment is claimed.

The planning task is complete when the architecture choices, change scope, file ownership, migration treatment, evidence fallbacks and acceptance gates are concrete enough to implement without rediscovering fundamental decisions. The professional content release is complete after Track A and its authorised delivery checks pass. The full scheduled update is complete only after Tracks A, B and C pass their applicable gates, including the complete local Knowledge refresh; deferred profiling ideas are not silently treated as required work.

Do not claim 200% certainty. The useful standard is explicit coverage, independent review, measurable release gates and honest separation of confirmed facts from unresolved evidence.
