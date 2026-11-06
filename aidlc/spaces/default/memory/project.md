# Project-Level Rules

## Way of Working

Apply AI-DLC automatically to every task for this website. The owner adopted this policy on 6 November 2026; an ordinary request starts or resumes the appropriate workflow. The user does not need to name AI-DLC. Follow AGENTS.md and docs/ai-dlc.md, and scale the supported workflow to the request.

## Testing Posture

Use the existing checks in README.md and scripts/README.md. Check framework configuration with pnpm check:aidlc. Changes to build boundaries require tooling tests, lint, typecheck and a production export. Interaction changes require relevant browser checks. Never claim checks not run.

## Deployment

GitHub Pages publishes out/ after a push to main. Native AI-DLC tooling and credentials are not needed by CI. Merging and deployment require authorization in the current task; automatic methodology adoption alone is not that authorization.

## Tech Stack

Next.js static export, TypeScript, React, Tailwind. Node 22 and pnpm 11.1.2. Preserve current architecture and toolchain unless the requested change requires otherwise.

## Decided

DECIDED: AI-DLC is the default for all website work, without explicit invocation (owner instruction, 2026-11-06).
DECIDED: Preserve the user's selected provider, model and permissions (installation policy, 2026-11-06).
DECIDED: T3 hosts without the native hooks use explicit methodology mode and never claim engine gate receipts (installation policy, 2026-11-06).

## Forbidden

NEVER copy Knowledge/, Luna secrets, plaintext private catalogs, original private media, recovery material or unlocked screenshots into committed records or published assets.
NEVER put framework tooling, audit logs, transcripts or workflow records into public/, src/ or content/.
NEVER invent human approvals, bypass guards without the user's explicit request, or report unperformed verification as passed.

## Mandated

ALWAYS keep requirements, decisions, implementation, verification and delivery connected with proportionate public-safe evidence.
ALWAYS keep machine state, raw audit logs and transcripts local; sanitize evidence before deliberately committing it.
