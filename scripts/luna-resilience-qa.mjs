import { chromium, expect } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
const privateDir = process.env.LUNA_PRIVATE_DIR;
if (!privateDir || !path.isAbsolute(privateDir) || path.resolve(privateDir).startsWith(process.cwd() + path.sep)) throw new Error("Set an external LUNA_PRIVATE_DIR");
const {passphrase} = JSON.parse(await readFile(path.join(privateDir,"access.json"),"utf8"));
process.on("uncaughtException", error => { console.error(String(error.message).replaceAll(passphrase,"[redacted]")); process.exit(1); });
const {manifest,config} = JSON.parse(await readFile(path.join(privateDir,"release-backup.json"),"utf8"));
const sealedChapters=manifest.chapters.filter(chapter=>chapter.presentation?.kind==="sealed");
const sealedIds=new Set(sealedChapters.map(chapter=>chapter.id));
const ordinaryChapters=manifest.chapters.filter(chapter=>!sealedIds.has(chapter.id));
const ordinaryPhotos=manifest.photos.filter(photo=>!sealedIds.has(photo.group)).sort((a,b)=>(a.sequence??0)-(b.sequence??0));
const trips=manifest.album.trips??[];
const tripForChapter=id=>trips.find(trip=>trip.chapterIds.includes(id));
const enterChapter=async id=>{const trip=tripForChapter(id);if(trip)await page.locator(`[data-journey-card="${trip.id}"]`).click();await page.locator(`[data-journey-card="${id}"]`).click();};
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
  // A failed navigation-cover decryption must preserve the journey action.
  const ungroupedChapters=ordinaryChapters.filter(chapter=>!tripForChapter(chapter.id));
  const coverChapter=ungroupedChapters.find(chapter=>!manifest.album.coverIds.includes(chapter.coverId))??ungroupedChapters[0];
  const coverPhoto=ordinaryPhotos.find(photo=>photo.id===coverChapter.coverId&&photo.group===coverChapter.id)??ordinaryPhotos.find(photo=>photo.group===coverChapter.id);
  const coverRoute=`**/${coverPhoto.medium.id}.bin`;
  await page.route(coverRoute,async route=>{const response=await route.fetch();const bytes=await response.body();bytes[20]^=1;await route.fulfill({response,body:bytes});});
  const started=Date.now();await unlock();await page.waitForFunction(()=>[...document.images].some(img=>img.src.startsWith("blob:")&&img.complete&&img.naturalWidth>0));
  const revealMs=Date.now()-started;
  const initialBytes=await page.evaluate(()=>performance.getEntriesByType("resource").filter(entry=>entry.name.endsWith(".bin")).reduce((sum,entry)=>sum+entry.transferSize,0));
  const failedCard=page.locator(`[data-journey-card="${coverChapter.id}"]`);
  await failedCard.scrollIntoViewIfNeeded();
  await expect(failedCard.getByText("Photo unavailable",{exact:true})).toBeVisible();
  await expect(failedCard).toHaveAccessibleName(`Open ${coverChapter.title}`);
  await page.unroute(coverRoute);
  await failedCard.focus();await page.keyboard.press("Enter");
  await expect(page.locator(`[data-journey-room="${coverChapter.id}"]`)).toBeVisible();
  expect(await page.locator("[data-photo-id]").evaluateAll(tiles=>tiles.map(tile=>tile.dataset.photoId))).toEqual(ordinaryPhotos.filter(photo=>photo.group===coverChapter.id).slice(0,24).map(photo=>photo.id));
  await page.getByRole("button",{name:"Back to journeys",exact:true}).click();
  // Large-photo retry works after a download failure.
  const first=ordinaryPhotos[0];let failures=0;
  await page.route(`**/${first.full.id}.bin`,async route=>{if(failures++===0)await route.fulfill({status:503,body:"Unavailable"});else await route.continue();});
  await page.getByRole("button",{name:/^All photos\b/}).click();
  await expect(page.locator('[data-journey-room="all"]')).toBeVisible();
  await page.locator('[class*="photoTile"]').first().click();
  await expect(page.getByRole("dialog").getByText("Photo unavailable")).toBeVisible();
  await page.getByRole("button",{name:"Try again",exact:true}).click();
  await page.waitForFunction(()=>{const img=document.querySelector('[role="dialog"] img');return img?.complete&&img.naturalWidth>0;});
  await page.getByRole("button",{name:"Close photo viewer"}).click();
  await page.unroute(`**/${first.full.id}.bin`);
  // All ordinary thumbnails remain reachable without exposing sealed photos.
  while(await page.getByRole("button",{name:/A few more moments/}).count()) await page.getByRole("button",{name:/A few more moments/}).click();
  await expect(page.locator('[class*="photoTile"]')).toHaveCount(ordinaryPhotos.length);
  expect(await page.locator("[data-photo-id]").evaluateAll(tiles=>tiles.map(tile=>tile.dataset.photoId))).toEqual(ordinaryPhotos.map(photo=>photo.id));
  await expect(page.locator("[data-sealed-photo]")).toHaveCount(0);
  await page.getByRole("button",{name:"Back to journeys",exact:true}).click();
  for(const chapter of sealedChapters){
    const collection=page.locator(`[data-sealed-collection="${chapter.id}"]`);
    const special=manifest.photos.find(photo=>photo.group===chapter.id);
    // Resealing while decryption/download is pending cannot reveal a late image.
    let downloadStarted=false;
    await page.route(`**/${special.medium.id}.bin`,async route=>{downloadStarted=true;await new Promise(resolve=>setTimeout(resolve,700));try{await route.continue();}catch{/* cancelled on reseal */}});
    await collection.getByRole("button",{name:chapter.presentation.openLabel,exact:true}).click();
    await expect(collection).toHaveAttribute("data-sealed-open","true");
    await collection.locator("[data-sealed-photo]").first().scrollIntoViewIfNeeded();
    await expect.poll(()=>downloadStarted).toBe(true);
    await collection.getByRole("button",{name:chapter.presentation.closeLabel,exact:true}).click();
    await page.waitForTimeout(900);
    await expect(collection).toHaveAttribute("data-sealed-open","false");
    await expect(collection.locator("img")).toHaveCount(0);
    await page.unroute(`**/${special.medium.id}.bin`);
  }
  await page.getByRole("button",{name:"Lock",exact:true}).click();await expect(page.getByLabel("Our passphrase")).toBeVisible();
  await unlock();
  // Late photo downloads cannot restore content after lock.
  const largestChapter=ordinaryChapters.reduce((largest,chapter)=>ordinaryPhotos.filter(photo=>photo.group===chapter.id).length>ordinaryPhotos.filter(photo=>photo.group===largest.id).length?chapter:largest);
  const pendingIds=new Set(ordinaryPhotos.filter(photo=>photo.group===largestChapter.id).map(photo=>photo.thumb.id));
  let pendingRoomDownloads=0;
  await page.route("**/luna/vault/*/*.bin",async route=>{if(pendingIds.has(new URL(route.request().url()).pathname.split("/").at(-1)?.replace(/\.bin$/,"")))pendingRoomDownloads++;await new Promise(resolve=>setTimeout(resolve,800));try{await route.continue();}catch{/* cancelled on lock */}});
  await enterChapter(largestChapter.id);
  await expect(page.locator(`[data-journey-room="${largestChapter.id}"]`)).toBeVisible();
  await expect.poll(()=>pendingRoomDownloads).toBeGreaterThan(0);
  await page.getByRole("button",{name:"Lock",exact:true}).click();
  await page.waitForTimeout(1100);
  await expect(page.getByLabel("Our passphrase")).toBeVisible();expect(await page.locator('img[src^="blob:"]').count()).toBe(0);
  await page.unroute("**/luna/vault/*/*.bin");
  await unlock();
  await page.goto(origin+"/");
  await page.goBack();
  await expect(page.getByLabel("Our passphrase")).toBeVisible();
  expect(errors).toEqual([]);
  const report={origin,checks:["configuration-failure","catalog-tamper","corrupt-journey-cover-preserves-navigation","photo-retry","all-ordinary-photos-reachable","all-photo-id-scope","reseal-during-confirmed-download","journey-lock-during-confirmed-download","back-forward-relock"],ordinaryPhotos:ordinaryPhotos.length,ordinaryChapters:ordinaryChapters.length,sealedCollections:sealedChapters.length,revealMs,initialEncryptedTransferBytes:initialBytes,errors:0};
  await writeFile(path.join(privateDir,"qa",/127\.0\.0\.1|localhost/.test(origin)?"local-resilience.json":"live-resilience.json"),JSON.stringify(report,null,2)+"\n",{mode:0o600});
  console.log(JSON.stringify(report));
} finally {await context.close();await browser.close();}
