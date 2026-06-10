// One-time, in-place recompressor for public/Media/**.
// Caps the longest edge at 1600px and re-encodes raster sources to shrink
// the committed originals before the responsive-variant pipeline runs.
//
// NOTE: This script is intentionally NOT part of the build. Run manually:
//   node scripts/optimize-media.mjs [root]

import { readdir, stat, rename, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const RASTER_RE = /\.(webp|jpe?g|png)$/i;
const VARIANT_RE = /-\d+w\.webp$/;
const MAX_EDGE = 1600;
const MIN_BYTES = 50 * 1024; // skip files smaller than 50KB to avoid churn

const root = process.argv[2] ?? "public/Media";

async function walk(dir) {
  const files = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (RASTER_RE.test(entry.name) && !VARIANT_RE.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  const sources = await walk(root);
  let optimized = 0;
  let skipped = 0;

  for (const file of sources) {
    const { size } = await stat(file);
    if (size < MIN_BYTES) {
      skipped += 1;
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    const tmp = `${file}.tmp`;

    let pipeline = sharp(file).resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    });

    if (ext === ".png") {
      pipeline = pipeline.png({ palette: true });
    } else if (ext === ".webp") {
      pipeline = pipeline.webp({ quality: 78 });
    } else {
      pipeline = pipeline.jpeg({ quality: 78 });
    }

    try {
      await pipeline.toFile(tmp);
      await rename(tmp, file);
      optimized += 1;
    } catch (err) {
      await unlink(tmp).catch(() => {});
      throw err;
    }
  }

  console.log(
    `optimize-media: ${optimized} file(s) recompressed, ${skipped} skipped (<${MIN_BYTES} bytes) in "${root}".`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
