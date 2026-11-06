# AI-DLC for this website

AI-DLC is the default for all work in this repository. Describe the outcome normally; no special phrase, citation or command is required. The owner's instruction applies to content, visual design, development, fixes, reviews, testing, dependencies, security and operations.

## Persistent entrypoints

`AGENTS.md` is the primary repository instruction. `CLAUDE.md`, `.github/copilot-instructions.md` and the always-on Cursor rule point agents back to it. The native Codex integration adds project onboarding, skills, agents and hooks. These files are committed so the policy survives new sessions and clones.

Read `.codex/onboarding.md` and `.agents/skills/aidlc/SKILL.md` when beginning work. Read only the additional methodology files the selected workflow needs. Resume relevant existing work, or select the smallest supported workflow that covers the request. Record requirements, decisions, implementation, verification and delivery evidence; do not manufacture stage completion or human approval.

The upstream native integration is configured for Codex. A different harness may be configured with the same pinned `aidlc config --harness <name> --yes` after inspecting its generated changes. The lightweight instruction bridges do not install that harness's native hooks.

## T3 and other hosts without project hooks

This repository is also edited through T3 Code. T3 does not have a documented upstream AI-DLC adapter. A host can read `AGENTS.md` while not loading `.codex/config.toml`, native skills or hooks. In that case the agent must read the local onboarding and methodology itself and use the same lifecycle:

1. Establish the request, acceptance criteria, current repository context and relevant existing evidence.
2. Choose a workflow and depth, and explain any omitted stages. Keep the plan proportional to the change.
3. Implement the authorized work, preserving decisions and traceability.
4. Verify the result with the appropriate repository checks and review findings.
5. Record delivery, remaining risks and operational status; resume unfinished work when requested.

Keep a concise, public-safe record in `docs/` for work that needs durable evidence. Pure questions and read-only reviews can carry their evidence in the response. Existing plans and reports may be extended instead of creating duplicate paperwork. This is **methodology mode**, not a claim that engine hooks ran or that engine approval receipts exist. Use the native engine when the host supports it; never simulate a human answer or disable a gate to make a workflow look complete.

Automatic adoption grants permission to start and apply the process. The current user request remains the source of scope and delivery authority. It does not authorize future merges or publication by itself. Ask only for a material missing decision or a genuine engine gate; honor authorization already given.

## Installation and maintenance

The stable upstream release is pinned in `.aidlc-version`. The native executable and all-harness runtime are installed per user, outside Git. The project contains the generated Codex shell and shared `aidlc/` methodology workspace. Website CI requires neither the native executable nor AI credentials.

See the [versioned upstream installation guide](https://github.com/awslabs/aidlc-workflows/blob/v2.11.3/docs/guide/harnesses/codex-cli.md) for installation, project refresh and hook trust. Use `sh scripts/setup-aidlc.sh` for another clone (Python 3.11+, curl and SHA-256 tools required). It verifies the versioned installer, configures the pin and Codex shell, and seeds this project's hook trust while backing up and preserving other user settings. Run `aidlc doctor` from the repository root after setup or an update.

Updates are deliberate: select and review a stable release, update the pin, refresh generated files, renew hook trust if identities changed, and run the repository checks. Do not track upstream `main` or silently auto-upgrade between tasks. Preserve the user's provider, model and permission choices.

## Public repository and build boundaries

The website publishes only `out/`. Keep agent files, methodology, intent records, logs and transcripts out of `public/`, `src/`, `content/`, search, sitemap and LLM output. TypeScript and ESLint exclude the framework directories; the export verifier rejects workflow files in a published artifact.

`Knowledge/` stays ignored and private. Luna authoring inputs, credentials, recovery keys, plaintext catalogs, original media and unlocked screenshots remain in an external private directory. Never copy them into AI-DLC knowledge, intent records, handoffs, audit shards or public documentation. The public-repository ignore policy keeps raw intent records, knowledge, code knowledge, logs and machine-local state local, overriding the generated block's suggestion to commit all records. Put deliberately sanitized, durable evidence in docs/ instead. Review and sanitize any deliberately committed evidence; a public Git repository is not a safe transcript archive.

Run `pnpm check:aidlc` to verify the persistent configuration without executing hooks. Run the normal checks in README.md for changes to the site or its build. CI checks the adoption configuration before testing and building the website.

## Sources

- [AWS AI-DLC workflows](https://github.com/awslabs/aidlc-workflows)
- [Pinned release](https://github.com/awslabs/aidlc-workflows/releases/tag/v2.11.3)
- [Codex integration](https://github.com/awslabs/aidlc-workflows/blob/v2.11.3/docs/guide/harnesses/codex-cli.md)
- [Codex repository instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
