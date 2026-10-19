import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { verifyExport } from "../verify-build-output.mjs";
import { generateImages } from "../generate-image-variants.mjs";
import { hash } from "../lib/files.mjs";
import { RETIRED_ROUTES } from "../export-contract.mjs";
const csp = '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'">';
async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), "website-export-test-"));
  const options = { outDir: root, requiredRoutes: ["/"], retiredRoutes: ["/retired/"], cvHashes: {}, checkImages: false, checkData: false };
  await writeFile(path.join(root, "index.html"), `${csp}<h1 id="home">Home</h1><a href="/#home">Home</a>`);
  return options;
}
test("checks CSP on every page, including nested pages", async () => {
  const f = await fixture(); await mkdir(path.join(f.outDir, "nested")); await writeFile(path.join(f.outDir, "nested/index.html"), "<h1>Missing policy</h1>");
  await assert.rejects(verifyExport(f), /nested\/index.html: missing CSP/);
});
test("detects duplicate IDs, missing link targets and missing fragments after entity decoding", async () => {
  const f = await fixture();
  await writeFile(path.join(f.outDir, "index.html"), `${csp}<div id="same"></div><div id="same"></div><a href="/#absent">x</a><img src="/absent.webp"><a href="/a?x=1&amp;y=2">query</a>`);
  await assert.rejects(verifyExport(f), error => /duplicate id same/.test(error.message) && /missing fragment/.test(error.message) && /missing internal target/.test(error.message));
});
test("required/retired pages and exact CV hashes are release gates", async () => {
  const f = await fixture(); await mkdir(path.join(f.outDir, "retired")); await writeFile(path.join(f.outDir, "retired/index.html"), csp);
  await writeFile(path.join(f.outDir, "cv.pdf"), "wrong bytes");
  await assert.rejects(verifyExport({ ...f, requiredRoutes: ["/experience/"], cvHashes: { "/cv.pdf": hash("approved bytes") } }), error => /Required route missing/.test(error.message) && /Retired page/.test(error.message) && /CV bytes differ/.test(error.message));
});
test("retired Work hub and all eight detail routes fail release verification", async () => {
  const f = await fixture();
  const routes = RETIRED_ROUTES.filter(route => route.startsWith("/work/"));
  assert.equal(routes.length, 9);
  for (const route of routes) {
    const dir = path.join(f.outDir, route.slice(1));
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), csp);
  }
  await assert.rejects(verifyExport({ ...f, retiredRoutes: RETIRED_ROUTES }), error => routes.every(route => error.message.includes(`Retired page still exports: ${route}`)));
});
test("a retired page does not forbid approved customer media URLs", async () => {
  const f = await fixture(); await mkdir(path.join(f.outDir, "Media/retired"), { recursive: true });
  await writeFile(path.join(f.outDir, "Media/retired/logo.webp"), "retained asset");
  await writeFile(path.join(f.outDir, "index.html"), `${csp}<img src="/Media/retired/logo.webp">`);
  assert.equal((await verifyExport(f)).htmlPages, 1);
});
test("manifest verifies actual ownership, original preservation, coverage and decoded image dimensions", async () => {
  const f = await fixture(), publicDir = path.join(f.outDir, "sources"), media = path.join(f.outDir, "Media");
  await mkdir(path.join(publicDir, "Media"), { recursive: true }); await mkdir(media);
  const buffer = await sharp({ create: { width: 80, height: 40, channels: 3, background: "red" } }).png().toBuffer();
  for (const dir of [media, path.join(publicDir, "Media")]) await writeFile(path.join(dir, "test.png"), buffer);
  const baselinePath = path.join(f.outDir, "baseline.json");
  await writeFile(baselinePath, JSON.stringify({ files: [{ path: "public/Media/test.png", sha256: hash(buffer) }] }));
  await generateImages({ root: media, cacheDir: path.join(f.outDir, "cache") });
  const options = { ...f, publicDir, baselinePath, checkImages: true };
  assert.equal((await verifyExport(options)).htmlPages, 1);
  const manifestFile = path.join(f.outDir, "image-variants.manifest.json"), manifest = JSON.parse(await readFile(manifestFile));
  manifest.variants[0].source = "wrong.png"; await writeFile(manifestFile, JSON.stringify(manifest));
  await assert.rejects(verifyExport(options), /incorrect derivative coverage/);
});

test("private authoring markers in JSON/RSC/HTML fail without banning retained customer assets", async () => {
  const f = await fixture();
  await writeFile(path.join(f.outDir, "index.txt"), String.raw`{"source":"\/home\/oem\/Desktop\/private.md"}`);
  await writeFile(path.join(f.outDir, "data.json"), JSON.stringify({ source: "Knowledge/MasterFile.md" }));
  await assert.rejects(verifyExport(f), error => /local workstation source path/.test(error.message) && /Knowledge authoring reference/.test(error.message));
});
