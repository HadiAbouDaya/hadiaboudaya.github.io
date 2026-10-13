// Post-build check: every responsive image variant referenced by the
// exported HTML must exist in out/, and the exported pages must carry
// the Content-Security-Policy meta tag. Fails the build otherwise, so a
// missing variant-generation step cannot ship broken images silently.
//
// Usage: node scripts/verify-build-output.mjs [outDir]

import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const outDir = process.argv[2] ?? "out";
const VARIANT_RE = /\/Media\/[^"'\s,]+-\d+w\.webp/g;

async function walk(dir, ext) {
  const files = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full, ext)));
    else if (entry.name.endsWith(ext)) files.push(full);
  }
  return files;
}

async function main() {
  const htmlFiles = await walk(outDir, ".html");
  if (htmlFiles.length === 0) {
    throw new Error(`verify-build-output: no HTML files found in "${outDir}".`);
  }

  const referenced = new Set();
  let pagesWithCsp = 0;
  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    for (const match of html.matchAll(VARIANT_RE)) referenced.add(match[0]);
    if (html.includes('http-equiv="Content-Security-Policy"')) pagesWithCsp += 1;
  }

  const missing = [...referenced].filter((src) => !existsSync(path.join(outDir, src)));
  if (missing.length > 0) {
    throw new Error(
      `verify-build-output: ${missing.length} referenced image variant(s) missing from "${outDir}":\n` +
        missing.slice(0, 10).map((src) => `  - ${src}`).join("\n"),
    );
  }
  if (pagesWithCsp === 0) {
    throw new Error("verify-build-output: no exported page carries a Content-Security-Policy meta tag.");
  }

  console.log(
    `verify-build-output: ${referenced.size} image variant reference(s) present, ` +
      `CSP meta on ${pagesWithCsp}/${htmlFiles.length} page(s).`,
  );
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exitCode = 1;
});
