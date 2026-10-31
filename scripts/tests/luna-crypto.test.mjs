import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { createVaultSession, sealVaultObject } from "../lib/luna-encryption.mjs";
import { unlockVault, decryptVaultObject, validateVaultConfig, validateManifest, JOURNEY_MOTIFS, DEFAULT_JOURNEY_THEME } from "../../src/lib/luna-vault.ts";

test("encrypted vault roundtrip, wrong password, tampering, object binding and nonce uniqueness", async () => {
  const password = "synthetic-test-passphrase-never-used-for-real-content";
  const session = await createVaultSession(password);
  const original = new TextEncoder().encode("private synthetic photograph contents");
  const sealed = await sealVaultObject(session, original, "image/webp");
  session.config.manifest = { ...sealed.asset, mime: "application/json" };
  validateVaultConfig(session.config);
  const key = await unlockVault(password, session.config);
  assert.equal(key.extractable, false);
  const bytes = sealed.buffer.buffer.slice(sealed.buffer.byteOffset, sealed.buffer.byteOffset + sealed.buffer.byteLength);
  assert.deepEqual(new Uint8Array(await decryptVaultObject(key, session.config.release, sealed.asset, bytes)), original);
  let workerResult;
  const self = { postMessage: value => { workerResult = value; } };
  vm.runInNewContext(await readFile(new URL("../../public/luna/unlock-worker.js", import.meta.url), "utf8"), { self, crypto, TextEncoder, Uint8Array, atob });
  await self.onmessage({ data: { password, config: session.config } });
  assert.ok(workerResult.key, "Static browser worker must unwrap the same key");
  assert.deepEqual(new Uint8Array(await decryptVaultObject(workerResult.key, session.config.release, sealed.asset, bytes)), original);
  await self.onmessage({ data: { password: "incorrect", config: session.config } });
  assert.equal(workerResult.key, undefined);
  await assert.rejects(unlockVault("wrong-strong-passphrase-for-test", session.config));
  const corrupt = bytes.slice(0); new Uint8Array(corrupt)[20] ^= 1;
  await assert.rejects(decryptVaultObject(key, session.config.release, sealed.asset, corrupt));
  await assert.rejects(decryptVaultObject(key, session.config.release, sealed.asset, bytes.slice(1)));
  await assert.rejects(decryptVaultObject(key, crypto.randomUUID(), sealed.asset, bytes));
  await assert.rejects(decryptVaultObject(key, session.config.release, { ...sealed.asset, id: crypto.randomUUID() }, bytes));
  const second = await sealVaultObject(session, original, "image/webp");
  assert.notEqual(sealed.asset.id, second.asset.id);
  assert.notDeepEqual(sealed.buffer.subarray(0, 12), second.buffer.subarray(0, 12));
  assert.equal(session.nonces.size, 3);
  const changedWrapper = structuredClone(session.config); changedWrapper.wrappedKey.data = changedWrapper.wrappedKey.data.replace(/^./, changedWrapper.wrappedKey.data[0] === "A" ? "B" : "A");
  await assert.rejects(unlockVault(password, changedWrapper));
});

test("invalid cryptographic parameters and album shapes fail closed", () => {
  for (const config of [null, {}, {version: 2}, { version: 1, release: "../private" }]) assert.throws(() => validateVaultConfig(config));
  assert.throws(() => validateManifest({ version: 1, photos: [] }));
});

test("journey catalog accepts legacy albums and fails closed on invalid themes or photo order", () => {
  const asset = { id: crypto.randomUUID(), mime: "image/webp", bytes: 128 };
  const photo = { id: crypto.randomUUID(), width: 800, height: 600, thumb: asset, medium: asset, full: asset, alt: "Synthetic photo", group: "journey", sequence: 0 };
  const chapter = { id: "journey", title: "Synthetic journey", dateLabel: "Undated", source: "fixture", coverId: photo.id, order: 0 };
  const manifest = { version: 1, album: { title: "Synthetic album", coverIds: [photo.id] }, chapters: [chapter], photos: [photo], birthday: { text: {}, assets: {}, photos: [] } };
  for (const version of [1, 2, 3]) assert.doesNotThrow(() => validateManifest({ ...manifest, version }));
  for (const motif of JOURNEY_MOTIFS) {
    assert.doesNotThrow(() => validateManifest({ ...manifest, version: 3, chapters: [{ ...chapter, journey: { ...DEFAULT_JOURNEY_THEME, motif } }] }));
  }
  const themed = { ...manifest, version: 3, chapters: [{ ...chapter, journey: DEFAULT_JOURNEY_THEME }] };
  for (const version of [1, 2, 4]) assert.throws(() => validateManifest({ ...themed, version }));
  for (const change of [{ motif: "unknown" }, { accent: "url(https://example.test/private)" }, { backdrop: "red;display:none" }, { ink: "#123" }, { kicker: "" }, { description: "x".repeat(1001) }, { activeLabel: null }]) {
    assert.throws(() => validateManifest({ ...themed, chapters: [{ ...chapter, journey: { ...DEFAULT_JOURNEY_THEME, ...change } }] }), /Invalid journey theme/);
  }
  for (const sequence of [-1, 0.5, 10_001, "1", null]) {
    assert.throws(() => validateManifest({ ...manifest, photos: [{ ...photo, sequence }] }), /Invalid photograph order/);
  }
});

test("multi-stop trips reject ambiguous membership and sealed collection references", () => {
  const asset = { id: crypto.randomUUID(), mime: "image/webp", bytes: 128 };
  const photos = ["one", "two"].map(group => ({ id: crypto.randomUUID(), width: 800, height: 600, thumb: asset, medium: asset, full: asset, alt: "Synthetic photo", group }));
  const chapters = photos.map(photo => ({ id: photo.group, title: "Synthetic stop", dateLabel: "Undated", source: "fixture", coverId: photo.id, order: 0 }));
  const trip = { id: "trip", title: "Synthetic trip", dateLabel: "Undated", description: "Two stops, one test", coverId: photos[0].id, chapterIds: ["one", "two"], order: 0 };
  const manifest = { version: 3, album: { title: "Synthetic album", coverIds: [], trips: [trip] }, chapters, photos, birthday: { text: {}, assets: {}, photos: [] } };
  assert.doesNotThrow(() => validateManifest(manifest));
  assert.throws(() => validateManifest({ ...manifest, version: 2 }), /Invalid trip grouping/);
  for (const change of [{ chapterIds: ["one", "one"] }, { chapterIds: ["one", "missing"] }, { chapterIds: ["one"] }, { id: "one" }, { coverId: "missing" }, { description: "" }]) {
    assert.throws(() => validateManifest({ ...manifest, album: { ...manifest.album, trips: [{ ...trip, ...change }] } }), /Invalid trip grouping/);
  }
  assert.throws(() => validateManifest({ ...manifest, album: { ...manifest.album, trips: [trip, { ...trip, id: "another" }] } }), /Invalid trip grouping/);
  const presentation = { kind: "sealed", teaser: "Fixture", description: "Fixture", sealLabel: "Fixture", openLabel: "Fixture", closeLabel: "Fixture", revealedNote: "Fixture", exhibitLabel: "Fixture" };
  assert.throws(() => validateManifest({ ...manifest, chapters: [{ ...chapters[0], presentation }, chapters[1]] }), /Invalid trip grouping/);
});
