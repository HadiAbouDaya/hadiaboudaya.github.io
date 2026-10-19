# Static build tools

Node 22 and pnpm 11.1.2 are the supported build toolchain. Install all development
build dependencies with `pnpm install --frozen-lockfile`.

- `pnpm test:tooling`: isolated Node tests (no Next build, no public writes).
- `pnpm build`: Next export, image generation, then strict release verification.
- `pnpm check:build`: read-only export verification followed by the application-owned public-content verifier.
- `pnpm preview`: serve `out/`, preserving file MIME types, real 404s and ranges.
  Use `pnpm preview --port 4173 --host 127.0.0.1` (or PORT/HOST environment variables) to select the listener.
- `pnpm test:runtime`: the application owner's article-progress/runtime checks.

## Image contract

`image-families.mjs` selects the authoritative source for colliding stems. All
originals remain untouched, including non-owner originals; every width URL is
still emitted as a normal independent file. Unclassified collisions fail.

`raster-baseline.json` records all 267 tracked originals from Git commit fe66dd6.
The verifier checks source and exported original hashes, all generated dimensions,
source ownership, exact manifest coverage and output hashes. New originals are
included in the generation manifest and compared to public sources as well.

The pipeline defaults to two concurrent source transforms (`IMAGE_CONCURRENCY` overrides it, bounded to 1–16).
Initial four-worker trials used about 623–641 MB peak RSS; two workers reduced that to 475 MB,
with cold generation at 14.5 seconds versus 33.3 seconds for the legacy sequential pipeline. Cache keys
include source bytes, effective width, options, pipeline and Sharp/libvips/WebP
versions. Identical effective transforms share one in-flight encode. Cache blobs
live under `.next/cache/media-variants` and never ship. The deterministic public
`out/image-variants.manifest.json` contains only public-relative paths and hashes;
elapsed time, cache hits and peak RSS are console statistics, not manifest fields.
No source recompression or directory cleanup runs as part of the build.

## Public content integration

There is deliberately no prebuild revision generator or Knowledge dependency.
The application owns its server-only `contentRevision` calculation and the static
`search-index.json` route. The tooling expects schemaVersion 1, contentRevision
and an items array with unique IDs and resolvable public hrefs. The client must
use the same revision and handle mismatches; that runtime behaviour belongs to
the application owner.

Release verification requires the main site routes and absence of the retired
Work hub, eight project detail routes and portal page (their Media files remain
valid). Project search records belong to Experience and link to their precise
`#project-{slug}` anchors; role links use `#exp-{id}`. The full public profile
text retains all project sections and outcomes.
The Experience contract also requires focusable search/region targets, project
purpose and stage visible before expansion, one native details element per
project, no nested disclosures and no education disclosures. Content tests
verify complete narrative preservation and unique additional contributions;
controller tests isolate URL/focus/event boundaries, with real browser checks
recorded separately.
Verification also requires exact approved CV bytes, generated
LLM text and a real 1200x630 PNG sharing image. It also checks every HTML CSP,
unique IDs, internal links/fragments, image source preservation and dimensions.
It does not infer live host status/headers from a local artifact or require
Knowledge files, private evidence or a new CI secret.

Benchmark image-only runs in separate temporary copies, not concurrently with
Next exports. Record cold/warm encodes, wall time and peak RSS separately from
browser-transfer sizes. Keep current production artifacts untouched until the
coordinating owner runs the complete build.

## Measured image-only checks

The temporary report `/tmp/website-image-benchmark-35AI5r/benchmark.json` records
267 originals and 795 physical variants, with byte-identical manifests from two
fresh four-worker generations. Legacy: 33.299 s / 312 MB peak RSS. Four workers:
7.940 s / 623 MB and 8.825 s / 641 MB. Warm cache: 0.326 s, zero encodes.
Changing only the headshot source regenerated exactly two effective transforms
(515 cache hits) in 0.415 s and refreshed every URL in that family.
The sibling `concurrency-comparison.json` records two workers: 14.468 s / 475 MB;
one worker: 28.053 s / 396 MB. These are local measurements, not CI promises.
All checks ran in temporary copies; no benchmark wrote to public/ or out/.
Use `node scripts/benchmark-images.mjs` for a new temporary benchmark, optionally
with `IMAGE_CONCURRENCY=4` to reproduce the original worker limit. It requires
Git history containing the legacy baseline commit fe66dd6.
