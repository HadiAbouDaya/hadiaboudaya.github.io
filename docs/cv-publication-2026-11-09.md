# Bilingual CV publication, 9 November 2026

## Requirements and decisions

The request is to update the website's English and French CV downloads with the latest approved PDFs. Publish the approved 7 November revisions byte for byte, preserve the existing URLs, and refresh the download version parameters from their SHA-256 hashes. Acceptance requires matching source, public, exported and live PDF bytes, HTTP 200 with `application/pdf`, and updated homepage and contact download links.

Use AI-DLC express at Minimal depth in methodology mode. T3 does not load the native project hooks; engine hooks and gate receipts are unavailable and no engine completion is claimed. No relevant existing CV workflow was found. Requirements, implementation, build verification and publication cover this artifact replacement. Separate product discovery, design, new infrastructure and interaction testing are omitted because the change preserves the existing download components and deployment pipeline. The repository's existing export checks cover the PDF contract; no new test implementation is needed.

## Implementation

Replace `public/cv/HadiAbouDayaCV.pdf` and `public/cv/HadiAbouDayaCV-fr.pdf` with the approved artifacts. Update the SHA-256 register in `src/data/profile.ts` and the independent export contract in `scripts/export-contract.mjs`. Existing components derive their download version parameters from those hashes.

| Language | SHA-256 | Download version |
| --- | --- | --- |
| English | `7dc04b36ea41998dd237af2faea7d9ebd15a7f3a4c3143120a788128a319338e` | `7dc04b36ea41` |
| French | `0faef83fa6db802c5b1f9111a0184188d0ac1f6d1649aae23fa73614f2fc55e2` | `0faef83fa6db` |

## Verification and delivery

Verified locally:

- `pnpm install --frozen-lockfile` and `pnpm check:aidlc` passed.
- All 76 tooling tests and 16 runtime tests passed.
- `pnpm lint`, `pnpm typecheck` and `pnpm build` passed.
- The export verifier checked 90 HTML pages with CSP, public-content projections and encrypted-content boundaries.
- Both approved source PDFs, public copies and exported copies have the hashes above.
- Parsed homepage and contact anchors include both new download versions.
- Before publication, live PDF downloads returned HTTP 200 and `application/pdf` with the older hashes, establishing that publication is required.

The current request authorizes updating the website. This release uses the existing GitHub Pages workflow on `main`, including its browser and accessibility checks. Production download hashes, MIME types and page links are checked after deployment and reported in the task's delivery result.

## Subsequent revision on 9 November

After that release, the owner updated both canonical CVs and requested the website update again. The current approved PDFs replace the preceding hashes in the website and export contracts:

| Language | SHA-256 | Download version |
| --- | --- | --- |
| English | `dc50ef8fcfb98423bd966d4bb7a0e2c02b256186428ae0977ff2dfdc5732a666` | `dc50ef8fcfb9` |
| French | `38768192f5fb4c98d6b4a449be5524ff73452842b33bc0928ec5b23df70699b3` | `38768192f5fb` |

The same minimal methodology mode and omitted stages apply. Local `pnpm check:aidlc`, `pnpm lint` and `pnpm build` passed. The approved, public and exported PDF hashes match; homepage and contact exports contain the new versioned links. The existing Pages pipeline runs its full checks before deployment; production verification is reported in the task delivery result.
