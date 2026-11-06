import { expect } from '@playwright/test';
import { launchPublicBrowser } from './lib/public-browser.mjs';
const origin = process.env.PORTFOLIO_TEST_ORIGIN ?? 'http://127.0.0.1:4173';
const { browser, engine } = await launchPublicBrowser();
try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 3,
    ignoreHTTPSErrors: ['127.0.0.1', 'localhost', '[::1]'].includes(new URL(origin).hostname),
  });
  await context.route('**/*', route => ['GET', 'HEAD'].includes(route.request().method()) && new URL(route.request().url()).origin === new URL(origin).origin ? route.continue() : route.abort());
  await context.addInitScript(() => {
    window.__globePaints = 0;
    const clear = CanvasRenderingContext2D.prototype.clearRect;
    CanvasRenderingContext2D.prototype.clearRect = function (...args) { window.__globePaints++; return clear.apply(this, args); };
    const connection = new EventTarget();
    connection.saveData = false;
    Object.defineProperty(navigator, 'connection', { value: connection, configurable: true });
  });
  const page = await context.newPage();
  await page.goto(origin);
  await expect(page.locator('canvas')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__globePaints)).toBeGreaterThan(2);
  const dimensions = await page.locator('canvas').evaluate(canvas => ({ pixels: canvas.width, css: canvas.getBoundingClientRect().width }));
  expect(dimensions.pixels).toBeLessThanOrEqual(Math.ceil(dimensions.css * 2));
  const samples = async () => {
    const before = await page.evaluate(() => ({ paints: window.__globePaints, time: performance.now() }));
    await page.waitForTimeout(600);
    const after = await page.evaluate(() => ({ paints: window.__globePaints, time: performance.now() }));
    return { paints: after.paints - before.paints, seconds: (after.time - before.time) / 1000 };
  };
  const active = await samples();
  expect(active.paints / active.seconds).toBeLessThan(36);
  await page.evaluate(() => { navigator.connection.saveData = true; navigator.connection.dispatchEvent(new Event('change')); });
  expect((await samples()).paints).toBe(0);
  await page.evaluate(() => { navigator.connection.saveData = false; navigator.connection.dispatchEvent(new Event('change')); });
  await expect.poll(async () => (await samples()).paints).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Media-query delivery triggers a static redraw; measure once it settles.
  await expect.poll(async () => (await samples()).paints).toBe(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await expect(page.locator('canvas')).not.toBeInViewport();
  // Let the intersection callback cancel the last scheduled animation frame.
  await page.waitForTimeout(100);
  expect((await samples()).paints).toBe(0);
  console.log(`PASS ${engine}: globe paint budget, DPR cap, Save Data, reduced motion and offscreen suspension`);
  await context.close();
} finally {
  await browser.close();
}
