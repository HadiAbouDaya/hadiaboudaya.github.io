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

The 23 October 2026 timeline reconciliation follows the current bilingual CVs and live LinkedIn profile: AWS May–Oct 2026, Independent AI Consulting Jun 2023–May 2026, Supportful Dec 2025–May 2026 and MOPO Jun 2023–Jan 2026. Related start milestones use June 2023 at month precision. The downloadable PDFs are exact copies of those current CVs; earlier reports describe their dated artifacts.

## Private authoring records

`Knowledge/` is ignored and maintained separately. App code, builds and CI must work without it and must never import, copy or publish it. It is not part of the public content ingestion path. TypeScript and ESLint explicitly exclude it, including private source archives. Local preservation manifests and evidence records stay there.

## Analytics and contact

Analytics is optional through `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`. It is disabled on loopback previews and the personal page. The integration uses deliberate events, memory-only persistence and no automatic capture or session recording. Contact values and raw search queries are excluded. Formspree handles visitor-submitted contact messages; local validation tests do not submit messages.

## Dependency maintenance

The release uses Next 16.4.2, React 19.3.1 and Sharp 0.35.5 with a frozen lockfile. Article frontmatter uses the YAML parser directly: executable engines, duplicate keys, custom tags and aliases are rejected. The typography plugin uses the patched selector parser through `pnpm-workspace.yaml`; pnpm 11 reads overrides there.

The production dependency audit passed with zero advisories on 19 October 2026. The full audit retains one development-only `braces` advisory ([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)) through the Next lint plugin. No patched package is published; its patterns come from repository-controlled lint configuration, and it is absent from the browser export. Recheck when updating the lint toolchain. ESLint remains on the compatible 9.x line for this release.

## Publication

The GitHub Pages workflow validates the frozen install, tests, lint, types and export before publishing. A push to `main` or a manual workflow dispatch starts that workflow. Use the local preview for review; deploy only when explicitly requested.

## Encrypted personal space

The personal space has a separate Next root layout and no portfolio styles, fonts, search, theme, or telemetry. Its album and birthday renderer read personal content only after browser decryption. Public navigation, sitemap, search, sharing metadata, and LLM files do not advertise it.

Only opaque encrypted objects and a versioned key wrapper are published under `public/luna/vault`. Photos, thumbnails, the catalog, birthday text, and music use AES-256-GCM with unique 96-bit IVs and authenticated object/release identifiers. PBKDF2-SHA-256 (600,000 iterations and a random salt) derives a wrapping key in a dedicated static worker. The shared passphrase and non-extractable decryption key remain in memory. Lock, refresh, and document history restoration clear the session; no decrypted content is written to browser storage. Public ciphertext can be cached safely. This is content encryption, not identity authentication; a strong random passphrase is required.

Authoring inputs, original media, editable chapter mappings, recovery keys, access instructions, and QA screenshots belong in a private directory **outside this public repository**. The local preparation command reads `access.json`, `album-content.json`, `chapters.json`, `birthday-content.json`, and `birthday-media/` there. It transforms images in memory, converts to sRGB, strips metadata, and writes only ciphertext to the repository:

```sh
node --experimental-strip-types scripts/prepare-luna-vault.mjs --photos /absolute/private/photos --private-dir /absolute/private/authoring
```

Visit chapters are editorial inferences from available capture dates, shared-file dates, and visual context; the private mapping stays editable. Do not automatically treat WhatsApp filename dates as exact capture dates. Retain private originals and recovery material before regenerating. Old encrypted releases remain available for cached configurations; changing a wrapper cannot revoke historical copies or leaked credentials. Previously published birthday material may remain in Git history or others' copies.

The build runs a dedicated private-boundary verifier alongside the existing portfolio contracts. Local full-content and browser checks require the external authoring directory and never belong in public CI:

```sh
LUNA_PRIVATE_DIR=/absolute/private/authoring node --experimental-strip-types scripts/verify-luna-private.mjs
LUNA_PRIVATE_DIR=/absolute/private/authoring node scripts/luna-browser-qa.mjs
LUNA_PRIVATE_DIR=/absolute/private/authoring node scripts/luna-resilience-qa.mjs
```

Browser checks use the static preview at port 4173; `LUNA_TEST_ORIGIN` selects an HTTPS production host, `LUNA_BROWSER=webkit` selects WebKit, and `LUNA_CHROME_PATH` overrides the installed Chrome executable. Install the relevant Playwright browser when needed. Credentials are read locally and failures redact them. Never upload access instructions, plaintext catalogs, recovery backups, or unlocked screenshots to a PR.
