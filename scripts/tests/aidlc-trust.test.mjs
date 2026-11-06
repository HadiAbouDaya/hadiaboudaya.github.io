import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const script = fileURLToPath(new URL('../trust-aidlc-hooks.py', import.meta.url));
const project = fileURLToPath(new URL('../../', import.meta.url));

test('hook trust preserves unrelated settings and secrets, backs up once and is idempotent', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'aidlc-trust-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const config = path.join(root, 'config.toml');
  const original = 'model = "existing-model"\n[custom_provider]\ntoken = "fixture-secret"\n[hooks.state."other-project:session_start:0:0"]\ntrusted_hash = "keep-me"\n';
  const obsolete = `[hooks.state.${JSON.stringify(path.join(project, '.codex/hooks.json') + ':obsolete:0:0')}]\ntrusted_hash = \"old-identity\"\n`;
  await writeFile(config, original + obsolete);
  const run = () => execFileSync('python3', [script, '--project', project, '--config', config], { encoding: 'utf8' });
  assert.match(run(), /other settings preserved/);
  const updated = await readFile(config, 'utf8');
  assert.ok(updated.includes(original.trim()));
  assert.ok(!updated.includes('<PROJECT_DIR>'));
  assert.ok(!updated.includes('obsolete:0:0'));
  assert.match(run(), /already matches/);
  assert.equal(await readFile(config, 'utf8'), updated);
  const backups = (await readdir(root)).filter(name => name.includes('.aidlc-backup-'));
  assert.equal(backups.length, 1);
  assert.equal(await readFile(path.join(root, backups[0]), 'utf8'), original + obsolete);
  // Renew a changed identity without duplicating TOML tables or changing other keys.
  await writeFile(config, updated.replace(/sha256:[a-f0-9]{64}/, 'sha256:stale'));
  assert.match(run(), /other settings preserved/);
  assert.equal(await readFile(config, 'utf8'), updated);
});

test('invalid user configuration is never overwritten', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'aidlc-invalid-trust-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const config = path.join(root, 'config.toml');
  const original = 'invalid = [';
  await writeFile(config, original);
  assert.throws(() => execFileSync('python3', [script, '--project', project, '--config', config], { stdio: 'pipe' }));
  assert.equal(await readFile(config, 'utf8'), original);
});
