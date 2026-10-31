import { randomUUID } from "node:crypto";
import { deriveWrappingKey, keyAAD, toBase64, vaultAAD } from "../../src/lib/luna-vault.ts";

export async function createVaultSession(passphrase) {
  if (typeof passphrase !== "string" || passphrase.length < 24) throw new Error("Use a strong randomly generated passphrase of at least 24 characters");
  const release = randomUUID();
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  const config = { version: 1, release, kdf: { name: "PBKDF2", hash: "SHA-256", iterations: 600_000, salt: toBase64(crypto.getRandomValues(new Uint8Array(16))) } };
  const wrappingKey = await deriveWrappingKey(passphrase, config, ["wrapKey"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrapped = await crypto.subtle.wrapKey("raw", key, wrappingKey, { name: "AES-GCM", iv, additionalData: keyAAD(release), tagLength: 128 });
  config.wrappedKey = { iv: toBase64(iv), data: toBase64(wrapped) };
  return { config, key, nonces: new Set([toBase64(iv)]) };
}

export async function sealVaultObject(session, bytes, mime, dimensions = {}) {
  const id = randomUUID();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const nonce = toBase64(iv);
  if (session.nonces.has(nonce)) throw new Error("Encryption nonce collision");
  session.nonces.add(nonce);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: vaultAAD(session.config.release, id), tagLength: 128 }, session.key, bytes);
  const buffer = Buffer.concat([Buffer.from(iv), Buffer.from(encrypted)]);
  return { asset: { id, mime, bytes: buffer.length, ...dimensions }, buffer };
}
