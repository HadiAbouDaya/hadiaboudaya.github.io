// Local-only full-content verification. Never provide credentials to public CI.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import sharp from "sharp";
import { createHash } from "node:crypto";
import { unlockVault, decryptVaultObject, validateManifest, validateVaultConfig } from "../src/lib/luna-vault.ts";
import { filesUnder } from "./lib/files.mjs";

const privateDir = process.env.LUNA_PRIVATE_DIR;
if (!privateDir || !path.isAbsolute(privateDir) || path.resolve(privateDir).startsWith(process.cwd() + path.sep)) throw new Error("Set LUNA_PRIVATE_DIR to a private directory outside the repository");
const { passphrase } = JSON.parse(await readFile(path.join(privateDir, "access.json"), "utf8"));
const origin = process.env.LUNA_TEST_ORIGIN;
const directory = process.env.LUNA_OUTPUT_DIR ?? "out";
const fetchFile = async name => {
  if (!origin) return readFile(path.join(directory, name));
  const response = await fetch(new URL(name, origin), { cache: "no-store" });
  assert.equal(response.status, 200, `Asset request failed: ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
};
const config = JSON.parse((await fetchFile("luna/vault/config.json")).toString());
validateVaultConfig(config);
const key = await unlockVault(passphrase, config);
const decode = async asset => {
  const name = `luna/vault/${config.release}/${asset.id}.bin`;
  const encrypted = await fetchFile(name);
  if (origin) {
    const local = await readFile(path.join(directory, name));
    assert.equal(createHash("sha256").update(encrypted).digest("hex"), createHash("sha256").update(local).digest("hex"), "Deployed ciphertext differs");
  }
  const buffer = encrypted.buffer.slice(encrypted.byteOffset, encrypted.byteOffset + encrypted.byteLength);
  return Buffer.from(await decryptVaultObject(key, config.release, asset, buffer));
};
const manifest = JSON.parse((await decode(config.manifest)).toString());
validateManifest(manifest);
const backup = JSON.parse(await readFile(path.join(privateDir, "release-backup.json"), "utf8"));
assert.deepEqual(manifest, backup.manifest, "Catalog did not preserve private authoring data");
const assets = [...manifest.photos.flatMap(photo => [photo.thumb, photo.medium, photo.full]), ...Object.values(manifest.birthday.assets)];
let checked = 0, next = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (next < assets.length) {
    const asset = assets[next++], plain = await decode(asset);
    if (asset.mime.startsWith("image/")) {
      const metadata = await sharp(plain).metadata();
      assert.equal(metadata.format, "webp");
      assert.equal(metadata.width, asset.width); assert.equal(metadata.height, asset.height);
      assert.equal(metadata.exif, undefined); assert.equal(metadata.icc, undefined);
    } else if (asset.mime === "audio/mpeg") assert.ok(plain.length > 1000, "Empty audio");
    checked++;
    if (checked % 150 === 0) console.log(`Verified ${checked} encrypted assets${origin ? " on live host" : " locally"}`);
  }
}));
// Detect actual private text/secrets in output, not just recognizable source paths.
const privateText = Object.values(manifest.birthday.text).filter(value => value.length >= 20).concat([passphrase, backup.rawKey, manifest.album.title, manifest.album.subtitle]);
let scanned = 0;
for (const file of await filesUnder(path.resolve(directory))) {
  if (!/\.(html|js|json|txt|xml|css|map)$/.test(file)) continue;
  const text = (await readFile(file, "utf8")).replaceAll("\\u0026", "&").replaceAll("&amp;", "&");
  for (const value of privateText) assert.ok(!text.includes(value), "Private data found in public build");
  scanned++;
}
const result = { origin: origin ?? "local", photos: manifest.photos.length, chapters: manifest.chapters.length, decryptedAssets: checked + 1, scannedPublicFiles: scanned, plaintextLeaks: 0, release: config.release };
await mkdir(path.join(privateDir, "qa"), { recursive: true, mode: 0o700 });
await writeFile(path.join(privateDir, "qa", origin ? "live-assets.json" : "local-assets.json"), JSON.stringify(result, null, 2) + "\n", { mode: 0o600 });
console.log(JSON.stringify(result));
