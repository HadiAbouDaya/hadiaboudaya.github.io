# AI-DLC adoption — 6 November 2026

## Request and acceptance

Adopt the AWS AI-DLC workflow for every future website task without requiring a reminder or explicit invocation. First finish outstanding PRs.

| Requirement | Implementation and evidence |
| --- | --- |
| Start from merged work | GitHub connector and CLI both reported zero open PRs. Existing PRs 1–8 were already merged; local main matched origin/main at 74e27e7. |
| Adopt the official framework reproducibly | Installed stable 2.11.3 with the official installer after SHA-256 and release-provenance verification. Committed the project pin, full Codex projection, upstream manifest and license. |
| Activate automatically | Root AGENTS.md specializes invocation wording so an ordinary website request starts the process. Claude, Copilot and Cursor instruction bridges point to that policy. Shared project memory records the decision. |
| Preserve honest lifecycle evidence | docs/ai-dlc.md defines proportional requirements, decisions, construction, verification and delivery. This bootstrap ran in T3 methodology mode; no native workflow gate receipts or native chat hook execution are claimed. |
| Complete one-time native preparation | Configured Codex and seeded its 11 project-specific hook trust identities. Trust validation passes; the helper preserves unrelated settings and backs them up before a change. Re-running setup preserves project rules and trust. |
| Protect the public/private boundary | Raw intent/knowledge/codekb records and machine state remain ignored; sanitized evidence stays in docs/. Framework directories are excluded from website type/lint scans. Export verification rejects workflow files while allowing public AI-DLC prose and media. |
| Detect configuration drift | pnpm check:aidlc verifies the pin, entrypoints, all 403 upstream file hashes and build/privacy exclusions. The existing CI workflow runs it before website tests. |

## Validation

- `pnpm check:aidlc`: passed, including after a full setup rerun.
- `pnpm test:tooling`: 65 passed, including export leakage and hook trust safety tests.
- `pnpm test:runtime`: 16 passed.
- `pnpm lint` and `pnpm typecheck`: passed.
- `pnpm build`: passed; 90 HTML pages verified, public content checks passed, no plaintext private media detected.
- `aidlc config trust --check`: passed.
- `aidlc doctor`: zero problems. Advisories identify user-local PATH, hooks not yet exercised by a native Codex chat, and deliberately ignored raw records. Commit status is transient until this change lands.
- Local browser checks: the bundled Playwright Chromium is absent. Installed Brave/Chromium passed 18 no-JavaScript route/viewport checks, all 11 public interaction scenarios and search recovery scenarios; the contact test failed waiting for its intercepted error response. This is not a full browser-suite pass. CI installs the supported Playwright Chromium and runs the full suite.

Review found and corrected stale hook identities surviving an upgrade; the regression test now proves replacement of the complete project-specific set, preservation of other projects/settings and idempotence. The installer checksum helper supports both Linux and macOS tools.

## Delivery and operation

Changes are prepared for a checked PR to main under the owner's setup request. The existing GitHub Pages workflow remains responsible for validation and publication. No public content, private vault data, provider credentials or model selection changed. New sessions load the persistent repository policy; the native Codex integration starts its hooks on a new trusted session. T3 continues through the explicitly documented methodology mode where native hooks are not supplied by the host.
