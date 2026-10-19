import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parse } from "parse5";
import sharp from "sharp";
import { filesUnder, hash, slash, fileHash } from "./lib/files.mjs";
import { imageInventory } from "./generate-image-variants.mjs";
import { IMAGE_WIDTHS, IMAGE_SETTINGS } from "./image-families.mjs";
import { privateAuthoringMarkers } from "./lib/public-boundary.mjs";
import { SITE_ORIGIN, REQUIRED_ROUTES, RETIRED_ROUTES, CV_HASHES } from "./export-contract.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const exists = async (file) => { try { return (await stat(file)).isFile(); } catch { return false; } };
function elements(node, result = []) {
  if (node.tagName) result.push(node);
  for (const child of node.childNodes ?? []) elements(child, result);
  if (node.content) elements(node.content, result);
  return result;
}
const attributes = (node) => Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
export async function verifyExport({ outDir = "out", publicDir = "public", requiredRoutes = REQUIRED_ROUTES, retiredRoutes = RETIRED_ROUTES, cvHashes = CV_HASHES, baselinePath = path.join(here, "raster-baseline.json"), checkImages = true, checkData = true } = {}) {
  const root = path.resolve(outDir), errors = [], warnings = [], pages = new Map(), allFiles = await filesUnder(root);
  const fail = (message) => errors.push(message);
  for (const file of allFiles) {
    const relative = slash(path.relative(root, file));
    if (/(^|\/)(Knowledge|\.env[^/]*)(\/|$)/i.test(relative) || /(^|\/)IMAGE_GUIDE\.md$/i.test(relative)) fail(`Private/authoring file in artifact: ${relative}`);
    if (/\.(?:html|json|txt|xml|js|map|md)$/i.test(file)) {
      for (const label of privateAuthoringMarkers(await readFile(file, "utf8"))) fail(`${relative}: ${label} in public content`);
    }
    if (!file.endsWith(".html")) continue;
    const html = await readFile(file, "utf8"), nodes = elements(parse(html)), ids = new Set(), references = [];
    let csp = false;
    for (const node of nodes) {
      const a = attributes(node);
      if (a.id) { if (ids.has(a.id)) fail(`${relative}: duplicate id ${a.id}`); ids.add(a.id); }
      if (node.tagName === "meta" && a["http-equiv"]?.toLowerCase() === "content-security-policy" && a.content?.includes("default-src")) csp = true;
      for (const key of ["href", "src", "poster"]) if (a[key]) references.push(a[key]);
      if (a.srcset) for (const item of a.srcset.split(/,\s*(?=\S)/)) { const url = item.trim().split(/\s+/)[0]; if (url && !url.startsWith("data:")) references.push(url); }
    }
    if (!csp) fail(`${relative}: missing CSP meta`);
    pages.set(file, { ids, references, html });
  }
  if (!pages.size) fail("No exported HTML pages");
  function routeFile(route) { return path.join(root, route.replace(/^\//, ""), "index.html"); }
  for (const route of requiredRoutes) if (!await exists(routeFile(route))) fail(`Required route missing: ${route}`);
  for (const route of retiredRoutes) {
    if (await exists(routeFile(route)) || await exists(path.join(root, `${route.replace(/^\//, "").replace(/\/$/, "")}.html`))) fail(`Retired page still exports: ${route}`);
  }
  for (const [file, page] of pages) {
    const relative = slash(path.relative(root, file)), pageUrl = new URL(relative === "index.html" ? "/" : "/" + relative.replace(/index\.html$/, ""), SITE_ORIGIN);
    for (const reference of page.references) {
      if (/^(data:|blob:|mailto:|tel:)/i.test(reference)) continue;
      let url;
      try { url = new URL(reference, pageUrl); } catch { fail(`${relative}: invalid URL ${reference}`); continue; }
      if (url.origin !== SITE_ORIGIN) continue;
      let pathname;
      try { pathname = decodeURIComponent(url.pathname); } catch { fail(`${relative}: invalid encoded path ${reference}`); continue; }
      const target = path.resolve(root, "." + pathname);
      if (!target.startsWith(root + path.sep) && target !== root) { fail(`${relative}: escaping URL ${reference}`); continue; }
      const candidates = [target, path.join(target, "index.html")];
      if (!path.extname(target)) candidates.push(target + ".html");
      let resolved;
      for (const candidate of candidates) if (await exists(candidate)) { resolved = candidate; break; }
      if (!resolved) { fail(`${relative}: missing internal target ${reference}`); continue; }
      if (url.hash && pages.has(resolved)) {
        let fragment;
        try { fragment = decodeURIComponent(url.hash.slice(1)); } catch { fail(`${relative}: invalid fragment ${reference}`); continue; }
        if (fragment && !fragment.startsWith(":~:text=") && !pages.get(resolved).ids.has(fragment)) fail(`${relative}: missing fragment ${reference}`);
      }
    }
  }
  for (const [url, expected] of Object.entries(cvHashes)) {
    const file = path.join(root, url.slice(1));
    if (!await exists(file)) fail(`Missing CV ${url}`);
    else if (await fileHash(file) !== expected) fail(`CV bytes differ from approved artifact: ${url}`);
  }
  if (checkImages) {
    try {
      const baseline = JSON.parse(await readFile(baselinePath, "utf8"));
      for (const source of baseline.files) {
        for (const folder of [publicDir, root]) {
          const file = path.join(folder, source.path.replace(/^public\//, ""));
          if (!await exists(file) || await fileHash(file) !== source.sha256) fail(`Original not preserved: ${folder}/${source.path.replace(/^public\//, "")}`);
        }
      }
      const manifest = JSON.parse(await readFile(path.join(root, "image-variants.manifest.json"), "utf8"));
      const inventory = await imageInventory(path.join(root, "Media"));
      const publicInventory = await imageInventory(path.join(publicDir, "Media"));
      if (JSON.stringify(publicInventory.originals) !== JSON.stringify(inventory.originals)) fail("Exported raster originals differ from public source inventory");
      if (JSON.stringify(manifest.originals) !== JSON.stringify(inventory.originals)) fail("Image manifest source inventory/hash mismatch");
      if (JSON.stringify(manifest.families) !== JSON.stringify(inventory.selected)) fail("Image source-family ownership mismatch");
      if (JSON.stringify(manifest.settings) !== JSON.stringify(IMAGE_SETTINGS)) fail("Image encoder settings mismatch");
      const rows = new Map();
      for (const row of manifest.variants) { if (rows.has(row.path)) fail(`Duplicate image manifest destination ${row.path}`); rows.set(row.path, row); }
      for (const { family, owner } of inventory.selected) {
        const source = inventory.originals.find((item) => item.path === owner);
        for (const width of IMAGE_WIDTHS) {
          const name = `${family}-${width}w.webp`, row = rows.get(name), file = path.join(root, "Media", name);
          if (!row || row.source !== owner || row.requestedWidth !== width) { fail(`Missing/incorrect derivative coverage ${name}`); continue; }
          const buffer = await readFile(file), metadata = await sharp(buffer).metadata(), effectiveWidth = Math.min(width, source.width);
          if (hash(buffer) !== row.sha256 || buffer.length !== row.bytes || metadata.format !== "webp" || metadata.width !== effectiveWidth || metadata.height !== Math.round(source.height * effectiveWidth / source.width) || row.width !== metadata.width || row.height !== metadata.height) fail(`Derivative hash/dimensions mismatch ${name}`);
          rows.delete(name);
        }
      }
      if (rows.size) fail(`Unexpected derivative manifest rows: ${rows.size}`);
    } catch (error) { fail(`Image verification: ${error.message}`); }
  }
  if (checkData) {
    try {
      const image = await sharp(await readFile(path.join(root, "og-default.png"))).metadata();
      if (image.format !== "png" || image.width !== 1200 || image.height !== 630) fail("Default sharing image must be a real 1200x630 PNG");
      for (const name of ["llms.txt", "llms-full.txt", "search-index.json"]) if (!await exists(path.join(root, name))) fail(`Missing generated ${name}`);
      const search = JSON.parse(await readFile(path.join(root, "search-index.json"), "utf8"));
      if (search.schemaVersion !== 1 || typeof search.contentRevision !== "string" || !search.contentRevision || !Array.isArray(search.items)) fail("Invalid public search schema/revision");
      else {
        const ids = new Set();
        for (const item of search.items) {
          if (typeof item.id !== "string" || ids.has(item.id) || typeof item.href !== "string") { fail("Invalid or duplicate public search item"); continue; }
          ids.add(item.id);
          const url = new URL(item.href, SITE_ORIGIN);
          if (url.origin !== SITE_ORIGIN || !url.pathname.startsWith("/") || url.pathname.startsWith("/luna/")) { fail(`Unexpected search destination ${item.href}`); continue; }
          const target = path.resolve(root, "." + decodeURIComponent(url.pathname));
          const resolved = await exists(target) ? target : path.join(target, "index.html");
          if (!await exists(resolved)) fail(`Missing search destination ${item.href}`);
          if (url.hash && pages.has(resolved) && !pages.get(resolved).ids.has(decodeURIComponent(url.hash.slice(1)))) fail(`Missing search fragment ${item.href}`);
        }
      }
    } catch (error) { fail(`Generated data: ${error.message}`); }
  }
  if (errors.length) throw new Error(`Export verification failed (${errors.length}):\n${errors.slice(0, 60).map((error) => `  ${error}`).join("\n")}`);
  return { htmlPages: pages.size, cspPages: pages.size, warnings };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  verifyExport({ outDir: process.argv[2] ?? "out" }).then((result) => console.log("verify-build-output:", JSON.stringify(result))).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
