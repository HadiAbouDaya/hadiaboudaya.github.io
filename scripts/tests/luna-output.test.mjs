import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createVaultSession, sealVaultObject } from "../lib/luna-encryption.mjs";
import { verifyLunaOutput } from "../verify-luna-output.mjs";

test("export boundary rejects plaintext media and public discovery links", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "luna-boundary-test-"));
  try {
    const session = await createVaultSession("synthetic-boundary-test-passphrase-only");
    const sealed = await sealVaultObject(session, new TextEncoder().encode("synthetic catalog"), "application/json");
    session.config.manifest = sealed.asset;
    const vault = path.join(directory, "luna/vault");
    await mkdir(path.join(vault, session.config.release), { recursive: true });
    await writeFile(path.join(vault, "config.json"), JSON.stringify(session.config));
    await writeFile(path.join(vault, session.config.release, sealed.asset.id + ".bin"), sealed.buffer);
    await writeFile(path.join(directory, "index.html"), "<html><body>Public site</body></html>");
    assert.equal((await verifyLunaOutput(directory)).plaintextMedia, 0);
    await writeFile(path.join(directory, "index.html"), '<html><body><a href="/luna/">Private</a></body></html>');
    await assert.rejects(verifyLunaOutput(directory), /public link/);
    await writeFile(path.join(directory, "index.html"), "<html><body>Public site</body></html>");
    await mkdir(path.join(directory, "Media/luna"), { recursive: true });
    await writeFile(path.join(directory, "Media/luna/photo.webp"), "plaintext photo");
    await assert.rejects(verifyLunaOutput(directory), /Legacy plaintext/);
    await rm(path.join(directory, "Media"), { recursive: true });
    await writeFile(path.join(directory, "search-index.json"), JSON.stringify({href:"/luna/"}));
    await assert.rejects(verifyLunaOutput(directory), /private discovery/);
  } finally { await rm(directory, {recursive:true,force:true}); }
});
