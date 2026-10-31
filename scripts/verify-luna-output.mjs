import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parse } from "parse5";
import { filesUnder } from "./lib/files.mjs";
import { validateVaultConfig } from "../src/lib/luna-vault.ts";

export async function verifyLunaOutput(outDir = "out") {
  const root = path.resolve(outDir), vault = path.join(root, "luna/vault"), errors = [];
  const config = JSON.parse(await readFile(path.join(vault, "config.json"), "utf8"));
  validateVaultConfig(config);
  let encryptedObjects = 0;
  for (const release of await readdir(vault, { withFileTypes: true })) {
    if (release.name === "config.json") continue;
    if (!release.isDirectory() || !/^[a-f0-9-]{36}$/.test(release.name)) { errors.push("Unexpected vault file"); continue; }
    const nonces = new Set(release.name === config.release ? [config.wrappedKey.iv] : []);
    for (const name of await readdir(path.join(vault, release.name))) {
      if (!/^[a-f0-9-]{36}\.bin$/.test(name)) { errors.push("Non-opaque vault filename"); continue; }
      const buffer = await readFile(path.join(vault, release.name, name));
      if (buffer.length < 28 || buffer.length > 32 * 1024 * 1024) errors.push("Invalid encrypted object size");
      const nonce = buffer.subarray(0, 12).toString("base64");
      if (nonces.has(nonce)) errors.push("Repeated encryption nonce");
      nonces.add(nonce); encryptedObjects++;
      if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])) || buffer.subarray(0, 4).toString() === "RIFF" || buffer.subarray(0, 3).toString() === "ID3") errors.push("Plaintext media in vault");
    }
  }
  if ((await stat(path.join(vault, config.release, config.manifest.id + ".bin"))).size !== config.manifest.bytes) errors.push("Catalog size mismatch");
  if (!encryptedObjects) errors.push("Empty vault");
  for (const file of await filesUnder(root)) {
    const relative = path.relative(root, file).replaceAll(path.sep, "/");
    if (/^Media\/luna(?:\/|$)/i.test(relative)) errors.push("Legacy plaintext media still exported");
    if (!/\.(html|js|json|txt|xml|css|map)$/.test(relative)) continue;
    const text = await readFile(file, "utf8");
    if (/\/Media\/luna\/|IMG-\d{8}-WA\d+|birthday-content\.json|release-backup\.json|access\.json/.test(text)) errors.push(`${relative}: private authoring reference`);
    if (/^(?:sitemap\.xml|search-index\.json|llms(?:-full)?\.txt|image-variants\.manifest\.json)$/.test(relative) && /(?:\/luna(?:\/|["'])|"luna\/)/i.test(text)) errors.push(`${relative}: private discovery reference`);
    if (!relative.endsWith(".html")) continue;
    const nodes = [];
    const visit = node => { if (node.tagName) nodes.push(node); for (const child of node.childNodes ?? []) visit(child); };
    visit(parse(text));
    const attrs = node => Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
    if (relative.startsWith("luna/")) {
      const metas = nodes.filter(node => node.tagName === "meta").map(attrs);
      if (!metas.some(a => a.name === "robots" && a.content.includes("noindex"))) errors.push(`${relative}: missing noindex`);
      if (!metas.some(a => a.name === "referrer" && a.content === "no-referrer")) errors.push(`${relative}: missing no-referrer`);
      const csp = metas.find(a => a["http-equiv"]?.toLowerCase() === "content-security-policy")?.content ?? "";
      if (!csp.includes("media-src 'self' blob:") || /posthog|formspree/.test(csp)) errors.push(`${relative}: private CSP mismatch`);
      if (nodes.some(node => node.tagName === "link" && ["manifest", "preload"].includes(attrs(node).rel) && /manifest|\.woff/.test(attrs(node).href ?? ""))) errors.push(`${relative}: portfolio resource`);
    } else if (nodes.some(node => ["a", "link"].includes(node.tagName) && /^\/luna(?:\/|$)/.test(attrs(node).href ?? ""))) errors.push(`${relative}: public link to private space`);
  }
  if (errors.length) throw new Error(`Private export verification failed:\n${errors.join("\n")}`);
  return { encryptedObjects, release: config.release, privateRoutes: 2, plaintextMedia: 0 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  verifyLunaOutput(process.argv[2] ?? "out").then(result => console.log("verify-luna-output:", JSON.stringify(result))).catch(error => { console.error(error.message); process.exitCode = 1; });
}
