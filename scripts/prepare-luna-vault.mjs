// Local authoring tool. The public build consumes only its encrypted output.
import { mkdir, readFile, readdir, writeFile, rename, mkdtemp, rm, stat, realpath } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { createVaultSession, sealVaultObject } from "./lib/luna-encryption.mjs";
import { validateManifest, validateVaultConfig } from "../src/lib/luna-vault.ts";

export async function prepareVault({ photosDir, privateDir, destination = "public/luna/vault" }) {
  const repository = process.cwd();
  for (const directory of [photosDir, privateDir]) {
    if (!directory || !path.isAbsolute(directory)) throw new Error("Private authoring directories must be absolute paths outside the repository");
    const resolved = await realpath(directory);
    if (resolved === repository || resolved.startsWith(repository + path.sep)) throw new Error("Private authoring directories must stay outside the repository");
  }
  const access = await stat(path.join(privateDir, "access.json"));
  if (access.mode & 0o077) throw new Error("Restrict the private access file permissions");
  const { passphrase } = JSON.parse(await readFile(path.join(privateDir, "access.json"), "utf8"));
  const albumInput = JSON.parse(await readFile(path.join(privateDir, "album-content.json"), "utf8"));
  const chapterInput = JSON.parse(await readFile(path.join(privateDir, "chapters.json"), "utf8"));
  const birthdayInput = JSON.parse(await readFile(path.join(privateDir, "birthday-content.json"), "utf8"));
  const session = await createVaultSession(passphrase);
  const temporary = await mkdtemp(path.join(os.tmpdir(), "private-album-"));
  let files = 0, totalBytes = 0;
  try {
    const sealedDir = path.join(temporary, session.config.release);
    await mkdir(sealedDir, { mode: 0o700 });
    const writeObject = async (buffer, mime, dimensions) => {
      const sealed = await sealVaultObject(session, buffer, mime, dimensions);
      await writeFile(path.join(sealedDir, sealed.asset.id + ".bin"), sealed.buffer);
      files++; totalBytes += sealed.buffer.length;
      return sealed.asset;
    };
    const sources = (await readdir(photosDir)).filter(name => /\.jpe?g$/i.test(name)).sort();
    if (!sources.length || sources.length !== Object.keys(chapterInput.mapping).length) throw new Error("Chapter mapping does not cover the source collection");
    const photos = [], byFilename = new Map();
    for (const filename of sources) {
      const group = chapterInput.mapping[filename];
      if (!chapterInput.chapters.some(chapter => chapter.id === group)) throw new Error("Unassigned photograph");
      const source = await readFile(path.join(photosDir, filename));
      const oriented = sharp(source).rotate().toColourspace("srgb");
      const variants = {};
      for (const [variant, size, quality] of [["thumb", 480, 76], ["medium", 960, 80], ["full", 1920, 82]]) {
        const { data, info } = await oriented.clone().resize({ width: size, height: size, fit: "inside", withoutEnlargement: true }).webp({ quality }).toBuffer({ resolveWithObject: true });
        variants[variant] = await writeObject(data, "image/webp", { width: info.width, height: info.height });
      }
      const photo = { id: crypto.randomUUID(), group, alt: albumInput.photoDescriptions?.[filename] ?? `A memory from ${chapterInput.chapters.find(chapter => chapter.id === group).title}`, width: variants.full.width, height: variants.full.height, ...variants };
      photos.push(photo); byFilename.set(filename, photo);
      if (photos.length % 40 === 0) console.log(`Prepared ${photos.length} encrypted photographs`);
    }
    const assets = {};
    for (const filename of (await readdir(path.join(privateDir, "birthday-media"))).sort()) {
      if (!/\.(?:webp|mp3)$/i.test(filename)) continue;
      let buffer = await readFile(path.join(privateDir, "birthday-media", filename)), dimensions;
      if (filename.endsWith(".webp")) {
        const { data, info } = await sharp(buffer).rotate().toColourspace("srgb").webp({ quality: 90 }).toBuffer({ resolveWithObject: true });
        buffer = data; dimensions = { width: info.width, height: info.height };
      }
      assets[filename.replace(/\.[^.]+$/, "")] = await writeObject(buffer, filename.endsWith(".mp3") ? "audio/mpeg" : "image/webp", dimensions);
    }
    const manifest = {
      version: 1,
      album: { title: albumInput.title, subtitle: albumInput.subtitle, coverIds: albumInput.coverFilenames.map(name => byFilename.get(name)?.id).filter(Boolean) },
      chapters: chapterInput.chapters.map(({ id, title, dateLabel, source, coverFilename, order }) => ({ id, title, dateLabel, source, coverId: byFilename.get(coverFilename)?.id, order })),
      photos,
      birthday: { ...birthdayInput, assets },
    };
    validateManifest(manifest);
    session.config.manifest = await writeObject(Buffer.from(JSON.stringify(manifest)), "application/json");
    validateVaultConfig(session.config);
    await mkdir(destination, { recursive: true });
    // Existing encrypted releases stay available for visitors with cached config files.
    await rename(sealedDir, path.join(destination, session.config.release));
    const configPath = path.join(destination, "config.json");
    await writeFile(configPath + ".new", JSON.stringify(session.config) + "\n");
    await rename(configPath + ".new", configPath);
    await writeFile(path.join(privateDir, "release-backup.json"), JSON.stringify({ config: session.config, rawKey: Buffer.from(await crypto.subtle.exportKey("raw", session.key)).toString("base64"), manifest }, null, 2), { mode: 0o600 });
    return { photographs: photos.length, chapters: manifest.chapters.length, encryptedObjects: files, encryptedBytes: totalBytes, release: session.config.release };
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, index, values) => { if (value.startsWith("--")) pairs.push([value.slice(2), values[index + 1]]); return pairs; }, []));
  prepareVault({ photosDir: args.photos, privateDir: args["private-dir"], destination: args.destination ?? "public/luna/vault" }).then(result => console.log(JSON.stringify(result))).catch(error => { console.error(error.message); process.exitCode = 1; });
}
