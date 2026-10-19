# Experience interaction and readability review — 19 October 2026

Release status: the user authorised final review and publication on 19 October. The shared heading, scroll effects, transparent logo and compact CV layout are included in the release. See [the final implementation report](implementation-report-2026-10-19.md) for current checks; earlier no-deployment statements below describe their dated snapshots.

Current refinement: the user requested the shared centered page-heading design, removal of the visible inventory sentence/jump panel, and better scrolling motion. These supersede the earlier title/quick-link/static-rail choices below. Existing cinematic panels, consulting hierarchy, visible facts and single project disclosures remain. Native CSS timelines add reversible rail fill, panel/client arrival and chapter emphasis without hiding content or intercepting scrolling; reduced-motion/unsupported browsers retain the static view. Savencia now uses a transparent vector. Current evidence: `Knowledge/_updates/20261019T204905Z-contact-cv-integration/result.json`. No deployment.


The user identified an education disclosure that hid almost no information and requested a complete Experience UI/UX review and fixes. This follow-up keeps the chosen cinematic career line/company panels, existing assets and the corrected 18px desktop / 16px mobile reading size. Publication remains withheld.

## Plan reviewed before implementation

Keep Geist Sans, white `#ffffff` / midnight `#0a0f1a` surfaces, slate `#0f172a` / cool white `#f1f5f9` text, blue `#2563eb` career rail and cyan `#0891b2` client branches. The issue is information architecture and interaction cost, so the palette and overall visual identity stay consistent.

Two approaches were considered:

```text
A: role > expandable contributions > expandable project > narrative
B: role > visible overview / short contributions / methods
        > visible project purpose + stage > expandable contribution / outcome
```

Choose B. Only substantial project narratives earn a disclosure; short education and early-role facts are immediately visible. Consulting clients also become visible articles, so visitors do not need to open a client merely to discover its projects. Keep one reading axis and avoid adding a modal, tab strip, carousel or another content-view switch.

## Findings and fixes

| Issue | Consequence | Fix |
| --- | --- | --- |
| Education disclosure may contain one scholarship line or only tags | A click provides almost no value; the label promises studies/projects that are absent | Render all education information directly |
| Several early roles hide one or two short contributions | Basic career evidence disappears behind repetitive controls | Show short contributions and methods inline |
| Client > contribution > project disclosure hierarchy | Multiple clicks are needed to reach useful evidence | Visible client articles; one disclosure per substantial project |
| Structured contribution bullets repeat the same full project narratives | Readers encounter duplicate facts and inflated page length | Use the complete typed narrative once; retain unique additional work separately and keep unsupported-to-narrative early projects inline |
| Closed project rows reveal little about the underlying problem | Visitors must open each project to decide whether it matters | Show project purpose and delivery stage before the disclosure |
| The project summary repeats the first “need” paragraph inside | Re-reading adds no information | Render the identical paragraph once, in the visible summary; retain every original narrative paragraph |
| Long generic introduction and repeated chronology notes | Useful content starts too far down the page | Shorter header; useful section links; one clear concurrency explanation |
| Quick links cover only three recent employers | Education and the section structure are harder to reach | Link to professional experience, consulting clients and education |
| Generic freelance portrait reused for unrelated client names | The image can be mistaken for the client's logo | Retain original assets, use neutral initials where no specific client logo exists |
| Long line lengths and excessive nested padding | Reading is tiring on desktop and cramped on mobile | Limit reading columns and reduce mobile nesting, preserving 16px prose |
| Expand icons can be small and state labels inconsistent | Clickability and the result of opening/closing are unclear | Native summary controls with clear action/state labels and at least 44px activation height |
| Some fragment targets are nonfocusable sections or hide relevant detail | Navigation and search can land without visible/focused content | Focusable region/client/project anchors and explicit project-detail reveal |
| Unused practice styling and implicit disclosure heuristics | Markup does not reflect actual content needs | Explicit presentation projection and disclosure only at substantive project level |

This removes the generic “accordion for every record” treatment. The distinctive visual structure remains the real consulting parent/client relationship; borders and branches communicate that relationship rather than decorate identical boxes.

## Acceptance

Inspect actual desktop and narrow mobile layouts, education with no disclosures, short roles without extra clicks, all eight project purposes/stages, complete narrative preservation, unique additional contributions, light/dark contrast, keyboard operation, filters, direct fragment/search navigation, and browser back/forward behavior. Run meaningful content/controller regression tests, lint, typecheck and the full static export. Record actual results and any limitations after implementation; preserve previous source and private Knowledge snapshots. No deployment.

## Executed acceptance

Completed locally. All 61 tests passed (45 tooling/content/controller, 16 runtime), with lint, post-build typecheck, static build and diff checks passing. The export contains 87 HTML/CSP pages, 83 professional pages, 163 valid JSON-LD blocks and 165 search records (75,297 bytes); no artifact warnings or private markers. The new release gate enforces zero education disclosures, no nested disclosures, eight single-level project narratives, visible project purpose/stage and focusable destinations. All 36 original narrative paragraphs occur once in the rendered page. Unique AWS Transform/Redshift, other Supportful client applications, MOPO agile delivery and TowardsChange source-integration evidence are retained separately. All nine retired Work paths returned local HTTP 404.

Production browser review covered desktop and actual 320px/390px mobile widths, both themes, visible scholarship/degree information, 16px mobile prose, project touch targets over 44px, direct project links, same-fragment reopening through search, Education-to-project search, keyboard filter movement, filter persistence after reload and Back/Forward view restoration. No horizontal overflow or browser console warnings/errors were observed. Native project disclosure remains keyboard-operable. The temporary viewport and original dark theme were restored.

Visual review also found text bleeding through the fixed header and small navigation buttons. The scrolling Experience header now uses an opaque theme surface. Mobile search/menu and the shared theme toggle have 44px activation targets; the theme placeholder uses the same dimensions to prevent a hydration shift. Disclosure labels now describe substantial contributions/outcomes; short records have no expansion affordance.

Known limits: no repeated isolated dependency install/build, no JavaScript-disabled/media-simulation/print browser execution and no live Core Web Vitals. Earlier raw CDP Network permission denial was respected. Static server content and print/reduced-motion rules are covered by source/artifact inspection, not invented browser scenarios. No push, workflow dispatch or deployment. Actual command logs, exact pre-edit snapshots, source inventory, screenshots and result JSON are private under `Knowledge/_updates/20261019T155720Z-experience-ux/`.

## Logo and CV follow-up

The subsequent user request supersedes the neutral-initial placeholders above. MinervaHub/TowardsChange now use official downloaded marks; the additional consulting group has a neutral Lucide Workflow icon. Shared small boxes are 64px desktop and 52px mobile, with 4% image padding and contained aspect ratios. Tight mobile identities wrap their name below the logo, avoiding orphaned letters. Existing originals remain untouched; the pipeline verifies 269 raster originals and 801 derivatives. Both themes and narrow layouts were visually reviewed. Related Contact CV design/placement and copy cleanup are documented in the current implementation report; current evidence is private under `20261019T201245Z-experience-logos`. No deployment.
