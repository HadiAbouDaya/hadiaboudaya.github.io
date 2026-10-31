import { chromium, expect } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
const privateDir = process.env.LUNA_PRIVATE_DIR;
if (!privateDir || !path.isAbsolute(privateDir)) throw new Error("Set LUNA_PRIVATE_DIR");
const {passphrase} = JSON.parse(await readFile(path.join(privateDir,"access.json"),"utf8"));
process.on("uncaughtException", error => { console.error(String(error.message).replaceAll(passphrase,"[redacted]")); process.exit(1); });
const {manifest,config} = JSON.parse(await readFile(path.join(privateDir,"release-backup.json"),"utf8"));
const sealedChapters=manifest.chapters.filter(chapter=>chapter.presentation?.kind==="sealed");
const sealedIds=new Set(sealedChapters.map(chapter=>chapter.id));
const ordinaryChapters=manifest.chapters.filter(chapter=>!sealedIds.has(chapter.id));
const ordinaryPhotos=manifest.photos.filter(photo=>!sealedIds.has(photo.group));
const origin = process.env.LUNA_TEST_ORIGIN ?? "http://127.0.0.1:4173";
const browser = await chromium.launch({executablePath:process.env.LUNA_CHROME_PATH ?? "/opt/google/chrome/chrome"});
const context = await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:"reduce"});
const page = await context.newPage();
page.setDefaultTimeout(15000);
const errors=[];page.on("pageerror",e=>errors.push(e.message));
const unlock = async () => {await page.getByLabel("Our passphrase").fill(passphrase);await page.getByRole("button",{name:"Come inside"}).click();await expect(page.locator("#album-title")).toBeVisible({timeout:20000});};
try {
  await page.goto(origin+"/luna/");
  // A missing configuration is recoverable and exposes no content.
  await page.route("**/luna/vault/config.json", route=>route.fulfill({status:503,body:"Unavailable"}));
  await page.getByLabel("Our passphrase").fill(passphrase);await page.getByRole("button",{name:"Come inside"}).click();
  await expect(page.locator("#unlock-error")).toBeVisible(); expect(await page.locator("img").count()).toBe(0);
  await page.unroute("**/luna/vault/config.json");
  // A tampered authenticated catalog fails closed.
  const catalog = `**/${config.manifest.id}.bin`;
  await page.route(catalog, async route=> {const response=await route.fetch();const bytes=await response.body();bytes[20]^=1;await route.fulfill({response,body:bytes});});
  await page.getByLabel("Our passphrase").fill(passphrase);await page.getByRole("button",{name:"Come inside"}).click();
  await expect(page.locator("#unlock-error")).toContainText("could not open");
  await expect(page.getByLabel("Our passphrase")).toBeEnabled();expect(await page.locator("img").count()).toBe(0);
  await page.unroute(catalog);
  const started=Date.now();await unlock();await page.waitForFunction(()=>[...document.images].filter(img=>img.complete&&img.naturalWidth>0).length>=3);
  const revealMs=Date.now()-started;
  const initialBytes=await page.evaluate(()=>performance.getEntriesByType("resource").filter(entry=>entry.name.endsWith(".bin")).reduce((sum,entry)=>sum+entry.transferSize,0));
  // Large-photo retry works after a download failure.
  const first=ordinaryPhotos[0];let failures=0;
  await page.route(`**/${first.full.id}.bin`,async route=>{if(failures++===0)await route.fulfill({status:503,body:"Unavailable"});else await route.continue();});
  await page.locator('[class*="photoTile"]').first().click();
  await expect(page.getByRole("dialog").getByText("Photo unavailable")).toBeVisible();
  await page.getByRole("button",{name:"Try again",exact:true}).click();
  await page.waitForFunction(()=>{const img=document.querySelector('[role="dialog"] img');return img?.complete&&img.naturalWidth>0;});
  await page.getByRole("button",{name:"Close photo viewer"}).click();
  await page.unroute(`**/${first.full.id}.bin`);
  // All ordinary thumbnails remain reachable without exposing sealed photos.
  while(await page.getByRole("button",{name:/A few more moments/}).count()) await page.getByRole("button",{name:/A few more moments/}).click();
  await expect(page.locator('[class*="photoTile"]')).toHaveCount(ordinaryPhotos.length);
  for(const chapter of sealedChapters){
    const collection=page.locator(`[data-sealed-collection="${chapter.id}"]`);
    const special=manifest.photos.find(photo=>photo.group===chapter.id);
    // Resealing while decryption/download is pending cannot reveal a late image.
    await page.route(`**/${special.medium.id}.bin`,async route=>{await new Promise(resolve=>setTimeout(resolve,700));try{await route.continue();}catch{/* cancelled on reseal */}});
    await collection.getByRole("button",{name:chapter.presentation.openLabel,exact:true}).click();
    await expect(collection).toHaveAttribute("data-sealed-open","true");
    await collection.getByRole("button",{name:chapter.presentation.closeLabel,exact:true}).click();
    await page.waitForTimeout(900);
    await expect(collection).toHaveAttribute("data-sealed-open","false");
    await expect(collection.locator("img")).toHaveCount(0);
    await page.unroute(`**/${special.medium.id}.bin`);
  }
  await page.getByRole("button",{name:"Lock",exact:true}).click();await expect(page.getByLabel("Our passphrase")).toBeVisible();
  await unlock();
  // Late photo downloads cannot restore content after lock.
  await page.route("**/luna/vault/*/*.bin",async route=>{await new Promise(resolve=>setTimeout(resolve,800));try{await route.continue();}catch{/* cancelled on lock */}});
  await page.getByRole("combobox").selectOption(ordinaryChapters.at(-1).id);
  await page.getByRole("button",{name:"Lock",exact:true}).click();
  await page.waitForTimeout(1100);
  await expect(page.getByLabel("Our passphrase")).toBeVisible();expect(await page.locator('img[src^="blob:"]').count()).toBe(0);
  await page.unroute("**/luna/vault/*/*.bin");
  await unlock();
  await page.goto(origin+"/");
  await page.goBack();
  await expect(page.getByLabel("Our passphrase")).toBeVisible();
  expect(errors).toEqual([]);
  const report={origin,checks:["configuration-failure","catalog-tamper","photo-retry","all-ordinary-photos-reachable","reseal-during-download","lock-during-download","back-forward-relock"],ordinaryPhotos:ordinaryPhotos.length,sealedCollections:sealedChapters.length,revealMs,initialEncryptedTransferBytes:initialBytes,errors:0};
  await writeFile(path.join(privateDir,"qa",/127\.0\.0\.1|localhost/.test(origin)?"local-resilience.json":"live-resilience.json"),JSON.stringify(report,null,2)+"\n",{mode:0o600});
  console.log(JSON.stringify(report));
} finally {await context.close();await browser.close();}
