import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, symlink, rm } from "node:fs/promises";
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
    assert.equal(image.headers.get("x-content-type-options"), "nosniff");
    assert.equal(image.headers.get("content-type"), "image/png"); assert.equal(await image.text(), "");
    const range = await fetch(base + "/og-default.png", { headers: { Range: "bytes=0-2" } });
    assert.equal(range.status, 206); assert.equal(await range.text(), "png");
    assert.equal((await fetch(base + "/og-default.png", { headers: { Range: "bytes=99-100" } })).status, 416);
    const missing = await fetch(base + "/unknown/"); assert.equal(missing.status, 404); assert.equal(await missing.text(), "custom missing page");
    assert.equal((await fetch(base + "/", { method: "POST" })).status, 405);
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});

test("preview never serves outside symlink targets, including its 404 fallback", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "website-preview-boundary-"));
  const root = path.join(directory, "public");
  await mkdir(root);
  await writeFile(path.join(directory, "private.txt"), "private authoring data");
  await symlink(path.join(directory, "private.txt"), path.join(root, "linked.txt"));
  await symlink(path.join(directory, "private.txt"), path.join(root, "404.html"));
  const server = createPreview(root);
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    for (const route of ["/linked.txt", "/missing/", "/%2e%2e%2fprivate.txt", "/%00"]) {
      const response = await fetch(base + route);
      assert.ok([400, 403].includes(response.status), route);
      assert.doesNotMatch(await response.text(), /private authoring data/);
    }
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    await rm(directory, { recursive: true, force: true });
  }
});

test("preview CLI accepts pnpm-forwarded --port and validates arguments", async () => {
  const { previewOptions } = await import("../preview.mjs");
  assert.deepEqual(previewOptions(["out", "--port", "4173"], {}), { root: "out", port: 4173, host: "127.0.0.1" });
  assert.deepEqual(previewOptions(["--", "--port=4174", "--host", "0.0.0.0"], { PORT: "3001" }), { root: "out", port: 4174, host: "0.0.0.0" });
  assert.throws(() => previewOptions(["--port", "70000"], {}), /Preview port/);
  assert.throws(() => previewOptions(["--port"], {}), /Preview port/);
  assert.throws(() => previewOptions(["--typo"], {}), /Unknown preview/);
});

test("preview applies byte ranges only to GET and ignores unsupported units", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "website-preview-ranges-"));
  await writeFile(path.join(root, "file.txt"), "0123456789");
  const server = createPreview(root);
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  t.after(async () => {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    await rm(root, { recursive: true, force: true });
  });
  const url = `http://127.0.0.1:${server.address().port}/file.txt`;
  for (const range of ["bytes=2-3", "bytes=99-100", "items=2-3"]) {
    const head = await fetch(url, { method: "HEAD", headers: { Range: range } });
    assert.equal(head.status, 200, range);
    assert.equal(head.headers.get("content-length"), "10", range);
    assert.equal(head.headers.get("content-range"), null, range);
    assert.equal(await head.text(), "");
  }
  const unknownUnit = await fetch(url, { headers: { Range: "items=2-3" } });
  assert.equal(unknownUnit.status, 200);
  assert.equal(unknownUnit.headers.get("content-range"), null);
  assert.equal(await unknownUnit.text(), "0123456789");
  for (const [range, body, contentRange] of [
    ["BYTES=2-3", "23", "bytes 2-3/10"],
    ["bytes=-2", "89", "bytes 8-9/10"],
    ["bytes=8-", "89", "bytes 8-9/10"],
  ]) {
    const response = await fetch(url, { headers: { Range: range } });
    assert.equal(response.status, 206, range);
    assert.equal(response.headers.get("content-range"), contentRange, range);
    assert.equal(await response.text(), body, range);
  }
  const invalid = await fetch(url, { headers: { Range: "bytes=7-2" } });
  assert.equal(invalid.status, 416);
  assert.equal(invalid.headers.get("content-range"), "bytes */10");
});
