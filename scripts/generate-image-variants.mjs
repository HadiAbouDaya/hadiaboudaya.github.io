import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { IMAGE_FAMILY_OWNERS, IMAGE_WIDTHS, IMAGE_SETTINGS } from "./image-families.mjs";
import { filesUnder, hash, slash, mapLimited } from "./lib/files.mjs";
const SOURCE = /\.(webp|jpe?g|png)$/i;
const VARIANT = /-\d+w\.webp$/i;
const ENCODER = { sharp: sharp.versions.sharp, vips: sharp.versions.vips, webp: sharp.versions.webp };
export async function imageInventory(root, owners = IMAGE_FAMILY_OWNERS) {
  const originals = [], families = new Map();
  for (const file of await filesUnder(root)) {
    if (!SOURCE.test(file) || VARIANT.test(file)) continue;
    const name = slash(path.relative(root, file)), buffer = await readFile(file);
    const { width, height } = await sharp(buffer).metadata();
    if (!width || !height) throw new Error(`Image dimensions unavailable: ${name}`);
    originals.push({ path: name, bytes: buffer.length, sha256: hash(buffer), width, height });
    const family = name.replace(SOURCE, "");
    if (!families.has(family)) families.set(family, []);
    families.get(family).push(name);
  }
  if (!originals.length) throw new Error(`No raster sources in ${root}`);
  const selected = [];
  for (const [family, members] of [...families].sort(([a], [b]) => a.localeCompare(b, "en"))) {
    const owner = owners[family] ?? (members.length === 1 ? members[0] : undefined);
    if (!owner || !members.includes(owner)) throw new Error(`Unclassified image-family collision or missing owner: ${family}`);
    selected.push({ family, owner });
  }
  return { originals, selected };
}
export async function generateImages({ root = "out/Media", cacheDir = ".next/cache/media-variants", manifestPath = path.join(root, "..", "image-variants.manifest.json"), concurrency = 2, owners = IMAGE_FAMILY_OWNERS, settings = IMAGE_SETTINGS } = {}) {
  const started = performance.now(), { originals, selected } = await imageInventory(root, owners);
  const byPath = new Map(originals.map((source) => [source.path, source]));
  await mkdir(cacheDir, { recursive: true });
  const transforms = new Map();
  let encoded = 0, cacheHits = 0;
  async function transform(source, effectiveWidth) {
    const key = hash(JSON.stringify({ source: source.sha256, effectiveWidth, settings, encoder: ENCODER }));
    if (!transforms.has(key)) transforms.set(key, (async () => {
      const cacheFile = path.join(cacheDir, `${key}.webp`);
      let buffer;
      try {
        buffer = await readFile(cacheFile);
        const savedHash = await readFile(`${cacheFile}.sha256`, "utf8");
        if (hash(buffer) !== savedHash.trim()) throw new Error("Corrupt cached transform");
        const metadata = await sharp(buffer).metadata();
        if (metadata.format !== "webp" || metadata.width !== effectiveWidth || metadata.height !== Math.round(source.height * effectiveWidth / source.width)) throw new Error("Invalid cached transform");
        cacheHits++;
      } catch {
        buffer = await sharp(await readFile(path.join(root, source.path)))
          .resize({ width: effectiveWidth, withoutEnlargement: settings.withoutEnlargement })
          .webp({ quality: settings.quality }).toBuffer();
        await writeFile(cacheFile, buffer);
        await writeFile(`${cacheFile}.sha256`, hash(buffer) + "\n");
        encoded++;
      }
      const dimensions = await sharp(buffer).metadata();
      return { buffer, sha256: hash(buffer), width: dimensions.width, height: dimensions.height };
    })());
    return transforms.get(key);
  }
  const rows = await mapLimited(selected, concurrency, async ({ family, owner }) => {
    const source = byPath.get(owner), variants = [];
    // Widths are sequential per source: at most concurrency Sharp operations.
    for (const requestedWidth of IMAGE_WIDTHS) {
      const output = await transform(source, Math.min(requestedWidth, source.width));
      const destination = `${family}-${requestedWidth}w.webp`;
      await writeFile(path.join(root, destination), output.buffer);
      variants.push({ path: destination, source: owner, requestedWidth, width: output.width, height: output.height, bytes: output.buffer.length, sha256: output.sha256 });
    }
    return variants;
  });
  const manifest = { schemaVersion: 1, settings, encoder: ENCODER, widths: IMAGE_WIDTHS, originals, families: selected, variants: rows.flat() };
  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  return { manifest, encoded, cacheHits, transforms: transforms.size, milliseconds: Math.round(performance.now() - started), peakRssBytes: process.resourceUsage().maxRSS * 1024 };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  generateImages({ root: process.argv[2] ?? "out/Media", concurrency: Number(process.env.IMAGE_CONCURRENCY ?? 2) }).then(({ manifest, ...stats }) => {
    console.log(JSON.stringify({ images: manifest.originals.length, variants: manifest.variants.length, ...stats }));
  }).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
