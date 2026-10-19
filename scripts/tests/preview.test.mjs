import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createPreview } from "../preview.mjs";

test("preview serves deep routes, PNG MIME, byte ranges, HEAD and real 404s", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "website-preview-test-"));
  await mkdir(path.join(root, "nested/test"), { recursive: true });
  await writeFile(path.join(root, "nested/test/index.html"), "deep route");
  await writeFile(path.join(root, "404.html"), "custom missing page");
  await writeFile(path.join(root, "og-default.png"), "pngbytes");
  const server = createPreview(root);
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    assert.equal(await (await fetch(base + "/nested/test/")).text(), "deep route");
    const redirect = await fetch(base + "/nested/test?foo=1", { redirect: "manual" });
    assert.equal(redirect.status, 308); assert.equal(redirect.headers.get("location"), "/nested/test/?foo=1");
    const image = await fetch(base + "/og-default.png", { method: "HEAD" });
    assert.equal(image.headers.get("content-type"), "image/png"); assert.equal(await image.text(), "");
    const range = await fetch(base + "/og-default.png", { headers: { Range: "bytes=0-2" } });
    assert.equal(range.status, 206); assert.equal(await range.text(), "png");
    assert.equal((await fetch(base + "/og-default.png", { headers: { Range: "bytes=99-100" } })).status, 416);
    const missing = await fetch(base + "/unknown/"); assert.equal(missing.status, 404); assert.equal(await missing.text(), "custom missing page");
    assert.equal((await fetch(base + "/", { method: "POST" })).status, 405);
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});

test("preview CLI accepts pnpm-forwarded --port and validates arguments", async () => {
  const { previewOptions } = await import("../preview.mjs");
  assert.deepEqual(previewOptions(["out", "--port", "4173"], {}), { root: "out", port: 4173, host: "127.0.0.1" });
  assert.deepEqual(previewOptions(["--", "--port=4174", "--host", "0.0.0.0"], { PORT: "3001" }), { root: "out", port: 4174, host: "0.0.0.0" });
  assert.throws(() => previewOptions(["--port", "70000"], {}), /Preview port/);
  assert.throws(() => previewOptions(["--port"], {}), /Preview port/);
  assert.throws(() => previewOptions(["--typo"], {}), /Unknown preview/);
});
