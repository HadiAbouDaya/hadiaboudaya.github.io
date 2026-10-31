// Local authoring only: publish new ciphertext without re-encoding existing photos.
import { readFile, writeFile, readdir, mkdir, mkdtemp, rename, rm, realpath, stat, copyFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import os from "node:os";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { sealVaultObject } from "./lib/luna-encryption.mjs";
import { decryptVaultObject, unlockVault, validateManifest, validateVaultConfig } from "../src/lib/luna-vault.ts";

export async function appendCollection({ privateDir, collectionFile, destination = "public/luna/vault" }) {
  const repository = await realpath(process.cwd());
  const authoring = await realpath(privateDir), definition = await realpath(collectionFile);
  if (authoring === repository || authoring.startsWith(repository + path.sep) || !definition.startsWith(authoring + path.sep)) throw new Error("Keep collection authoring outside the repository in the private directory");
  if ((await stat(authoring)).mode & 0o077) throw new Error("Restrict private directory permissions");
  const backupPath = path.join(authoring, "release-backup.json");
  const backupText = await readFile(backupPath, "utf8"), backup = JSON.parse(backupText);
  const configPath = path.join(destination, "config.json");
  const config = JSON.parse(await readFile(configPath, "utf8"));
  validateVaultConfig(config); validateManifest(backup.manifest);
  assert.deepEqual(config, backup.config, "Private backup differs from the current public release");
  const collection = JSON.parse(await readFile(definition, "utf8"));
  if (!collection.chapter || !Array.isArray(collection.photos) || !collection.photos.length || collection.photos.length > 100 || backup.manifest.chapters.some(chapter => chapter.id === collection.chapter.id)) throw new Error("Invalid or already imported collection");
  const collectionDir = path.dirname(definition);
  const releaseDir = path.join(destination, config.release);
  const key = await crypto.subtle.importKey("raw", Buffer.from(backup.rawKey, "base64"), { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
  const oldCatalog = await readFile(path.join(releaseDir, config.manifest.id + ".bin"));
  const originalBytes = oldCatalog.buffer.slice(oldCatalog.byteOffset, oldCatalog.byteOffset + oldCatalog.byteLength);
  assert.deepEqual(JSON.parse(Buffer.from(await decryptVaultObject(key, config.release, config.manifest, originalBytes)).toString()), backup.manifest, "Recovery key/catalog mismatch");
  const accessPath = path.join(authoring, "access.json");
  if ((await stat(accessPath)).mode & 0o077) throw new Error("Restrict access file permissions");
  const { passphrase } = JSON.parse(await readFile(accessPath, "utf8"));
  const browserKey = await unlockVault(passphrase, config);
  assert.deepEqual(JSON.parse(Buffer.from(await decryptVaultObject(browserKey, config.release, config.manifest, originalBytes)).toString()), backup.manifest, "Passphrase/catalog mismatch");
  const nonces = new Set([config.wrappedKey.iv]);
  for (const name of await readdir(releaseDir)) {
    if (!/^[a-f0-9-]{36}\.bin$/.test(name)) throw new Error("Unexpected vault object");
    const buffer = await readFile(path.join(releaseDir, name));
    const nonce = buffer.subarray(0, 12).toString("base64");
    if (nonces.has(nonce)) throw new Error("Existing nonce collision");
    nonces.add(nonce);
  }
  const temporary = await mkdtemp(path.join(os.tmpdir(), "private-collection-"));
  const session = { config, key, nonces }, pending = [], photos = [], photoByFilename = new Map();
  const firstSequence = Math.max(-1, ...backup.manifest.photos.map((photo, index) => photo.sequence ?? index)) + 1;
  try {
    const seal = async (bytes, mime, dimensions) => {
      const { asset, buffer } = await sealVaultObject(session, bytes, mime, dimensions);
      const name = asset.id + ".bin";
      try { await stat(path.join(releaseDir, name)); throw new Error("Object ID collision"); } catch (error) { if (error.code !== "ENOENT") throw error; }
      await writeFile(path.join(temporary, name), buffer);
      pending.push(name);
      return asset;
    };
    const seen = new Set();
    for (const entry of collection.photos) {
      if (!entry || typeof entry.file !== "string" || seen.has(entry.file) || typeof entry.alt !== "string") throw new Error("Invalid collection photograph");
      seen.add(entry.file);
      const sourcePath = await realpath(path.resolve(collectionDir, entry.file));
      if (!sourcePath.startsWith(collectionDir + path.sep) || !/\.jpe?g$/i.test(sourcePath)) throw new Error("Collection photograph must stay in its private folder");
      const source = sharp(await readFile(sourcePath)).rotate().toColourspace("srgb"), variants = {};
      for (const [variant, size, quality] of [["thumb", 480, 76], ["medium", 960, 80], ["full", 1920, 82]]) {
        const { data, info } = await source.clone().resize({width:size,height:size,fit:"inside",withoutEnlargement:true}).webp({quality}).toBuffer({resolveWithObject:true});
        variants[variant] = await seal(data, "image/webp", {width:info.width,height:info.height});
      }
      const photo = { id: crypto.randomUUID(), group: collection.chapter.id, alt: entry.alt, width: variants.full.width, height: variants.full.height, sequence: firstSequence + photos.length, ...variants };
      photos.push(photo); photoByFilename.set(entry.file, photo);
    }
    const chapter = { ...collection.chapter, coverId: photoByFilename.get(collection.cover)?.id };
    const version = Math.max(backup.manifest.version, chapter.journey ? 3 : chapter.presentation ? 2 : 1);
    const manifest = { ...backup.manifest, version, photos: [...backup.manifest.photos, ...photos], chapters: [...backup.manifest.chapters, chapter] };
    validateManifest(manifest);
    const nextConfig = { ...config, manifest: await seal(Buffer.from(JSON.stringify(manifest)), "application/json") };
    validateVaultConfig(nextConfig);
    // Commit immutable objects first, then atomically switch the catalog pointer.
    // The old catalog stays available to clients with a cached config.
    await mkdir(path.join(authoring, "release-history"), { recursive: true, mode: 0o700 });
    await writeFile(path.join(authoring, "release-history", config.manifest.id + ".json"), backupText, {mode:0o600,flag:"wx"});
    for (const name of pending) await copyFile(path.join(temporary, name), path.join(releaseDir, name), constants.COPYFILE_EXCL);
    const nextBackup = { ...backup, config: nextConfig, manifest };
    await writeFile(backupPath + ".new", JSON.stringify(nextBackup, null, 2), {mode:0o600});
    await writeFile(configPath + ".new", JSON.stringify(nextConfig) + "\n");
    await rename(backupPath + ".new", backupPath);
    await rename(configPath + ".new", configPath);
    return { addedPhotos: photos.length, addedEncryptedObjects: pending.length, photos: manifest.photos.length, chapters: manifest.chapters.length };
  } finally { await rm(temporary, {recursive:true,force:true}); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, index, values) => {if(value.startsWith("--"))pairs.push([value.slice(2),values[index+1]]);return pairs;},[]));
  appendCollection({privateDir:args["private-dir"],collectionFile:args.collection,destination:args.destination ?? "public/luna/vault"}).then(result=>console.log(JSON.stringify(result))).catch(error=>{console.error(error.message);process.exitCode=1;});
}
