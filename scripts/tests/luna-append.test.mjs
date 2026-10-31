import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { createVaultSession, sealVaultObject } from "../lib/luna-encryption.mjs";
import { appendCollection } from "../append-luna-collection.mjs";
import { DEFAULT_JOURNEY_THEME, decryptVaultObject, unlockVault, validateManifest } from "../../src/lib/luna-vault.ts";

test("append keeps old ciphertext/password, adds a versioned sealed collection, and rejects repeats before mutation", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "sealed-append-test-"));
  const privateDir = path.join(directory, "authoring"), destination = path.join(directory, "vault");
  await mkdir(privateDir, {mode:0o700});
  try {
    const password = "synthetic-append-test-password-only";
    const session = await createVaultSession(password), releaseDir = path.join(destination, session.config.release);
    await mkdir(releaseDir, {recursive:true});
    const image = await sharp({create:{width:4,height:6,channels:3,background:"#ccc"}}).webp().toBuffer();
    const original = await sealVaultObject(session, image, "image/webp", {width:4,height:6});
    await writeFile(path.join(releaseDir, original.asset.id + ".bin"), original.buffer);
    const photo = {id:crypto.randomUUID(),group:"ordinary",width:4,height:6,alt:"Synthetic photograph",thumb:original.asset,medium:original.asset,full:original.asset};
    const manifest = {version:1,album:{title:"Synthetic album",subtitle:"Test only",coverIds:[photo.id]},chapters:[{id:"ordinary",title:"Synthetic chapter",dateLabel:"Undated",source:"fixture",coverId:photo.id,order:1}],photos:[photo],birthday:{text:{},assets:{},photos:[]}};
    const catalog = await sealVaultObject(session, Buffer.from(JSON.stringify(manifest)), "application/json");
    session.config.manifest = catalog.asset;
    await writeFile(path.join(releaseDir, catalog.asset.id + ".bin"), catalog.buffer);
    await writeFile(path.join(destination, "config.json"), JSON.stringify(session.config));
    await writeFile(path.join(privateDir, "access.json"), JSON.stringify({passphrase:password}), {mode:0o600});
    await writeFile(path.join(privateDir, "release-backup.json"), JSON.stringify({config:session.config,manifest,rawKey:Buffer.from(await crypto.subtle.exportKey("raw",session.key)).toString("base64")}), {mode:0o600});
    const collectionDir = path.join(privateDir,"collection"); await mkdir(collectionDir,{mode:0o700});
    await writeFile(path.join(collectionDir,"source.jpg"),await sharp(image).jpeg().toBuffer());
    const presentation={kind:"sealed",teaser:"Synthetic teaser",description:"Synthetic description",sealLabel:"Synthetic seal",openLabel:"Open fixture",closeLabel:"Close fixture",revealedNote:"Synthetic note",exhibitLabel:"Fixture"};
    const definition={chapter:{id:"special",title:"Synthetic special",dateLabel:"Undated",source:"fixture",order:2,presentation},cover:"source.jpg",photos:[{file:"source.jpg",alt:"Synthetic special photograph"}]};
    const collectionFile=path.join(collectionDir,"collection.json");await writeFile(collectionFile,JSON.stringify(definition));
    const before=(await readdir(releaseDir)).sort();
    // A mismatched current passphrase must not publish even with a valid recovery key.
    await writeFile(path.join(privateDir,"access.json"),JSON.stringify({passphrase:"wrong-synthetic-passphrase"}),{mode:0o600});
    await assert.rejects(appendCollection({privateDir,collectionFile,destination}));
    assert.deepEqual((await readdir(releaseDir)).sort(),before);
    await writeFile(path.join(privateDir,"access.json"),JSON.stringify({passphrase:password}),{mode:0o600});
    assert.deepEqual(await appendCollection({privateDir,collectionFile,destination}),{addedPhotos:1,addedEncryptedObjects:4,photos:2,chapters:2});
    assert.deepEqual(await readFile(path.join(releaseDir,original.asset.id+".bin")),original.buffer);
    assert.deepEqual(await readFile(path.join(releaseDir,catalog.asset.id+".bin")),catalog.buffer);
    const config=JSON.parse(await readFile(path.join(destination,"config.json"),"utf8"));
    assert.deepEqual(config.wrappedKey,session.config.wrappedKey);assert.equal(config.release,session.config.release);
    const key=await unlockVault(password,config), bytes=await readFile(path.join(releaseDir,config.manifest.id+".bin"));
    const current=JSON.parse(Buffer.from(await decryptVaultObject(key,config.release,config.manifest,bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength))).toString());
    validateManifest(current);assert.equal(current.version,2);assert.equal(current.chapters[1].presentation.kind,"sealed");
    assert.throws(()=>validateManifest({...current,version:1}),/Invalid collection/);
    assert.throws(()=>validateManifest({...current,chapters:current.chapters.map(chapter=>chapter.presentation?{...chapter,presentation:{...presentation,openLabel:""}}:chapter)}),/Invalid collection/);
    const after=(await readdir(releaseDir)).sort(), configBytes=await readFile(path.join(destination,"config.json"));
    await assert.rejects(appendCollection({privateDir,collectionFile,destination}),/already imported/);
    assert.deepEqual((await readdir(releaseDir)).sort(),after);
    assert.deepEqual(await readFile(path.join(destination,"config.json")),configBytes);
    assert.equal((await readdir(path.join(privateDir,"release-history"))).length,1);
  } finally {await rm(directory,{recursive:true,force:true});}
});

test("v3 journey albums keep themes, ciphertext and visual order through sealed and ordinary appends", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "journey-append-test-"));
  const privateDir = path.join(directory, "authoring"), destination = path.join(directory, "vault");
  await mkdir(privateDir, { mode: 0o700 });
  try {
    const password = "synthetic-v3-append-password-only";
    const session = await createVaultSession(password), releaseDir = path.join(destination, session.config.release);
    await mkdir(releaseDir, { recursive: true });
    const image = await sharp({ create: { width: 6, height: 4, channels: 3, background: "#ccc" } }).webp().toBuffer();
    const original = await sealVaultObject(session, image, "image/webp", { width: 6, height: 4 });
    await writeFile(path.join(releaseDir, original.asset.id + ".bin"), original.buffer);
    const originalPhotos = [2, 7].map(sequence => ({ id: crypto.randomUUID(), group: "journey", width: 6, height: 4, alt: "Synthetic ordered photo", sequence, thumb: original.asset, medium: original.asset, full: original.asset }));
    const originalChapter = { id: "journey", title: "Synthetic journey", dateLabel: "Undated", source: "fixture", coverId: originalPhotos[0].id, order: 0, journey: { ...DEFAULT_JOURNEY_THEME, motif: "prism" } };
    const manifest = { version: 3, album: { title: "Synthetic album", subtitle: "Test only", coverIds: [originalPhotos[0].id] }, chapters: [originalChapter], photos: originalPhotos, birthday: { text: {}, assets: {}, photos: [] } };
    validateManifest(manifest);
    const catalog = await sealVaultObject(session, Buffer.from(JSON.stringify(manifest)), "application/json");
    session.config.manifest = catalog.asset;
    await writeFile(path.join(releaseDir, catalog.asset.id + ".bin"), catalog.buffer);
    await writeFile(path.join(destination, "config.json"), JSON.stringify(session.config));
    await writeFile(path.join(privateDir, "access.json"), JSON.stringify({ passphrase: password }), { mode: 0o600 });
    await writeFile(path.join(privateDir, "release-backup.json"), JSON.stringify({ config: session.config, manifest, rawKey: Buffer.from(await crypto.subtle.exportKey("raw", session.key)).toString("base64") }), { mode: 0o600 });
    const collectionDir = path.join(privateDir, "collections");
    await mkdir(collectionDir, { mode: 0o700 });
    await writeFile(path.join(collectionDir, "source.jpg"), await sharp(image).jpeg().toBuffer());
    const presentation = { kind: "sealed", teaser: "Synthetic teaser", description: "Synthetic description", sealLabel: "Synthetic seal", openLabel: "Open fixture", closeLabel: "Close fixture", revealedNote: "Synthetic note", exhibitLabel: "Fixture" };
    for (const [index, kind] of ["sealed", "ordinary"].entries()) {
      const chapter = { id: kind, title: `Synthetic ${kind}`, dateLabel: "Undated", source: "fixture", order: index + 1, ...(kind === "sealed" ? { presentation } : { journey: { ...DEFAULT_JOURNEY_THEME, motif: "steam" } }) };
      const collectionFile = path.join(collectionDir, `${kind}.json`);
      await writeFile(collectionFile, JSON.stringify({ chapter, cover: "source.jpg", photos: [{ file: "source.jpg", alt: `Synthetic ${kind} photograph` }] }));
      await appendCollection({ privateDir, collectionFile, destination });
      const config = JSON.parse(await readFile(path.join(destination, "config.json"), "utf8"));
      const key = await unlockVault(password, config);
      const bytes = await readFile(path.join(releaseDir, config.manifest.id + ".bin"));
      const current = JSON.parse(Buffer.from(await decryptVaultObject(key, config.release, config.manifest, bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))).toString());
      validateManifest(current);
      assert.equal(current.version, 3, "Appending must never downgrade existing journey support");
      assert.deepEqual(current.chapters[0], originalChapter);
      assert.deepEqual(current.photos.slice(0, 2), originalPhotos);
      assert.deepEqual(current.photos.map(photo => photo.sequence), [2, 7, 8, 9].slice(0, index + 3));
      assert.equal(current.chapters.at(-1).id, kind);
      assert.deepEqual(current.chapters.at(-1)[kind === "sealed" ? "presentation" : "journey"], kind === "sealed" ? presentation : chapter.journey);
      assert.deepEqual(config.wrappedKey, session.config.wrappedKey);
      assert.equal(config.release, session.config.release);
    }
    assert.deepEqual(await readFile(path.join(releaseDir, original.asset.id + ".bin")), original.buffer);
    assert.deepEqual(await readFile(path.join(releaseDir, catalog.asset.id + ".bin")), catalog.buffer);
    assert.equal((await readdir(path.join(privateDir, "release-history"))).length, 2);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
