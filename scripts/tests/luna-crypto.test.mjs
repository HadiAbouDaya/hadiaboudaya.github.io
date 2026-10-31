import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { createVaultSession, sealVaultObject } from "../lib/luna-encryption.mjs";
import { unlockVault, decryptVaultObject, validateVaultConfig, validateManifest } from "../../src/lib/luna-vault.ts";

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
