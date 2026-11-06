import { expect } from "@playwright/test";
import { launchPublicBrowser } from "./lib/public-browser.mjs";

// Every Formspree request is intercepted. These checks never send a contact message.
const origin = process.env.PORTFOLIO_TEST_ORIGIN ?? "http://127.0.0.1:4173";
const { browser, engine } = await launchPublicBrowser();
const context = await browser.newContext({
  viewport: { width: 320, height: 800 },
  reducedMotion: "reduce",
  ignoreHTTPSErrors: new URL(origin).hostname === "127.0.0.1",
});
await context.route("**/*", route => {
  const request = route.request();
  return ["GET", "HEAD"].includes(request.method()) && new URL(request.url()).origin === new URL(origin).origin
    ? route.continue() : route.abort();
});
const page = await context.newPage();
page.setDefaultTimeout(10_000);
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
let behavior = "reject";
let attempts = 0;
const payloads = [];
let pendingRoute;
const json = (status, body) => ({
  status, contentType: "application/json", body: JSON.stringify(body),
  headers: { "access-control-allow-origin": "*" },
});
await context.route("https://formspree.io/**", async (route) => {
  if (route.request().method() === "OPTIONS") {
    return route.fulfill({ status: 204, headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST",
      "access-control-allow-headers": "accept,content-type",
    } });
  }
  attempts++;
  payloads.push(route.request().postData() ?? "");
  if (behavior === "reject") return route.fulfill(json(503, { error: "Test outage" }));
  if (behavior === "network") return route.abort("failed");
  pendingRoute = route;
});

async function fillValid() {
  await page.getByRole("textbox", { name: "Name", exact: true }).fill("QA visitor");
  await page.getByRole("textbox", { name: "Email", exact: true }).fill("qa@example.invalid");
  await page.getByRole("textbox", { name: "Message", exact: true }).fill("Intercepted browser validation. Never delivered.");
}
const submit = () => page.getByRole("button", { name: "Send Message", exact: true }).click();

try {
  await page.goto(`${origin}/contact/`);
  // Native fallback submission is legitimate before hydration, but this suite tests the enhanced form.
  await page.waitForFunction(() => Object.keys(document.querySelector("form") ?? {}).some((key) => key.startsWith("__reactProps")));
  await page.getByRole("textbox", { name: "Name", exact: true }).fill("   ");
  await page.getByRole("textbox", { name: "Email", exact: true }).fill("qa@example.invalid");
  await page.getByRole("textbox", { name: "Message", exact: true }).fill("   ");
  await submit();
  expect(attempts).toBe(0);
  expect(await page.getByRole("textbox", { name: "Name", exact: true }).evaluate((field) => field.validity.customError)).toBe(true);
  expect(await page.getByRole("textbox", { name: "Message", exact: true }).evaluate((field) => field.validity.customError)).toBe(true);

  await fillValid();
  await submit();
  await expect(page.locator("form").getByRole("alert")).toContainText("Something went wrong");
  await expect(page.locator("form").getByRole("alert")).toBeFocused();
  await expect(page.getByRole("textbox", { name: "Message", exact: true })).toHaveValue("Intercepted browser validation. Never delivered.");
  await expect(page.getByRole("button", { name: "Send Message", exact: true })).toBeEnabled();

  behavior = "hold";
  const previousAttempts = attempts;
  await submit();
  await expect.poll(() => Boolean(pendingRoute)).toBe(true);
  await expect(page.getByRole("textbox", { name: "Name", exact: true })).toBeDisabled();
  await expect(page.getByRole("textbox", { name: "Email", exact: true })).toBeDisabled();
  await expect(page.getByRole("textbox", { name: "Message", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Sending...", exact: true })).toBeDisabled();
  await page.locator("form").evaluate((form) => { form.requestSubmit(); form.requestSubmit(); });
  expect(attempts).toBe(previousAttempts + 1);
  await pendingRoute.fulfill(json(200, { ok: true }));
  pendingRoute = undefined;
  await expect(page.getByRole("heading", { name: "Message Sent!" })).toBeFocused();
  await page.getByRole("button", { name: "Send another message" }).click();
  await expect(page.getByRole("textbox", { name: "Name", exact: true })).toBeFocused();
  await expect(page.getByRole("textbox", { name: "Message", exact: true })).toHaveValue("");

  behavior = "network";
  await fillValid();
  await submit();
  await expect(page.locator("form").getByRole("alert")).toContainText("Delivery could not be confirmed");
  await expect(page.locator("form").getByRole("alert")).toBeFocused();
  await expect(page.locator("form").getByRole("alert").getByRole("link", { name: "Email me directly" })).toHaveAttribute("href", /^mailto:/);
  await expect(page.getByRole("textbox", { name: "Message", exact: true })).toHaveValue("Intercepted browser validation. Never delivered.");

  behavior = "hold";
  await page.clock.install();
  await submit();
  await expect.poll(() => Boolean(pendingRoute)).toBe(true);
  await page.clock.fastForward(20_001);
  await expect(page.locator("form").getByRole("alert")).toContainText("Delivery could not be confirmed");
  await expect(page.getByRole("button", { name: "Send Message", exact: true })).toBeEnabled();
  await expect(page.getByRole("textbox", { name: "Message", exact: true })).toHaveValue("Intercepted browser validation. Never delivered.");
  await pendingRoute.abort().catch(() => {});
  pendingRoute = undefined;
  await page.clock.resume();

  await page.goto(`${origin}/blog/michelin-principle-ai-software-factories/`);
  const index = await page.locator("pre").evaluateAll((blocks) => blocks.findIndex((block) => block.scrollWidth > block.clientWidth));
  expect(index, "the narrow article contains a horizontally scrollable code example").toBeGreaterThanOrEqual(0);
  const code = page.locator("pre").nth(index);
  await expect(code).toHaveAttribute("role", "region");
  await expect(code).toHaveAccessibleName("Code example");
  await code.focus();
  await expect(code).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => code.evaluate((block) => block.scrollLeft)).toBeGreaterThan(0);
  expect(payloads).toHaveLength(4);
  for (const payload of payloads) {
    expect(payload).toContain("QA visitor");
    expect(payload).toContain("qa@example.invalid");
    expect(payload).toContain("Intercepted browser validation. Never delivered.");
  }
  expect(errors).toEqual([]);
  console.log(`Contact and article browser QA passed (${engine === "webkit" ? "WebKit" : "Chromium"}); ${attempts} intercepted submissions, zero messages sent.`);
} finally {
  await browser.close();
}
