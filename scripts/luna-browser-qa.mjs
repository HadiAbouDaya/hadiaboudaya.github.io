// End-to-end checks use credentials and screenshots kept outside this repository.
import { chromium, webkit, expect } from "@playwright/test";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const privateDir = process.env.LUNA_PRIVATE_DIR;
if (!privateDir || !path.isAbsolute(privateDir) || path.resolve(privateDir).startsWith(process.cwd() + path.sep)) throw new Error("Set an external LUNA_PRIVATE_DIR");
const { passphrase } = JSON.parse(await readFile(path.join(privateDir, "access.json"), "utf8"));
process.on("uncaughtException", error => { console.error(String(error.message).replaceAll(passphrase,"[redacted]")); process.exit(1); });
const { manifest, config } = JSON.parse(await readFile(path.join(privateDir, "release-backup.json"), "utf8"));
const origin = process.env.LUNA_TEST_ORIGIN ?? "http://127.0.0.1:4173";
const live = !/localhost|127\.0\.0\.1/.test(origin);
const engine = process.env.LUNA_BROWSER ?? "chromium";
const browser = engine === "webkit" ? await webkit.launch() : await chromium.launch({ executablePath: process.env.LUNA_CHROME_PATH ?? "/opt/google/chrome/chrome" });
const qaDir = path.join(privateDir, "qa");
await mkdir(qaDir, { recursive: true, mode: 0o700 });
const reports = [];

try {
  for (const size of [{ name: "desktop", width: 1440, height: 1000 }, { name: "phone", width: 390, height: 844 }, { name: "small-phone", width: 320, height: 740 }]) {
    const context = await browser.newContext({ viewport: size, reducedMotion: "reduce", ...(size.name !== "desktop" ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
    await context.addInitScript(() => {
      window.__lunaQA = { blobs: new Set(), starts: [], stopped: 0 };
      const create = URL.createObjectURL, revoke = URL.revokeObjectURL;
      URL.createObjectURL = function(blob) { const url = create.call(this, blob); window.__lunaQA.blobs.add(url); return url; };
      URL.revokeObjectURL = function(url) { window.__lunaQA.blobs.delete(url); return revoke.call(this, url); };
      if (window.AudioBufferSourceNode) {
        const start = AudioBufferSourceNode.prototype.start, stop = AudioBufferSourceNode.prototype.stop;
        AudioBufferSourceNode.prototype.start = function(...args) { window.__lunaQA.starts.push(args); return start.apply(this,args); };
        AudioBufferSourceNode.prototype.stop = function(...args) { window.__lunaQA.stopped++; return stop.apply(this,args); };
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
    await page.waitForFunction(() => document.querySelectorAll('img[src^="blob:"]').length >= 3 && [...document.images].every(image => image.complete && image.naturalWidth > 0));
    await expect(page.locator('[class*="journeyCard"]')).toHaveCount(manifest.chapters.length);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('link[rel="manifest"],link[as="font"]').count()).toBe(0);
    await page.screenshot({ path: path.join(qaDir, `${live ? "live" : "local"}-${engine}-${size.name}-album.png`) });

    // All inferred visit chapters contain their complete matching collection.
    for (const chapter of manifest.chapters) {
      await page.getByRole("combobox").selectOption(chapter.id);
      const count = manifest.photos.filter(photo => photo.group === chapter.id).length;
      await expect(page.locator('[class*="photoCount"]')).toHaveText(`${count} ${count === 1 ? "photograph" : "photographs"}`);
      await expect(page.locator('[class*="photoTile"]')).toHaveCount(Math.min(24, count));
    }
    await page.getByRole("combobox").selectOption("");
    await page.getByRole("button", {name:/A few more moments/}).click();
    await expect(page.locator('[class*="photoTile"]')).toHaveCount(48);
    await page.locator('[class*="photoTile"]').first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.waitForFunction(() => { const image = document.querySelector('[role="dialog"] img'); return image?.complete && image.naturalWidth > 0; });
    await page.getByRole("button", {name:"Next photo",exact:true}).click();
    await expect(page.locator('[class*="viewerToolbar"]')).toContainText("2");
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator('[class*="viewerToolbar"]')).toContainText("1");
    await page.getByRole("button", {name:"Zoom into photo"}).click();
    await expect(page.getByRole("button", {name:"Fit photo to screen"})).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.getByRole("button", {name:"Surprise me"}).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", {name:"Close photo viewer"}).click();
    expect(await page.evaluate(() => window.__lunaQA.blobs.size < 60)).toBe(true);

    const song = manifest.birthday.assets[manifest.birthday.text.songAsset];
    const songURL = `${origin}/luna/vault/${config.release}/${song.id}.bin`;
    const songBefore = requests.filter(url => url === songURL).length;
    await page.getByRole("link", {name:"The birthday keepsake"}).click();
    await expect(page.locator(".luna-entry")).toBeVisible();
    expect(requests.filter(url => url === songURL).length).toBe(songBefore);
    await page.getByRole("button", {name:manifest.birthday.text.open,exact:true}).click();
    await expect(page.locator(".luna-entry")).toHaveCount(0);
    await page.waitForFunction(() => window.__lunaQA.starts.some(args => args[1] === 131), {timeout:20000});
    await page.getByRole("button", {name:manifest.birthday.text.bloomLabel,exact:true}).click();
    await expect(page.locator(".luna-bloom-burst")).toHaveCount(1);
    await page.getByRole("button", {name:manifest.birthday.text.candlesLabel,exact:true}).click();
    await expect(page.locator(".luna-finale")).toHaveClass(/is-celebrating/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: path.join(qaDir, `${live ? "live" : "local"}-${engine}-${size.name}-birthday.png`) });
    await page.getByRole("link", {name:"Album",exact:true}).click();
    await expect(page.locator("#album-title")).toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
    expect(await page.evaluate(() => window.__lunaQA.stopped)).toBeGreaterThan(0);

    await page.getByRole("button", {name:"Lock",exact:true}).click();
    await expect(page.getByLabel("Our passphrase")).toBeVisible();
    expect(await page.locator('img[src^="blob:"]').count()).toBe(0);
    await page.waitForFunction(() => window.__lunaQA.blobs.size === 0);
    expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
    expect(await page.evaluate(() => document.cookie)).toBe("");
    await unlock();
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
    reports.push({ viewport:size.name, engine, checks:"unlock,wrong-key,all-chapters,pagination,viewer,zoom,keyboard,birthday,audio-offset,flowers,candles,lock,blob-cleanup,history,reload,isolation", errors:0, externalRequests:0, knownWebKitReplacementDiagnostics:navigationDiagnostics.length });
    await context.close();
    console.log(`${engine} ${size.name}: passed`);
  }
  const result = {origin, reports};
  await writeFile(path.join(qaDir, `${live ? "live" : "local"}-${engine}-browser.json`), JSON.stringify(result,null,2)+"\n", {mode:0o600});
} finally { await browser.close(); }
