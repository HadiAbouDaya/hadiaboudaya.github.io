// End-to-end checks use credentials and screenshots kept outside this repository.
import { chromium, webkit, expect } from "@playwright/test";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const privateDir = process.env.LUNA_PRIVATE_DIR;
if (!privateDir || !path.isAbsolute(privateDir) || path.resolve(privateDir).startsWith(process.cwd() + path.sep)) throw new Error("Set an external LUNA_PRIVATE_DIR");
const { passphrase } = JSON.parse(await readFile(path.join(privateDir, "access.json"), "utf8"));
let qaPhase = "setup";
process.on("uncaughtException", error => { console.error(`[${qaPhase}] ${String(error.message).replaceAll(passphrase,"[redacted]")}`); process.exit(1); });
const { manifest, config } = JSON.parse(await readFile(path.join(privateDir, "release-backup.json"), "utf8"));
const sealedChapters = manifest.chapters.filter(chapter => chapter.presentation?.kind === "sealed");
const sealedIds = new Set(sealedChapters.map(chapter => chapter.id));
const ordinaryChapters = manifest.chapters.filter(chapter => !sealedIds.has(chapter.id));
const ordinaryPhotos = manifest.photos.filter(photo => !sealedIds.has(photo.group)).sort((a,b)=>(a.sequence??0)-(b.sequence??0));
const trips = manifest.album.trips ?? [];
const tripForChapter = id => trips.find(trip=>trip.chapterIds.includes(id));
const overviewIds = [...ordinaryChapters.filter(chapter=>!tripForChapter(chapter.id)).map(chapter=>chapter.id),...trips.map(trip=>trip.id)];
const openChapter = async (page,id,keyboard=false) => {
  const trip=tripForChapter(id);
  if(trip) await page.locator(`[data-journey-card="${trip.id}"]`).click();
  const card=page.locator(`[data-journey-card="${id}"]`);
  if(trip) await card.evaluate(element=>element.addEventListener("click",()=>{if(window.__lunaQA)window.__lunaQA.stopEntryScroll=scrollY;},{once:true,capture:true}));
  if(keyboard){await card.focus();await page.keyboard.press("Enter");}else await card.click();
};
const settleVisibleCovers = async page => {
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(()=>[...document.querySelectorAll("[data-journey-card]")].filter(card=>{const rect=card.getBoundingClientRect();return rect.bottom>0&&rect.top<innerHeight;}).every(card=>{const image=card.querySelector("img");return image?.complete&&image.naturalWidth>0;}));
  await expect(page.locator('[data-journey-card] [role="status"]')).toHaveCount(0);
};
const sealedAssetIds = new Set(manifest.photos.filter(photo => sealedIds.has(photo.group)).flatMap(photo => [photo.thumb.id, photo.medium.id, photo.full.id]));
const isSealedAssetRequest = url => sealedAssetIds.has(new URL(url).pathname.split("/").at(-1)?.replace(/\.bin$/, ""));
const origin = process.env.LUNA_TEST_ORIGIN ?? "http://127.0.0.1:4173";
const live = !/localhost|127\.0\.0\.1/.test(origin);
const engine = process.env.LUNA_BROWSER ?? "chromium";
const saveDataOnly = process.env.LUNA_QA_SAVE_DATA_ONLY === "1";
const browser = engine === "webkit" ? await webkit.launch() : await chromium.launch({ executablePath: process.env.LUNA_CHROME_PATH ?? "/opt/google/chrome/chrome" });
const qaDir = path.join(privateDir, "qa");
await mkdir(qaDir, { recursive: true, mode: 0o700 });
const reports = [];

try {
  for (const size of saveDataOnly ? [] : [{ name: "desktop", width: 1440, height: 1000 }, { name: "phone", width: 390, height: 844 }, { name: "small-phone", width: 320, height: 740 }]) {
    qaPhase=`${engine} ${size.name}: unlock`;
    const context = await browser.newContext({ viewport: size, reducedMotion: "reduce", ...(size.name !== "desktop" ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
    await context.addInitScript(() => {
      window.__lunaQA = { blobs: new Set(), starts: [], stopped: 0, realStarts: [], activeSongSources: new Set() };
      const create = URL.createObjectURL, revoke = URL.revokeObjectURL;
      URL.createObjectURL = function(blob) { const url = create.call(this, blob); window.__lunaQA.blobs.add(url); return url; };
      URL.revokeObjectURL = function(url) { window.__lunaQA.blobs.delete(url); return revoke.call(this, url); };
      if (window.AudioBufferSourceNode) {
        const start = AudioBufferSourceNode.prototype.start, stop = AudioBufferSourceNode.prototype.stop, disconnect = AudioBufferSourceNode.prototype.disconnect;
        AudioBufferSourceNode.prototype.start = function(...args) {
          const result=start.apply(this,args);window.__lunaQA.starts.push(args);
          // Safari's one-sample context-unlock source is deliberately silent.
          if(this.buffer?.duration>1){window.__lunaQA.realStarts.push({args,path:location.pathname,visibility:document.visibilityState});window.__lunaQA.activeSongSources.add(this);this.addEventListener("ended",()=>window.__lunaQA.activeSongSources.delete(this),{once:true});}
          return result;
        };
        AudioBufferSourceNode.prototype.stop = function(...args) { window.__lunaQA.stopped++;window.__lunaQA.activeSongSources.delete(this);return stop.apply(this,args); };
        AudioBufferSourceNode.prototype.disconnect = function(...args) {window.__lunaQA.activeSongSources.delete(this);return disconnect.apply(this,args);};
      }
    });
    const page = await context.newPage(), errors = [], external = [], requests = [], navigationDiagnostics = [];
    let replacingDocument = false;
    page.setDefaultTimeout(20000);
    page.on("pageerror", error => {
      // WebKit r2370 misclassifies old-document requests during replacement.
      // Record this exact native diagnostic only during our explicit reload;
      // application rejections, CSP failures, and ordinary fetch errors still fail.
      const prefix = `Fetch API cannot load ${new URL(origin).origin}/luna/vault/`;
      if (engine === "webkit" && replacingDocument && error.stack?.startsWith(prefix) && /\/[a-f0-9-]{36}\.bin due to access control checks\./.test(error.stack)) navigationDiagnostics.push(error.message);
      else errors.push(error.message);
    });
    page.on("console", message => { if (message.type() === "error" && /content.security.policy|refused to|hydration|react error/i.test(message.text())) errors.push(message.text()); });
    page.on("request", request => { const url = request.url(); requests.push(url); if (/^https?:/.test(url) && new URL(url).origin !== new URL(origin).origin) external.push(new URL(url).hostname); });
    const unlock = async () => {
      await page.getByLabel("Our passphrase").fill(passphrase);
      await page.getByRole("button", { name: "Come inside" }).click();
      await expect(page.locator("#album-title")).toHaveText(manifest.album.title, {timeout:20000});
    };
    await page.goto(origin + "/luna/", { waitUntil: "networkidle" });
    await expect(page.getByLabel("Our passphrase")).toBeVisible();
    expect(await page.locator('img[src^="blob:"]').count()).toBe(0);
    expect(requests.some(url => url.endsWith(".bin"))).toBe(false);
    await page.getByLabel("Our passphrase").fill("incorrect-passphrase-for-negative-check");
    await page.getByRole("button", { name: "Come inside" }).click();
    await expect(page.locator("#unlock-error")).toBeVisible();
    expect(await page.locator('img[src^="blob:"]').count()).toBe(0);
    await unlock();
    await page.waitForFunction(() => [...document.images].some(image => image.src.startsWith("blob:") && image.complete && image.naturalWidth > 0));
    await expect(page.locator("[data-journey-card]")).toHaveCount(overviewIds.length);
    expect((await page.locator("[data-journey-card]").evaluateAll(cards=>cards.map(card=>card.dataset.journeyCard))).sort()).toEqual([...overviewIds].sort());
    await expect(page.locator("[data-journey-room]")).toHaveCount(0);
    await expect(page.locator("[data-photo-id]")).toHaveCount(0);
    expect(requests.some(isSealedAssetRequest)).toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('link[rel="manifest"],link[as="font"]').count()).toBe(0);
    await page.screenshot({ path: path.join(qaDir, `${live ? "live" : "local"}-${engine}-${size.name}-album.png`) });
    const hero = page.locator("[data-journey-hero]").last();
    const heroId = await hero.getAttribute("data-journey-hero");
    const heroGroup = ordinaryPhotos.find(photo => photo.id === heroId)?.group;
    expect(heroGroup).toBeTruthy();
    await hero.scrollIntoViewIfNeeded();
    // Pointer actions can finish scrolling a transformed card into view. Record
    // the actual entry position before React changes the view, not before that.
    await hero.evaluate(element => element.addEventListener("click", () => { window.__lunaQA.heroEntryScroll = scrollY; }, {once:true,capture:true}));
    await hero.click();
    const heroScroll = await page.evaluate(() => window.__lunaQA.heroEntryScroll);
    await expect(page.locator(`[data-journey-room="${tripForChapter(heroGroup)?.id ?? heroGroup}"]`)).toBeVisible();
    await page.getByRole("button",{name:"Back to journeys",exact:true}).click();
    await expect(hero).toBeFocused();
    await expect.poll(() => page.evaluate(expected => Math.abs(scrollY - expected),heroScroll)).toBeLessThan(4);
    const firstHero = page.locator("[data-journey-hero]").first();
    const firstHeroId = await firstHero.getAttribute("data-journey-hero");
    const firstHeroGroup = ordinaryPhotos.find(photo => photo.id === firstHeroId)?.group;
    await firstHero.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(`[data-journey-room="${tripForChapter(firstHeroGroup)?.id ?? firstHeroGroup}"]`)).toBeVisible();
    await page.getByRole("button",{name:"Back to journeys",exact:true}).click();
    await expect(firstHero).toBeFocused();
    await page.locator('section[aria-labelledby="journeys-title"]').evaluate(element=>element.scrollIntoView({block:"start",behavior:"instant"}));
    await expect(page.locator("[data-journey-card]").first().locator("img")).toBeVisible();
    await settleVisibleCovers(page);
    if(overviewIds.length>1){
      qaPhase=`${engine} ${size.name}: cover visibility lifecycle`;
      const firstCard=page.locator("[data-journey-card]").first(), lastCard=page.locator("[data-journey-card]").last();
      for(let cycle=0;cycle<3;cycle++){
        await lastCard.evaluate(element=>element.scrollIntoView({block:"start",behavior:"instant"}));
        await expect(firstCard.locator("img")).toHaveCount(0);
        await firstCard.evaluate(element=>element.scrollIntoView({block:"start",behavior:"instant"}));
        await expect(firstCard.locator("img")).toBeVisible();
        await expect(firstCard.locator('[role="status"]')).toHaveCount(0);
      }
      await settleVisibleCovers(page);
    }
    await page.screenshot({path:path.join(qaDir,`${live ? "live" : "local"}-${engine}-${size.name}-journey-grid.png`)});

    // A confirmed trip gathers its stop cards and every child photo in order.
    for(const trip of trips){
      qaPhase=`${engine} ${size.name}: trip ${trip.id}`;
      const card=page.locator(`[data-journey-card="${trip.id}"]`);
      await card.click();
      const room=page.locator(`[data-trip-room="${trip.id}"]`);
      await expect(room).toBeVisible();
      await expect(room).toBeFocused();
      await expect(room).toHaveAttribute("data-journey-room",trip.id);
      expect(await room.locator("[data-journey-card]").evaluateAll(cards=>cards.map(card=>card.dataset.journeyCard))).toEqual(trip.chapterIds);
      const photos=trip.chapterIds.flatMap(id=>ordinaryPhotos.filter(photo=>photo.group===id));
      await expect(room.locator("[data-photo-id]")).toHaveCount(Math.min(24,photos.length));
      expect(await room.locator("[data-photo-id]").evaluateAll(tiles=>tiles.map(tile=>tile.dataset.photoId))).toEqual(photos.slice(0,24).map(photo=>photo.id));
      await expect(room.locator("[data-journey-effect]")).toHaveCount(0);
      await expect(page.locator("[data-sealed-collection]")).toHaveCount(0);
      const firstTripPhoto=room.locator("[data-photo-id]").first();
      await firstTripPhoto.focus();
      await page.keyboard.press("Enter");
      await expect(page.locator('[class*="viewerToolbar"]')).toContainText(`/ ${photos.length}`);
      await page.keyboard.press("ArrowLeft");
      await expect(page.locator('[class*="viewerToolbar"]')).toContainText(`${photos.length} / ${photos.length}`);
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(firstTripPhoto).toBeFocused();
      await room.locator("[data-journey-card]").first().evaluate(element=>element.scrollIntoView({block:"start",behavior:"instant"}));
      await expect(room.locator("[data-journey-card]").first().locator("img")).toBeVisible();
      await settleVisibleCovers(page);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      await page.screenshot({path:path.join(qaDir,`${live ? "live" : "local"}-${engine}-${size.name}-trip-${trip.id}-stops.png`)});
      await page.getByRole("button",{name:"Back to journeys",exact:true}).click();
      await expect(card).toBeFocused();
    }

    // Each visually reviewed journey opens a distinct room with only its photos.
    for (const chapter of ordinaryChapters) {
      qaPhase=`${engine} ${size.name}: chapter ${chapter.id}`;
      const card = page.locator(`[data-journey-card="${chapter.id}"]`);
      await openChapter(page,chapter.id,chapter===ordinaryChapters[0]);
      const tripEntryScroll=tripForChapter(chapter.id)?await page.evaluate(()=>window.__lunaQA.stopEntryScroll):null;
      const room = page.locator(`[data-journey-room="${chapter.id}"]`);
      const photos = ordinaryPhotos.filter(photo => photo.group === chapter.id);
      await expect(room).toBeVisible();
      await expect(room).toBeFocused();
      await expect(room).toHaveAttribute("data-journey-motif", chapter.journey?.motif ?? "paper");
      await expect(room.locator("[data-photo-id]")).toHaveCount(Math.min(24, photos.length));
      expect(await room.locator("[data-photo-id]").evaluateAll(tiles => tiles.map(tile => tile.dataset.photoId))).toEqual(photos.slice(0, 24).map(photo => photo.id));
      await expect(page.locator("[data-sealed-collection]")).toHaveCount(0);
      if (chapter === ordinaryChapters[0]) {
        const firstTile = room.locator("[data-photo-id]").first();
        await firstTile.focus();
        await page.keyboard.press("Enter");
        await expect(page.getByRole("dialog")).toBeVisible();
        await expect(page.locator('[class*="viewerToolbar"]')).toContainText(`/ ${photos.length}`);
        await page.keyboard.press("ArrowLeft");
        await expect(page.locator('[class*="viewerToolbar"]')).toContainText(`${photos.length} / ${photos.length}`);
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toHaveCount(0);
        await expect(firstTile).toBeFocused();
      }
      const effect = room.locator("[data-journey-effect]");
      await expect(effect).toHaveAttribute("aria-pressed", "false");
      if (chapter.journey) await expect(effect).toHaveText(chapter.journey.actionLabel);
      await effect.click();
      await expect(effect).toHaveAttribute("aria-pressed", "true");
      if (chapter.journey) await expect(effect).toHaveText(chapter.journey.activeLabel);
      expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
      expect(await room.locator("section[data-active]").evaluate(element => element.getAnimations({subtree:true}).length)).toBe(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(room.locator('[role="status"]')).toHaveCount(0);
      await page.screenshot({ path: path.join(qaDir, `${live ? "live" : "local"}-${engine}-${size.name}-journey-${chapter.id}.png`) });
      await effect.click();
      await expect(effect).toHaveAttribute("aria-pressed", "false");
      const trip=tripForChapter(chapter.id);
      await page.getByRole("button", {name:trip?"Back to the whole trip":"Back to journeys", exact:true}).click();
      await expect(card).toBeFocused();
      if(trip){
        await expect(page.locator(`[data-trip-room="${trip.id}"]`)).toBeVisible();
        await expect.poll(()=>page.evaluate(expected=>Math.abs(scrollY-expected),tripEntryScroll)).toBeLessThan(4);
        await page.getByRole("button",{name:"Back to journeys",exact:true}).click();
        await expect(page.locator(`[data-journey-card="${trip.id}"]`)).toBeFocused();
      }
      await expect(page.locator("[data-journey-room]")).toHaveCount(0);
      expect(requests.some(isSealedAssetRequest)).toBe(false);
    }
    // The all-photo room excludes sealed collections and retains pagination.
    qaPhase=`${engine} ${size.name}: all-photo viewer`;
    const allPhotos = page.getByRole("button", {name:/^All photos\b/});
    await allPhotos.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator('[data-journey-room="all"]')).toBeVisible();
    await expect(page.locator("[data-journey-effect]")).toHaveCount(0);
    await expect(page.locator("[data-sealed-collection]")).toHaveCount(0);
    await expect(page.locator("[data-photo-id]")).toHaveCount(Math.min(24, ordinaryPhotos.length));
    expect(await page.locator("[data-photo-id]").evaluateAll(tiles => tiles.map(tile => tile.dataset.photoId))).toEqual(ordinaryPhotos.slice(0, 24).map(photo => photo.id));
    await page.getByRole("button", {name:/A few more moments/}).click();
    await expect(page.locator('[class*="photoTile"]')).toHaveCount(48);
    await page.locator('[class*="photoTile"]').first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.waitForFunction(() => { const image = document.querySelector('[role="dialog"] img'); return image?.complete && image.naturalWidth > 0; });
    await page.getByRole("button", {name:"Next photo",exact:true}).click();
    await expect(page.locator('[class*="viewerToolbar"]')).toContainText("2");
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator('[class*="viewerToolbar"]')).toContainText("1");
    if (size.name !== "desktop") {
      const stage = page.locator('[class*="viewerStage"]').first();
      await stage.dispatchEvent("touchstart", {touches:[{identifier:1,clientX:280,clientY:350}],changedTouches:[]});
      await stage.dispatchEvent("touchend", {touches:[],changedTouches:[{identifier:1,clientX:100,clientY:355}]});
      await expect(page.locator('[class*="viewerToolbar"]')).toContainText("2");
    }
    await page.getByRole("button", {name:"Zoom into photo"}).click();
    await expect(page.getByRole("button", {name:"Fit photo to screen"})).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    const surprise=page.getByRole("button", {name:"Surprise me",exact:true});
    expect(await surprise.evaluate(button=>{
      const bounds=button.getBoundingClientRect(),walker=document.createTreeWalker(button,NodeFilter.SHOW_TEXT);let node,visibleLabel=false;
      while((node=walker.nextNode()))if(node.textContent.trim()){
        const range=document.createRange();range.selectNodeContents(node);const text=range.getBoundingClientRect();
        if(text.width>0&&text.height>0&&parseFloat(getComputedStyle(node.parentElement).fontSize)>0)visibleLabel=text.left>=bounds.left-1&&text.right<=bounds.right+1&&text.top>=bounds.top-1&&text.bottom<=bounds.bottom+1;
      }
      return visibleLabel;
    })).toBe(true);
    await surprise.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", {name:"Close photo viewer"}).click();
    expect(await page.evaluate(() => window.__lunaQA.blobs.size < 60)).toBe(true);
    expect(requests.some(isSealedAssetRequest)).toBe(false);
    await page.getByRole("button", {name:"Back to journeys",exact:true}).click();
    await expect(page.locator("[data-journey-room]")).toHaveCount(0);
    await expect(allPhotos).toBeFocused();

    // Special collections stay sealed and unfetched until deliberately opened.
    for (const chapter of sealedChapters) {
      qaPhase=`${engine} ${size.name}: sealed ${chapter.id}`;
      const sealedPhotos = manifest.photos.filter(photo => photo.group === chapter.id);
      const collection = page.locator(`[data-sealed-collection="${chapter.id}"]`);
      await expect(collection).toHaveAttribute("data-sealed-open", "false");
      await expect(collection.locator("[data-sealed-photo]")).toHaveCount(0);
      await expect(collection.locator("img")).toHaveCount(0);
      await collection.getByRole("button", {name:chapter.presentation.openLabel,exact:true}).click();
      await expect(collection).toHaveAttribute("data-sealed-open", "true");
      await expect(collection.locator("[data-sealed-photo]")).toHaveCount(sealedPhotos.length);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await collection.locator("[data-sealed-photo]").first().click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(page.locator('[class*="viewerToolbar"]')).toContainText(`/ ${sealedPhotos.length}`);
      await page.waitForFunction(() => { const image = document.querySelector('[role="dialog"] img'); return image?.complete && image.naturalWidth > 0; });
      await page.keyboard.press("ArrowRight");
      await expect(page.locator('[class*="viewerToolbar"]')).toContainText("2");
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(collection.locator('img[src^="blob:"]').first()).toBeVisible();
      await page.screenshot({path:path.join(qaDir, `${live ? "live" : "local"}-${engine}-${size.name}-sealed.png`)});
      const exposedURLs = await collection.locator('img[src^="blob:"]').evaluateAll(images => images.map(image => image.src));
      await collection.getByRole("button", {name:chapter.presentation.closeLabel,exact:true}).click();
      await expect(collection).toHaveAttribute("data-sealed-open", "false");
      await expect(collection.locator("img")).toHaveCount(0);
      await page.waitForFunction(urls => urls.every(url => !window.__lunaQA.blobs.has(url)), exposedURLs);
      await collection.getByRole("button", {name:chapter.presentation.openLabel,exact:true}).click();
      await expect(collection.locator("[data-sealed-photo]")).toHaveCount(sealedPhotos.length);
      await collection.getByRole("button", {name:chapter.presentation.closeLabel,exact:true}).click();
    }

    const song = manifest.birthday.assets[manifest.birthday.text.songAsset];
    qaPhase=`${engine} ${size.name}: birthday`;
    const songURL = `${origin}/luna/vault/${config.release}/${song.id}.bin`;
    const songBefore = requests.filter(url => url === songURL).length;
    expect(songBefore).toBe(0);
    expect(await page.evaluate(()=>window.__lunaQA.realStarts.length)).toBe(0);
    await page.getByRole("link", {name:"The birthday keepsake"}).click();
    await expect(page.locator(".luna-entry")).toBeVisible();
    expect(requests.filter(url => url === songURL).length).toBe(songBefore);
    expect(await page.evaluate(()=>window.__lunaQA.realStarts.length)).toBe(0);
    await page.getByRole("button", {name:manifest.birthday.text.open,exact:true}).click();
    await expect(page.locator(".luna-entry")).toHaveCount(0);
    await page.waitForFunction(() => window.__lunaQA.starts.some(args => args[1] === 131), {timeout:20000});
    await expect.poll(()=>page.evaluate(()=>window.__lunaQA.activeSongSources.size)).toBe(1);
    await page.getByRole("button", {name:manifest.birthday.text.bloomLabel,exact:true}).click();
    await expect(page.locator(".luna-bloom-burst")).toHaveCount(1);
    await page.waitForFunction(()=>document.querySelectorAll(".luna-bouquet-image").length===2&&[...document.querySelectorAll(".luna-bouquet-image")].every(host=>{const image=host.querySelector("img");return image?.complete&&image.naturalWidth>0;}));
    const bouquetBackgrounds=await page.locator(".luna-bouquet-image > span").evaluateAll(wrappers=>wrappers.map(wrapper=>{
      const style=getComputedStyle(wrapper),canvas=document.createElement("canvas");canvas.width=canvas.height=1;
      const context=canvas.getContext("2d");context.fillStyle=style.backgroundColor;context.fillRect(0,0,1,1);
      return {alpha:context.getImageData(0,0,1,1).data[3],image:style.backgroundImage};
    }));
    expect(bouquetBackgrounds).toEqual([{alpha:0,image:"none"},{alpha:0,image:"none"}]);
    await expect(page.locator('.luna-bouquet-image [class*="imagePlaceholder"]')).toHaveCount(0);
    await page.getByRole("button", {name:manifest.birthday.text.candlesLabel,exact:true}).click();
    await expect(page.locator(".luna-finale")).toHaveClass(/is-celebrating/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: path.join(qaDir, `${live ? "live" : "local"}-${engine}-${size.name}-birthday.png`) });
    // Headless engines keep background tabs visible; simulate that lifecycle
    // signal explicitly and require a new user tap when visibility returns.
    await page.evaluate(()=>{Object.defineProperty(document,"hidden",{configurable:true,value:true});Object.defineProperty(document,"visibilityState",{configurable:true,value:"hidden"});document.dispatchEvent(new Event("visibilitychange"));});
    await expect.poll(()=>page.evaluate(()=>window.__lunaQA.activeSongSources.size)).toBe(0);
    const beforeVisible=await page.evaluate(()=>window.__lunaQA.realStarts.length);
    await page.evaluate(()=>{delete document.hidden;delete document.visibilityState;document.dispatchEvent(new Event("visibilitychange"));});
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    expect(await page.evaluate(()=>window.__lunaQA.realStarts.length)).toBe(beforeVisible);
    await page.getByRole("button",{name:manifest.birthday.text.playLabel,exact:true}).click();
    await expect.poll(()=>page.evaluate(()=>window.__lunaQA.activeSongSources.size)).toBe(1);
    await page.getByRole("link", {name:"Album",exact:true}).click();
    await expect(page.locator("#album-title")).toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
    await expect.poll(()=>page.evaluate(()=>window.__lunaQA.activeSongSources.size)).toBe(0);
    const beforeReentry=await page.evaluate(()=>window.__lunaQA.realStarts.length);
    await page.getByRole("link",{name:"The birthday keepsake"}).click();
    await expect(page.locator(".luna-entry")).toBeVisible();
    expect(await page.evaluate(()=>window.__lunaQA.realStarts.length)).toBe(beforeReentry);
    await page.getByRole("button",{name:manifest.birthday.text.open,exact:true}).click();
    await expect.poll(()=>page.evaluate(()=>window.__lunaQA.activeSongSources.size)).toBe(1);
    await page.getByRole("button",{name:"Lock",exact:true}).click();
    await expect(page.getByLabel("Our passphrase")).toBeVisible();
    await expect.poll(()=>page.evaluate(()=>window.__lunaQA.activeSongSources.size)).toBe(0);
    await page.goBack();
    await expect(page.getByLabel("Our passphrase")).toBeVisible();
    await unlock();
    expect(await page.evaluate(()=>window.__lunaQA.realStarts.every(start=>start.path.replace(/\/+$/,"")==="/luna/birthday"&&start.visibility==="visible"))).toBe(true);

    if (sealedChapters.length) {
      qaPhase=`${engine} ${size.name}: lifecycle`;
      const chapter = sealedChapters[0];
      await page.locator(`[data-sealed-collection="${chapter.id}"]`).getByRole("button", {name:chapter.presentation.openLabel,exact:true}).click();
    }
    await page.getByRole("button", {name:"Lock",exact:true}).click();
    await expect(page.getByLabel("Our passphrase")).toBeVisible();
    expect(await page.locator('img[src^="blob:"]').count()).toBe(0);
    await page.waitForFunction(() => window.__lunaQA.blobs.size === 0);
    expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
    expect(await page.evaluate(() => document.cookie)).toBe("");
    await unlock();
    for (const chapter of sealedChapters) {
      const collection = page.locator(`[data-sealed-collection="${chapter.id}"]`);
      await expect(collection).toHaveAttribute("data-sealed-open", "false");
      await expect(collection.locator("img")).toHaveCount(0);
    }
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide")));
    await expect(page.getByLabel("Our passphrase")).toBeVisible();
    await unlock();
    // WebKit r2370 reports same-origin requests started during document
    // replacement as access-control page errors (Playwright issue #43120).
    // Settle existing images first. Scroll restoration may still initiate old-
    // document image requests; record only that engine diagnostic above.
    // Pending-download locking has separate resilience coverage.
    await page.waitForLoadState("networkidle");
    replacingDocument = true;
    try { await page.reload(); } finally { replacingDocument = false; }
    await expect(page.getByLabel("Our passphrase")).toBeVisible();
    await page.goto(origin + "/luna/birthday/");
    await expect(page.getByLabel("Our passphrase")).toBeVisible();
    expect(external).toEqual([]);
    expect(errors).toEqual([]);
    reports.push({ viewport:size.name, engine, checks:"unlock,wrong-key,journey-overview,cover-visibility-reentry,trip-stop-hierarchy,trip-photo-scope,all-journey-rooms,room-photo-scope,journey-effects,reduced-motion,back-focus,all-photos,pagination,viewer,zoom,keyboard,mobile-swipe,sealed-no-prefetch,sealed-reveal,sealed-viewer,reseal,sealed-lock-reset,birthday,audio-offset,no-audio-before-open,audio-route-stop,audio-lock-stop,simulated-tab-hide-stop,no-audio-autoresume,flowers,bouquet-cutout-transparency,candles,lock,blob-cleanup,history,reload,isolation", ordinaryPhotos:ordinaryPhotos.length, ordinaryChapters:ordinaryChapters.length, overviewEntries:overviewIds.length, trips:trips.length, sealedCollections:sealedChapters.length, errors:0, externalRequests:0, knownWebKitReplacementDiagnostics:navigationDiagnostics.length });
    await context.close();
    console.log(`${engine} ${size.name}: passed`);
  }
  // A separate normal-motion context verifies deliberate, finite effects.
  if (!saveDataOnly) {
  qaPhase=`${engine}: normal motion`;
  const motionContext = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:"no-preference"});
  try {
    const page = await motionContext.newPage();
    const errors = [], external = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("request", request => { if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(origin).origin) external.push(new URL(request.url()).hostname); });
    await page.goto(origin + "/luna/");
    await page.getByLabel("Our passphrase").fill(passphrase);
    await page.getByRole("button",{name:"Come inside"}).click();
    await expect(page.locator("#album-title")).toHaveText(manifest.album.title,{timeout:20000});
    const chapter = ordinaryChapters.find(chapter => chapter.journey) ?? ordinaryChapters[0];
    await openChapter(page,chapter.id);
    const room = page.locator(`[data-journey-room="${chapter.id}"]`);
    const scene = room.locator("section[data-active]");
    const effect = room.locator("[data-journey-effect]");
    await expect(scene).toHaveAttribute("data-active","false");
    expect(await scene.evaluate(element => element.getAnimations({subtree:true}).length)).toBe(0);
    await effect.focus();
    await page.keyboard.press("Space");
    await expect(effect).toHaveAttribute("aria-pressed","true");
    await expect(scene).toHaveAttribute("data-active","true");
    const animations = await scene.evaluate(element => element.getAnimations({subtree:true}).map(animation => { const timing = animation.effect.getComputedTiming(); return {iterations:timing.iterations,duration:timing.duration}; }));
    expect(animations.length).toBeGreaterThan(0);
    expect(animations.every(animation => Number.isFinite(animation.iterations) && animation.iterations <= 2 && animation.duration <= 2000)).toBe(true);
    await expect.poll(() => scene.evaluate(element => element.getAnimations({subtree:true}).every(animation => animation.playState === "finished"))).toBe(true);
    await page.screenshot({path:path.join(qaDir,`${live ? "live" : "local"}-${engine}-desktop-normal-motion.png`)});
    await effect.click();
    await expect(effect).toHaveAttribute("aria-pressed","false");
    expect(await scene.evaluate(element => element.getAnimations({subtree:true}).length)).toBe(0);
    expect(external).toEqual([]);
    expect(errors).toEqual([]);
    reports.push({viewport:"desktop-normal-motion",engine,checks:"no-autoplay,keyboard-effect-activation,finite-normal-motion,effect-reset,isolation",motif:chapter.journey?.motif ?? "paper",animations:animations.length,errors:0,externalRequests:0});
    console.log(`${engine} desktop normal motion: passed`);
  } finally { await motionContext.close(); }
  }
  const saveDataContext = await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:"no-preference"});
  qaPhase=`${engine}: Save Data`;
  try {
    await saveDataContext.addInitScript(() => Object.defineProperty(navigator,"connection",{configurable:true,value:{saveData:true}}));
    const page = await saveDataContext.newPage(), errors = [];
    page.on("pageerror",error=>errors.push(error.message));
    await page.goto(origin+"/luna/");
    await page.getByLabel("Our passphrase").fill(passphrase);
    await page.getByRole("button",{name:"Come inside"}).click();
    await expect(page.locator("#album-title")).toHaveText(manifest.album.title,{timeout:20000});
    const chapter = ordinaryChapters.find(chapter=>chapter.journey)??ordinaryChapters[0];
    await openChapter(page,chapter.id);
    const room = page.locator(`[data-journey-room="${chapter.id}"]`), scene = room.locator("section[data-active]"), effect = room.locator("[data-journey-effect]");
    await expect(effect).toHaveAttribute("aria-pressed","false");
    await effect.click();
    await expect(effect).toHaveAttribute("aria-pressed","true");
    await expect(scene).toHaveAttribute("data-active","true");
    await expect(scene).toHaveAttribute("data-animate","false");
    await expect(scene.locator("svg")).toBeVisible();
    expect(await scene.evaluate(element=>element.getAnimations({subtree:true}).length)).toBe(0);
    expect(errors).toEqual([]);
    reports.push({viewport:"phone-save-data",engine,checks:"save-data-static-effect,save-data-no-motion",errors:0});
    console.log(`${engine} phone Save Data: passed`);
  } finally { await saveDataContext.close(); }
  const result = {origin, reports};
  await writeFile(path.join(qaDir, `${live ? "live" : "local"}-${engine}-${saveDataOnly ? "save-data" : "browser"}.json`), JSON.stringify(result,null,2)+"\n", {mode:0o600});
} finally { await browser.close(); }
