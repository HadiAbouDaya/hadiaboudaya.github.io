# Hadi Abou Daya's portfolio

A static Next.js portfolio for AI consulting and engineering work. It is exported to GitHub Pages; there is no application server.

## Local development and review

Use Node 22 and pnpm 11.1.2.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

To review the production artifact:

```sh
pnpm test:tooling
pnpm test:runtime
pnpm lint
pnpm typecheck
pnpm build
pnpm preview --port 3000
```

`pnpm check:build` rechecks an existing `out/` artifact. `pnpm start` also serves the static export. The preview supports real 404 responses, PNG/PDF MIME types, and media byte ranges. It is bound to loopback by default.

## Content and relationships

- `src/data/profile.ts`: public identity and exact bilingual CV downloads.
- `src/data/experience.ts`: professional and education chronology, with consulting engagements nested under one independent practice. Month dates express engagement periods. Professional entries sort by end month.
- `src/data/work.ts`: eight project evidence records connected to engagement IDs. Project search results and public profile text point to `/experience/#project-{slug}`; role links use `#exp-{id}`. The catalog has no standalone public routes. Optional product-acquisition records keep buyer, month, continuation and product link separate from the engagement period; Experience, the Home consulting highlight, search and public profile text derive their wording from that shared record.
- `src/data/skills.ts`: capabilities linked to delivery evidence.
- `src/data/certifications.ts`: professional certifications, programmes, courses and enablement badges. Counts are derived.
- `src/data/events.ts`: events and milestones with explicit date precision and meaning. An announcement or recorded month is not an exact launch date.
- `content/blog/*.mdx`: dated articles with validated YAML and an optional editorial `updatedAt`. The renderer permits Markdown/GFM and literal code examples; executable expressions, imports and arbitrary JSX are rejected.

Experience, article content and event details render on the server at build time. Small client components handle filtering, search, galleries and preferences. There is one responsive Experience tree and each engagement anchor is unique. Education and short role contributions are visible directly. Consulting clients are visible articles, and each of the eight projects shows its stage and purpose before a single native contribution/outcome disclosure. Project anchors target focusable sections and open their child disclosure when requested. Project evidence remains available through Experience search results and the generated public profile text. The retired Work hub and eight detail paths must not export.

Experience filters persist in `?view=professional|education`, with Back/Forward restoring the selected view. `src/lib/experience-presentation.ts` avoids duplicate narratives while retaining unique additional work; `experience-navigation.ts` handles URL state. The export contract rejects nested and education disclosures.

Search fetches a public projection from `/search-index.json` when opened. The root passes only its content revision. `/llms.txt`, `/llms-full.txt`, the sitemap and `/og-default.png` are static generated routes. Shared metadata includes the sharing image explicitly because nested Next metadata objects replace inherited values.

## Media and CVs

Keep existing media originals and URLs. The image pipeline selects owners for colliding source stems, caches equivalent transforms by content and settings, and emits every existing responsive width URL. See [build-tool documentation](scripts/README.md).

The PDFs in `public/cv/` are exact approved artifacts, verified by SHA-256. Change the register and verification hashes only when replacing them with newly approved source files. Do not regenerate them during website builds.

## Private authoring records

`Knowledge/` is ignored and maintained separately. App code, builds and CI must work without it and must never import, copy or publish it. It is not part of the public content ingestion path. TypeScript and ESLint explicitly exclude it, including private source archives. Local preservation manifests and evidence records stay there.

## Analytics and contact

Analytics is optional through `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`. It is disabled on loopback previews and the personal page. The integration uses deliberate events, memory-only persistence and no automatic capture or session recording. Contact values and raw search queries are excluded. Formspree handles visitor-submitted contact messages; local validation tests do not submit messages.

## Dependency maintenance

The release uses Next 16.4.2, React 19.3.1 and Sharp 0.35.5 with a frozen lockfile. Article frontmatter uses the YAML parser directly: executable engines, duplicate keys, custom tags and aliases are rejected. The typography plugin uses the patched selector parser through `pnpm-workspace.yaml`; pnpm 11 reads overrides there.

The production dependency audit passed with zero advisories on 19 October 2026. The full audit retains one development-only `braces` advisory ([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)) through the Next lint plugin. No patched package is published; its patterns come from repository-controlled lint configuration, and it is absent from the browser export. Recheck when updating the lint toolchain. ESLint remains on the compatible 9.x line for this release.

## Publication

The GitHub Pages workflow validates the frozen install, tests, lint, types and export before publishing. A push to `main` or a manual workflow dispatch starts that workflow. Use the local preview for review; deploy only when explicitly requested.
