// Build-time responsive-image variant generator.
// Walks a root dir (default "out/Media") and, for each raster source image,
// emits -480w.webp / -960w.webp / -1440w.webp variants used by the custom
// next/image loader (src/lib/imageLoader.ts).
//
// Usage: node scripts/generate-image-variants.mjs [root]

import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const WIDTHS = [480, 960, 1440];
const SOURCE_RE = /\.(webp|jpe?g|png)$/i;
const VARIANT_RE = /-\d+w\.webp$/;

const root = process.argv[2] ?? "out/Media";

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
    } else if (SOURCE_RE.test(entry.name) && !VARIANT_RE.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  const sources = await walk(root);
  let written = 0;

  for (const file of sources) {
    const meta = await sharp(file).metadata();
    const base = file.replace(SOURCE_RE, "");

    for (const w of WIDTHS) {
      const dest = `${base}-${w}w.webp`;
      if (existsSync(dest)) continue;

      await sharp(file)
        .resize({
          width: Math.min(w, meta.width || w),
          withoutEnlargement: true,
        })
        .webp({ quality: 75 })
        .toFile(dest);
      written += 1;
    }
  }

  console.log(
    `generate-image-variants: ${written} variant(s) written from ${sources.length} source image(s) in "${root}".`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
