import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
export const hash = (value) => createHash("sha256").update(value).digest("hex");
export const slash = (value) => value.split(path.sep).join("/");
export async function filesUnder(root) {
  const result = [];
  for (const entry of (await readdir(root, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name, "en"))) {
    const file = path.join(root, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symbolic link is not a portable build input: ${file}`);
    if (entry.isDirectory()) result.push(...await filesUnder(file));
    else if (entry.isFile()) result.push(file);
  }
  return result;
}
export async function mapLimited(values, concurrency, operation) {
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 16) throw new Error("Concurrency must be an integer from 1 to 16");
  let next = 0;
  const result = new Array(values.length);
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    for (;;) {
      const index = next++;
      if (index >= values.length) return;
      result[index] = await operation(values[index], index);
    }
  }));
  return result;
}
export async function fileHash(file) { return hash(await readFile(file)); }
