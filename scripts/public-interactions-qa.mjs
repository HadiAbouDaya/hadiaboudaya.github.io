import { existsSync } from "node:fs";
// Run against a built static export. No messages or external requests are sent.
import { chromium, webkit, expect } from '@playwright/test';

const origin = new URL(process.env.PORTFOLIO_TEST_ORIGIN ?? 'http://127.0.0.1:4173').origin;
const engine = process.env.PORTFOLIO_BROWSER ?? 'chromium';
if (!['chromium', 'webkit'].includes(engine)) throw new Error('PORTFOLIO_BROWSER must be chromium or webkit');
const browser = await (engine === 'webkit' ? webkit.launch() : chromium.launch({
  executablePath: process.env.PORTFOLIO_CHROME_PATH ?? (existsSync("/usr/bin/google-chrome") ? "/usr/bin/google-chrome" : undefined),
}));
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce',
  ignoreHTTPSErrors: ['127.0.0.1', 'localhost', '[::1]'].includes(new URL(origin).hostname),
});
await context.route('**/*', route => {
  const request = route.request();
  // Public interactions need only reads from this export. Keep production runs
  // from emitting analytics or submitting a real contact message.
  if (!['GET', 'HEAD'].includes(request.method()) || new URL(request.url()).origin !== origin) return route.abort();
  return route.continue();
});
const page = await context.newPage();
page.setDefaultTimeout(10000);
const errors = [];
const failedRequests = [];
page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText, testTransition }));
page.on('pageerror', error => errors.push({ message: error.message, stack: error.stack, phase, testTransition }));
let phase = 'setup';
let testTransition = false;
const transition = async (label, action) => {
  await page.waitForLoadState('networkidle');
  testTransition = label;
  try {
    const result = await action();
    await page.waitForLoadState('networkidle');
    return result;
  } finally { testTransition = false; }
};
const resize = viewport => transition(`resize:${viewport.width}`, () => page.setViewportSize(viewport));
const run = async (name, task) => {
  phase = name;
  await task();
  console.log(`PASS ${engine}: ${name}`);
};
const visit = async path => {
  // Finish speculative route prefetches before replacing the document. WebKit
  // otherwise reports aborted old-document RSC requests as access-control errors.
  await page.waitForLoadState('networkidle');
  await transition(`navigate:${path}`, () => page.goto(origin + path));
  await expect(page.getByRole('button', { name: /^Switch to .* mode$/ }).first()).toBeVisible();
};
// Record whether the actual React handler consumed a modified action, then
// suppress browser defaults in this test only (no new tabs/history changes).
const unconsumedAction = async (locator, type, action) => {
  await page.evaluate(eventType => {
    window.__publicQAAction = null;
    const record = event => {
      if (eventType === 'keydown' && !event.key.startsWith('Arrow')) return;
      document.removeEventListener(eventType, record);
      window.__publicQAAction = { prevented: event.defaultPrevented };
      event.preventDefault();
    };
    document.addEventListener(eventType, record);
  }, type);
  await action(locator);
  expect(await page.evaluate(() => window.__publicQAAction)).toEqual({ prevented: false });
};

try {
  await run('search shortcut and browser-owned modified links', async () => {
    await visit('/experience/');
    await page.keyboard.press('Control+Shift+K');
    await expect(page.getByRole('dialog', { name: 'Search the website' })).toBeVisible();
    await page.getByRole('combobox').fill('AWS');
    const result = page.locator('#search-option-0');
    await expect(result).toBeVisible();
    for (const modifier of ['Control', 'Meta', 'Shift', 'Alt']) {
      await unconsumedAction(result, 'click', link => link.click({ modifiers: [modifier] }));
      await expect(page.getByRole('dialog', { name: 'Search the website' })).toBeVisible();
    }
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await page.keyboard.down('Control');
    await page.keyboard.down('k');
    await expect(page.getByRole('dialog', { name: 'Search the website' })).toBeVisible();
    await page.keyboard.down('k'); // repeat must not toggle the open dialog away
    await expect(page.getByRole('dialog', { name: 'Search the website' })).toBeVisible();
    await page.keyboard.up('k');
    await page.keyboard.up('Control');
    await page.keyboard.press('Escape');
  });

  await run('mobile menu focus, ordinary navigation and modified links', async () => {
    await resize({ width: 390, height: 844 });
    await visit('/about/');
    const opener = page.getByRole('button', { name: 'Open menu' });
    await opener.click();
    const dialog = page.getByRole('dialog', { name: 'Site navigation' });
    await expect(dialog).toBeVisible();
    await expect(opener).toHaveAttribute('aria-expanded', 'true');
    await expect(dialog.getByRole('link', { name: 'About', exact: true })).toBeFocused();
    const contact = dialog.getByRole('link', { name: 'Contact', exact: true });
    await contact.focus();
    await page.keyboard.press('Tab');
    await expect(dialog.getByRole('button', { name: 'Close menu' })).toBeFocused();
    await unconsumedAction(contact, 'click', link => link.click({ modifiers: ['Control'] }));
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(opener).toBeFocused();
    await expect(opener).toHaveAttribute('aria-expanded', 'false');
    await opener.click();
    await dialog.getByRole('link', { name: 'About', exact: true }).click();
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await expect(page.locator('#main-content')).toBeFocused();
    await opener.click();
    await dialog.getByRole('link', { name: 'Experience', exact: true }).click();
    await expect(page).toHaveURL(origin + '/experience/');
    await expect(page.locator('#main-content')).toBeFocused();
    await expect(page.locator('dialog[open]')).toHaveCount(0);
  });

  await run('article reading and navigation remain usable on a narrow viewport', async () => {
    await resize({ width: 320, height: 844 });
    await visit('/blog/aws-lambda-vs-inngest/');
    await expect(page.locator('main img').first()).toHaveAttribute('fetchpriority', 'high');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const menu = page.getByRole('dialog', { name: 'Site navigation' });
    await expect(menu.getByRole('link', { name: 'Blog', exact: true })).toHaveAttribute('aria-current', 'page');
    await page.keyboard.press('Escape');

    const heading = page.locator('[data-article-body] h2[id]').first();
    await heading.evaluate(element => { window.location.hash = element.id; });
    await expect.poll(() => heading.evaluate(element => element.getBoundingClientRect().top)).toBeGreaterThanOrEqual(64);
    await expect.poll(() => heading.evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(120);
    const adjacent = page.getByRole('navigation', { name: 'More articles' });
    await adjacent.scrollIntoViewIfNeeded();
    for (const link of await adjacent.getByRole('link').all()) {
      expect(await link.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
      expect(await link.locator('.truncate').count()).toBe(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  await run('page layout respects reading widths and fixed-header spacing', async () => {
    await resize({ width: 1440, height: 900 });
    for (const [path, width] of [['/blog/', 896], ['/privacy/', 768], ['/contact/', 1024]]) {
      await visit(path);
      const container = page.locator('main .container-main').first();
      expect(await container.evaluate(element => element.getBoundingClientRect().width)).toBe(width);
    }
    await resize({ width: 320, height: 844 });
    await visit('/blog/');
    expect(await page.getByRole('heading', { name: 'Blog', exact: true }).evaluate(element => element.getBoundingClientRect().top)).toBe(96);
    const cover = page.locator('[data-blog-slug] img').first();
    await expect(cover).not.toHaveAttribute('loading', 'lazy');
    await expect(cover).toHaveAttribute('fetchpriority', 'high');
    await expect(cover).toHaveAttribute('sizes', /896px$/);
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('body > header')).toBeHidden();
    await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toHaveCSS('color', 'rgb(17, 24, 39)');
    await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toHaveCSS('background-image', 'none');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await page.emulateMedia({ media: 'screen' });
  });

  await run('suggested searches restore typing focus and empty results offer recovery', async () => {
    await resize({ width: 1440, height: 900 });
    await visit('/about/');
    await page.getByRole('button', { name: /^Search(?:\s*Ctrl.*)?$/ }).first().click();
    const dialog = page.getByRole('dialog', { name: 'Search the website' });
    const input = dialog.getByRole('combobox');
    await dialog.getByRole('button', { name: 'AWS', exact: true }).click();
    await expect(input).toBeFocused();
    await expect(input).toHaveValue('AWS');
    await input.fill('zzzz-no-matching-portfolio-content');
    await expect(dialog.getByRole('status')).toHaveText('0 results');
    await dialog.getByRole('button', { name: 'Clear search', exact: true }).click();
    await expect(input).toBeFocused();
    await expect(input).toHaveValue('');
    await expect(dialog.getByRole('button', { name: 'AWS', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
  });

  await run('filter keyboard controls and Experience history restoration', async () => {
    await resize({ width: 1440, height: 900 });
    await visit('/experience/');
    const filters = page.getByRole('radiogroup', { name: 'Filter experience by type' });
    await filters.getByRole('radio', { name: 'All', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(filters.getByRole('radio', { name: 'Professional roles' })).toBeChecked();
    await expect(page).toHaveURL(origin + '/experience/?view=professional');
    await page.keyboard.press('ArrowRight');
    await expect(filters.getByRole('radio', { name: 'Education' })).toBeChecked();
    await page.goBack();
    await expect(filters.getByRole('radio', { name: 'Professional roles' })).toBeChecked();
    await expect(page.locator('#education-experience')).toBeHidden();
    await page.goForward();
    await expect(filters.getByRole('radio', { name: 'Education' })).toBeChecked();
    await expect(page.locator('#professional-experience')).toBeHidden();

    await visit('/certifications/');
    const types = page.getByRole('radiogroup', { name: 'Filter by type', exact: true });
    const all = types.getByRole('radio', { name: /^All\b/ });
    await all.focus();
    await unconsumedAction(all, 'keydown', radio => radio.press('Alt+ArrowLeft'));
    await expect(all).toBeChecked();
    await page.keyboard.press('ArrowRight');
    await expect(types.getByRole('radio', { name: /^Professional Certifications\b/ })).toBeChecked();
  });

  await run('search reveals a credential excluded by the current filter', async () => {
    await visit('/certifications/');
    await page.getByRole('radiogroup', { name: 'Filter learning records by topic' })
      .getByRole('radio', { name: /^AWS\b/ }).click();
    await page.getByRole('button', { name: /^Search(?:\s*Ctrl.*)?$/ }).first().click();
    await page.getByRole('combobox').fill('Azure Fundamentals');
    const result = page.locator('#search-results a').filter({ hasText: 'Azure Fundamentals AZ-900' });
    const href = await result.getAttribute('href');
    const target = page.locator(new URL(href, origin).hash);
    await result.click();
    await expect(target).toBeVisible();
    await expect(target).toBeFocused();
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await expect.poll(() => target.evaluate(element => element.getBoundingClientRect().top)).toBeGreaterThanOrEqual(0);
    await expect.poll(() => target.evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(200);
  });

  await run('gallery edges, resizing, zoom reset and modal focus', async () => {
    for (const width of [320, 1440]) {
      await resize({ width, height: 900 });
      // Resize the same gallery rather than reloading it between viewport checks.
      if (width === 320) await visit('/events/building-smarter-aws-bekaa/');
      const gallery = page.getByRole('region', { name: /gallery$/ });
      const lastDot = gallery.getByRole('button', { name: 'Go to image 9', exact: true });
      const firstDot = gallery.getByRole('button', { name: 'Go to image 1', exact: true });
      await lastDot.click();
      await expect(lastDot).toHaveAttribute('aria-current', 'true');
      await expect(gallery.getByRole('button', { name: 'Scroll right', exact: true })).toBeDisabled();
      await gallery.getByRole('button', { name: 'Scroll left', exact: true }).click();
      await expect(gallery.getByRole('button', { name: 'Go to image 8', exact: true })).toHaveAttribute('aria-current', 'true');
      await firstDot.click();
      await expect(gallery.getByRole('button', { name: 'Scroll left', exact: true })).toBeDisabled();
      await resize({ width: width === 320 ? 1440 : 320, height: 900 });
      await expect(firstDot).toHaveAttribute('aria-current', 'true');
      await resize({ width, height: 900 });
      const opener = gallery.getByRole('button', { name: /^Open .*image 1 of/ });
      await page.evaluate(() => { document.body.style.overflow = 'clip'; });
      await opener.click();
      const dialog = page.getByRole('dialog', { name: /image viewer$/ });
      const close = dialog.getByRole('button', { name: 'Close image viewer' });
      const next = dialog.getByRole('button', { name: 'Next image', exact: true });
      const previous = dialog.getByRole('button', { name: 'Previous image', exact: true });
      await expect(close).toBeFocused();
      expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
      await page.keyboard.press('Shift+Tab');
      await expect(next).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(close).toBeFocused();
      await dialog.getByRole('button', { name: 'Zoom in', exact: true }).click();
      await expect(dialog.getByRole('button', { name: 'Zoom out', exact: true })).toHaveText('200%');
      const image = dialog.locator('img');
      await expect(image).toBeVisible();
      const box = await image.boundingBox();
      const x = Math.max(60, Math.min(width - 60, box.x + box.width / 2));
      await page.mouse.move(x, 450);
      await page.mouse.down();
      await page.mouse.move(x + 30, 480, { steps: 5 });
      await page.mouse.up();
      await next.focus();
      await page.keyboard.press('Enter');
      await expect(dialog.getByRole('button', { name: 'Zoom in', exact: true })).toHaveText('100%');
      await expect.poll(() => image.evaluate(element => getComputedStyle(element.parentElement).transform))
        .toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
      for (let index = 2; index < 9; index++) await page.keyboard.press('Enter');
      await expect(next).toBeFocused();
      await expect(next).toHaveAttribute('aria-disabled', 'true');
      await page.keyboard.press('Enter');
      await expect(dialog.getByText('Image 9 of 9', { exact: true })).toBeVisible();
      await previous.focus();
      for (let index = 9; index > 1; index--) await page.keyboard.press('Enter');
      await expect(previous).toBeFocused();
      await expect(previous).toHaveAttribute('aria-disabled', 'true');
      await page.keyboard.press('Escape');
      await expect(opener).toBeFocused();
      expect(await page.evaluate(() => document.body.style.overflow)).toBe('clip');
      await opener.click();
      await expect(dialog.getByRole('button', { name: 'Zoom in', exact: true })).toHaveText('100%');
      await page.keyboard.press('Escape');
      await page.evaluate(() => { document.body.style.overflow = ''; });
    }
  });

  await run('Back to top restores reading focus and respects reduced motion', async () => {
    await visit('/about/');
    for (const reducedMotion of ['reduce', 'no-preference']) {
      await page.emulateMedia({ reducedMotion });
      await page.evaluate(() => {
        window.__publicQAScroll = [];
        const original = window.scrollTo.bind(window);
        window.scrollTo = (...args) => { window.__publicQAScroll.push(args); return original(...args); };
      });
      await page.getByRole('button', { name: 'Back to top' }).click();
      await expect(page.locator('#main-content')).toBeFocused();
      expect(await page.evaluate(() => window.__publicQAScroll.at(-1)[0])).toEqual({
        top: 0, behavior: reducedMotion === 'reduce' ? 'instant' : 'smooth',
      });
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => !!document.activeElement?.closest('footer'))).toBe(false);
    }
  });

  await run('unmatched static URLs export an English 404 document', async () => {
    await page.waitForLoadState('networkidle');
    const response = await transition('navigate:404', () => page.goto(origin + '/__public-interactions-missing__/'));
    expect(response.status()).toBe(404);
    expect(await response.text()).toMatch(/<html\b[^>]*\blang="en"/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
    await page.getByRole('link', { name: 'Go home' }).click();
    await expect(page).toHaveURL(origin + '/');
  });
  if (errors.length) console.log(JSON.stringify({ failedRequests }, null, 2));
  expect(errors, 'No uncaught page errors').toEqual([]);
  console.log(`public-interactions-qa: ${engine} passed all 10 scenarios`);
} catch (error) {
  console.error(`public-interactions-qa failed (${engine}, ${phase}): ${error.message}`);
  process.exitCode = 1;
} finally {
  await context.close();
  await browser.close();
}
