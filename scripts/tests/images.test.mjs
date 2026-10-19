import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { generateImages, imageInventory } from "../generate-image-variants.mjs";
import { IMAGE_SETTINGS } from "../image-families.mjs";
import { hash, mapLimited } from "../lib/files.mjs";
const image = (width, height, color = "red") => sharp({ create: { width, height, channels: 3, background: color } }).png().toBuffer();
async function fixture() {
  const directory = await mkdtemp(path.join(tmpdir(), "website-image-test-")), root = path.join(directory, "Media");
  await mkdir(root); return { directory, root, cacheDir: path.join(directory, "cache") };
}
test("colliding families fail before writing derivatives without explicit ownership", async () => {
  const f = await fixture();
  await writeFile(path.join(f.root, "same.png"), await image(80, 40));
  await writeFile(path.join(f.root, "same.jpg"), await image(40, 40));
  await assert.rejects(generateImages(f), /Unclassified image-family collision/);
});
test("owner controls dimensions; clamped widths share one encode; originals and URLs survive", async () => {
  const f = await fixture(), owner = await image(80, 40), other = await image(40, 40, "blue");
  await writeFile(path.join(f.root, "same.png"), owner); await writeFile(path.join(f.root, "same.jpg"), other);
  const options = { ...f, owners: { same: "same.png" } }, cold = await generateImages(options);
  assert.equal(cold.encoded, 1); assert.equal(cold.manifest.variants.length, 3);
  assert.equal(hash(await readFile(path.join(f.root, "same.jpg"))), hash(other));
  assert.equal(hash(await readFile(path.join(f.root, "same.png"))), hash(owner));
  for (const width of [480, 960, 1440]) {
    const metadata = await sharp(path.join(f.root, `same-${width}w.webp`)).metadata();
    assert.equal(metadata.width, 80); assert.equal(metadata.height, 40);
  }
  const warm = await generateImages(options);
  assert.equal(warm.encoded, 0); assert.equal(warm.cacheHits, 1);
  assert.deepEqual(warm.manifest, cold.manifest);
  const fresh = await generateImages({ ...options, cacheDir: path.join(f.directory, "fresh-cache") });
  assert.deepEqual(fresh.manifest, cold.manifest);
});
test("source bytes, settings and corrupt cache invalidate transforms despite existing outputs", async () => {
  const f = await fixture(), source = path.join(f.root, "source.png");
  await writeFile(source, await image(100, 50));
  const first = await generateImages(f);
  await writeFile(source, await image(100, 50, "blue"));
  const changed = await generateImages(f);
  assert.equal(changed.encoded, 1); assert.notEqual(changed.manifest.variants[0].sha256, first.manifest.variants[0].sha256);
  const settings = { ...IMAGE_SETTINGS, quality: 40 };
  assert.equal((await generateImages({ ...f, settings })).encoded, 1);
  const { readdir } = await import("node:fs/promises");
  for (const name of await readdir(f.cacheDir)) if (name.endsWith(".webp")) await writeFile(path.join(f.cacheDir, name), "broken");
  assert.equal((await generateImages(f)).encoded, 1);
});
test("family inventory rejects symlinks rather than ingesting external files", async () => {
  const f = await fixture();
  const { symlink } = await import("node:fs/promises");
  await symlink(f.directory, path.join(f.root, "external"));
  await assert.rejects(imageInventory(f.root), /Symbolic link/);
});
test("bounded worker execution respects concurrency and preserves deterministic result order", async () => {
  let active = 0, max = 0;
  const result = await mapLimited([0, 1, 2, 3, 4, 5, 6], 4, async (value) => {
    active++; max = Math.max(max, active);
    await new Promise(resolve => setTimeout(resolve, 5)); active--; return value * 2;
  });
  assert.equal(max, 4); assert.deepEqual(result, [0, 2, 4, 6, 8, 10, 12]);
  await assert.rejects(mapLimited([1], 0, () => 1), /Concurrency/);
});
