import { existsSync } from "node:fs";
import { chromium, webkit, expect } from "@playwright/test";

const origin = new URL(process.env.PORTFOLIO_TEST_ORIGIN ?? "http://127.0.0.1:4173").origin;
const engine = process.env.PORTFOLIO_BROWSER ?? "chromium";
if (!["chromium", "webkit"].includes(engine)) throw new Error("PORTFOLIO_BROWSER must be chromium or webkit");
const browser = await (engine === "webkit" ? webkit.launch() : chromium.launch({
  executablePath: process.env.PORTFOLIO_CHROME_PATH ?? (existsSync("/usr/bin/google-chrome") ? "/usr/bin/google-chrome" : undefined),
}));
const errors = [];
async function scenario(name, task) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, reducedMotion: "reduce",
    ignoreHTTPSErrors: ["localhost", "127.0.0.1", "[::1]"].includes(new URL(origin).hostname),
  });
  await context.route("**/*", route => {
    const request = route.request();
    return ["GET", "HEAD"].includes(request.method()) && new URL(request.url()).origin === origin
      ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.on("pageerror", error => errors.push(error.message));
  try {
    await task(page, context);
    console.log(`PASS ${engine}: ${name}`);
  } finally { await context.close(); }
}
async function openSearch(page) {
  await page.goto(origin + "/about/");
  await expect(page.getByRole("button", { name: /^Switch to .* mode$/ }).first()).toBeVisible();
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog", { name: "Search the website" })).toBeVisible();
}

try {
  await scenario("failed index can be retried", async (page, context) => {
    let attempts = 0;
    await context.route("**/search-index.json", route => ++attempts === 1
      ? route.fulfill({ status: 503, body: "Unavailable" }) : route.continue());
    await openSearch(page);
    await expect(page.getByRole("status")).toContainText("Search could not be loaded");
    await page.getByRole("button", { name: "Try again", exact: true }).click();
    await page.getByRole("combobox").fill("AWS");
    await expect(page.getByRole("option").first()).toBeVisible();
    expect(attempts).toBe(2);
  });

  await scenario("stalled index times out and retry recovers", async (page, context) => {
    let attempts = 0;
    await context.route("**/search-index.json", route => {
      if (++attempts > 1) return route.continue();
      // Leave the first request pending; the app must abort it, without retrying itself.
    });
    await page.clock.install();
    await openSearch(page);
    await expect.poll(() => attempts).toBe(1);
    await page.clock.fastForward(15_100);
    await expect(page.getByRole("status")).toContainText("Search took too long to load");
    expect(attempts).toBe(1);
    await page.getByRole("button", { name: "Try again", exact: true }).click();
    await page.getByRole("combobox").fill("CV");
    await expect(page.getByRole("option").first()).toBeVisible();
    expect(attempts).toBe(2);
  });

  await scenario("IME confirmation and editing shortcuts preserve input", async page => {
    await openSearch(page);
    const input = page.getByRole("combobox");
    await input.fill("AWS");
    await expect(page.getByRole("option").first()).toBeVisible();
    const selected = await input.getAttribute("aria-activedescendant");
    for (const init of [{ key: "Enter", isComposing: true }, { key: "Enter", keyCode: 229 }, { key: "ArrowDown", ctrlKey: true }]) {
      const consumed = await input.evaluate((element, init) => {
        const event = new KeyboardEvent("keydown", { ...init, bubbles: true, cancelable: true });
        element.dispatchEvent(event);
        return event.defaultPrevented;
      }, init);
      expect(consumed).toBe(false);
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(input).toHaveAttribute("aria-activedescendant", selected);
    }
    await input.press("ArrowDown");
    await expect(input).not.toHaveAttribute("aria-activedescendant", selected);
  });
  expect(errors).toEqual([]);
} finally { await browser.close(); }
