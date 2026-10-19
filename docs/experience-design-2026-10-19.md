# Experience redesign — 19 October 2026

Release status: the user authorised final review and publication on 19 October. The shared heading, scroll effects, transparent logo and compact CV layout are included in the release. See [the final implementation report](implementation-report-2026-10-19.md) for current checks; earlier no-deployment statements below describe their dated snapshots.

Current refinement: the user requested the shared centered page-heading design, removal of the visible inventory sentence/jump panel, and better scrolling motion. These supersede the earlier title/quick-link/static-rail choices below. Existing cinematic panels, consulting hierarchy, visible facts and single project disclosures remain. Native CSS timelines add reversible rail fill, panel/client arrival and chapter emphasis without hiding content or intercepting scrolling; reduced-motion/unsupported browsers retain the static view. Savencia now uses a transparent vector. Current evidence: `Knowledge/_updates/20261019T204905Z-contact-cv-integration/result.json`. No deployment.


## Decision and scope

The user rejected the Selected Work tab and the previous Experience layout, then selected: “A cinematic timeline: large company panels connected by a flowing career line, with consulting clients branching beneath the main role.” This supersedes the Selected Work route and presentation decisions in the original implementation plan. All changes remain local; deployment requires a later explicit instruction.

Remove the Work hub and all eight detail routes, navigation entries, calls to action, sitemap entries and public links. Keep the project evidence in a typed local catalog and bring its context into Experience. Preserve customer assets, factual chronology, overlapping engagement dates, the private Knowledge boundary and the existing home globe.

## Visual system

- **Canvas:** existing theme surfaces, white `#ffffff` / midnight blue `#0a0f1a`.
- **Ink:** slate `#0f172a` / cool white `#f1f5f9`.
- **Career line:** blue `#2563eb`, with cyan `#0891b2` used at consulting branches.
- **Panels:** existing raised surface; a restrained blue tint distinguishes recent career chapters. Customer logos keep their original colours on white grounds.
- **Type:** existing Geist Sans. Large tightly spaced company names, normal sentence case roles, small readable dates. No extra font download or decorative monospace labels.
- **Alignment:** left aligned throughout; dates sit on the career rail on desktop and above the panel on mobile.
- **Motion:** the line establishes continuity without perpetual animation. Disclosure chevrons respond to opening; no initial hidden content, blanket entrance animations or scroll interception.

## Layout alternatives reviewed

A. Alternating panels around a central line:

```text
[ company panel ]    │
                     ├── [ company panel ]
[ company panel ] ────┤
```

B. One continuous rail with panels on the same reading axis:

```text
Experience                      [jump to a recent role]
From business questions to working AI systems.

2026   ●────┌ AWS ─────────────────────────────┐
       │    │ role · period · customer pilot   │
       │    │ contribution + expandable detail│
       │    └─────────────────────────────────┘
2023   ●────┌ Independent AI Consulting ───────┐
–2026  │    │                                  │
       │    │  ├── Supportful  [open details]   │
       │    │  ├── MOPO        [open details]   │
       │    │  └── other consulting clients    │
       │    └─────────────────────────────────┘
2025   ●────┌ Savencia ────────────────────────┐
       │    └─────────────────────────────────┘
       │         earlier roles, same rail
```

**Chosen: B.** Alternating cards create a decorative zigzag and reduce room for the substantial consulting evidence. A single reading axis gives the parent/child relationship room to be legible. Dates remain explicit: rail distances do not represent elapsed time, and the practice groups concurrent client engagements.

## Review before implementation

An initial idea used a large year watermark inside every panel. Removed: the dates already belong to the rail, and repeating them would add decoration rather than meaning. Generic metric tiles were also excluded because no defensible cross-career numbers are needed to explain the work.

The distinctive element is the actual career structure: one rail for roles, smaller branches inside the consulting practice. Logos, role names, dates and project evidence carry the rest. Recent AWS, independent consulting and Savencia panels receive more space; older positions retain their full detail in compact disclosures.

## Interaction and content contract

1. Keep the existing small client controller for All / Professional / Education filters, keyboard navigation and explicit fragment reveal. Render facts and panels on the server.
2. A company panel shows identity, role, precise period, location and a concise, source-grounded account of the work. Contributions, methods and project context are native disclosures.
3. Independent consulting remains one parent role, with all five engagements beneath it. Each client has its own logo, period and disclosure. Do not turn concurrent client work into invented separate employment.
4. Reuse the eight project narratives within the matching role or engagement. Keep pilot, production, advisory and research distinctions explicit. No separate Work pages.
5. Search results, event relationships, home highlights and machine-readable profile links lead to Experience anchors. Deep links reveal the correct filter/disclosure and receive focus.
6. On narrow screens, keep one reading axis and a slim rail, remove the date gutter, reduce indentation and prevent long company names or badges from widening the viewport.
7. Keep all content available without JavaScript, usable by keyboard, readable in both themes and printable. Honour reduced motion; do not depend on scroll animations.

## Validation and local handoff

Run content/runtime tests, lint, typecheck and the complete static export. Verify all retired Work routes are absent, no public /work links remain, and project evidence resolves to valid anchors. Review the actual page in a desktop viewport and at a narrow mobile width, including an expanded client, a nested project, filters, deep links and theme changes. Save a review screenshot. Update current repository/Knowledge documentation with this superseding decision and actual verification results; preserve historical evidence and archived originals.

## Typography correction after review

The user found the first implementation too small. Main prose and contribution/project text now use 18px on desktop and 16px at widths up to 600px; client headings use 24px / 20px. Roles, controls and disclosure labels use 16px or more, with dates and supporting metadata at 15px / 14px. Technology labels follow that readable metadata scale. Shared scoped CSS tokens replace the smaller per-element mobile overrides, and project paragraphs use a maximum 68ch line length. No text, imagery, chronology, runtime controller or new animation changed.

The rebuilt export and lint passed. Both desktop and actual 390px mobile screenshots were reviewed. Expanded client/project content remains 16px with no horizontal overflow on mobile. The viewport was reset and the local desktop review left open. This follow-up resolves the earlier mobile screenshot capture limitation; all no-deployment and unexecuted browser-media/print/script-disabled limits continue.

## Superseding interaction review

The user subsequently rejected sparse study/project disclosures and requested a whole-page UI/UX review. [The completed review](experience-ux-review-2026-10-19.md) supersedes the earlier accordion structure: education and short roles are inline, clients are visible articles, project purpose/stage are visible, and only substantial contribution/outcome details expand. The career rail, original media and corrected typography remain. Search/history/focus and mobile header/touch behavior were verified against the current export. Earlier nested-client disclosure descriptions above are preserved design history.
