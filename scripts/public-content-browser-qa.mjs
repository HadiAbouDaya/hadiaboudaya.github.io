import { expect } from "@playwright/test";
import { launchPublicBrowser } from "./lib/public-browser.mjs";
import sharp from "sharp";

const origin = process.env.PORTFOLIO_TEST_ORIGIN ?? "http://127.0.0.1:4173";
const { browser, engine } = await launchPublicBrowser();
const paths = [
  "/", "/about/", "/experience/", "/events/", "/certifications/", "/blog/",
  "/blog/michelin-principle-ai-software-factories/", "/contact/", "/privacy/",
];
let checked = 0;
try {
  for (const width of [320, 1440]) {
    const context = await browser.newContext({
      javaScriptEnabled: false, viewport: { width, height: 900 }, colorScheme: "light",
      ignoreHTTPSErrors: new URL(origin).hostname === "127.0.0.1",
    });
    const page = await context.newPage();
    await context.route("**/*", (route) => {
      const request = route.request();
      return ["GET", "HEAD"].includes(request.method()) && new URL(request.url()).origin === new URL(origin).origin
        ? route.continue() : route.abort();
    });
    for (const path of paths) {
      await page.goto(origin + path);
      const main = page.locator("main");
      await expect(main.locator("h1")).toBeVisible();
      expect((await main.innerText()).trim().length, `${path} has useful content without JavaScript`).toBeGreaterThan(100);
      expect(await main.locator("h1").evaluate((heading) => Boolean(heading.closest("[hidden], [inert]")))).toBe(false);
      if (path === "/about/") {
        for (const language of ["French", "English", "Arabic"]) {
          const label = main.getByText(language, { exact: true });
          await expect(label).toBeVisible();
          expect(await label.evaluate(element => {
            for (let current = element; current; current = current.parentElement) {
              if (Number(getComputedStyle(current).opacity) < 1) return false;
            }
            return true;
          }), `${language} is legible without animation or JavaScript`).toBe(true);
        }
      }
      if (path === "/") {
        // The decorative canvas is optional; its dark background must still contrast with the white heading.
        const background = main.locator("section").first().locator('div[aria-hidden="true"]').first();
        await expect(background).toBeVisible();
        const { data } = await sharp(await page.screenshot()).extract({ left: 8, top: 100, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
        expect(data[0] + data[1] + data[2], "hero retains its dark no-script fallback").toBeLessThan(160);
        await expect(main.getByRole("link", { name: "Get in touch", exact: true })).toHaveAttribute("href", "/contact/");
      }
      if (path === "/contact/") {
        await expect(main.locator("form")).toHaveAttribute("method", "post");
        await expect(main.locator("form")).toHaveAttribute("action", /^https:\/\/formspree\.io\//);
      }
      checked++;
    }
    await context.close();
  }
  console.log(`No-JavaScript public content QA passed (${engine === "webkit" ? "WebKit" : "Chromium"}); ${checked} route/viewport checks.`);
} finally {
  await browser.close();
}
