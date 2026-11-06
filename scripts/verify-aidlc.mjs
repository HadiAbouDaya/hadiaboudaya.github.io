import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const errors = [];
const read = async (name) => {
  try { return await readFile(path.join(root, name), 'utf8'); }
  catch { errors.push(`Missing required AI-DLC file: ${name}`); return ''; }
};
const requireText = async (name, fragments) => {
  const text = await read(name);
  for (const fragment of fragments) if (!text.includes(fragment)) errors.push(`${name}: missing ${fragment}`);
  return text;
};
const version = (await read('.aidlc-version')).trim();
if (!/^\d+\.\d+\.\d+$/.test(version)) errors.push('AI-DLC must be pinned to a stable release');
let files = 0;
for (const name of ['aidlc-manifest.json', 'aidlc-stamp.json']) {
  try {
    const manifest = JSON.parse(await read(`.codex/tools/data/${name}`));
    if (manifest.frameworkVersion !== version || manifest.distribution !== 'codex') errors.push(`${name}: project/runtime version mismatch`);
    if (name === 'aidlc-manifest.json') {
      if (!manifest.files || Object.keys(manifest.files).length < 1) errors.push('Empty upstream manifest');
      for (const [file, expected] of Object.entries(manifest.files ?? {})) {
        if (!/^(?:\.codex|\.agents)\//.test(file) || file.split('/').includes('..')) { errors.push(`Unexpected manifest path: ${file}`); continue; }
        const content = await read(file);
        if (`sha256:${createHash('sha256').update(content).digest('hex')}` !== expected) errors.push(`Upstream AI-DLC file changed: ${file}; refresh from the pinned release`);
        files++;
      }
    }
  } catch (error) { errors.push(`${name}: ${error.message}`); }
}
await requireText('AGENTS.md', ['AI-DLC is the default', 'docs/ai-dlc.md', 'BEGIN AI-DLC:agents']);
await requireText('CLAUDE.md', ['AGENTS.md', 'docs/ai-dlc.md']);
await requireText('.github/copilot-instructions.md', ['AGENTS.md', 'docs/ai-dlc.md']);
await requireText('.cursor/rules/ai-dlc.mdc', ['alwaysApply: true', 'AGENTS.md', 'docs/ai-dlc.md']);
await requireText('docs/ai-dlc.md', ['methodology mode', 'scripts/setup-aidlc.sh']);
await requireText('aidlc/spaces/default/memory/project.md', ['Apply AI-DLC automatically', 'Knowledge/']);
await requireText('.codex/config.toml', ['developer_instructions', 'AI-DLC']);
await requireText('.codex/trust-seed.toml', ['<PROJECT_DIR>', 'trusted_hash']);
await requireText('.github/pull_request_template.md', ['AI-DLC evidence', 'Verification']);
await read('scripts/setup-aidlc.sh');
await read('scripts/trust-aidlc-hooks.py');
await read('docs/AI-DLC-LICENSE');
const tsconfig = JSON.parse(await read('tsconfig.json'));
const eslint = await read('eslint.config.mjs');
for (const directory of ['aidlc', '.aidlc', '.agents', '.codex']) {
  if (!tsconfig.exclude?.includes(directory)) errors.push(`TypeScript must exclude ${directory}`);
  if (!eslint.includes(`"${directory}/**"`)) errors.push(`ESLint must ignore ${directory}`);
}
await requireText('.gitignore', ['aidlc/.aidlc-sessions/', 'aidlc/spaces/*/intents/', 'aidlc/spaces/*/knowledge/', 'aidlc/spaces/*/codekb/']);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`AI-DLC ${version}: automatic entrypoints, ${files} upstream files and build/privacy boundaries verified`);
