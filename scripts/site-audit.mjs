import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { existsSync } from 'node:fs';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createPreview } from './preview.mjs';

// Scan the actual release artifact, including every article and event detail.
// Reports and screenshots stay outside the public repository/export.
const reportDir = await mkdtemp(path.join(tmpdir(), 'portfolio-site-audit-'));
const server = createPreview('out');
let browser;
const results = [];
let reportWrite = Promise.resolve();
function saveReport() {
  // Theme workers share results; serialize writes to avoid overlapping writes.
  reportWrite = reportWrite.then(() => writeFile(path.join(reportDir, 'report.json'), JSON.stringify(results, null, 2)));
  return reportWrite;
}
try {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
  const publicPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
  const templates = new Set(['/', '/about/', '/experience/', '/events/', '/certifications/', '/blog/', '/contact/', '/privacy/',
    '/blog/michelin-principle-ai-software-factories/', '/events/copyalpha-launch/']);
  const paths = process.env.PORTFOLIO_AUDIT_SCOPE === 'templates' ? publicPaths.filter(route => templates.has(route)) : publicPaths;
  if (!paths.length) throw new Error('No public routes found in sitemap');
  browser = await chromium.launch({
    executablePath: process.env.PORTFOLIO_CHROME_PATH ?? (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined),
  });
  await Promise.all(['light', 'dark'].map(async colorScheme => {
    for (const width of [320, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme, reducedMotion: 'reduce' });
      await context.route('**/*', route => {
        const request = route.request();
        return ['GET', 'HEAD'].includes(request.method()) && new URL(request.url()).origin === origin
          ? route.continue() : route.abort();
      });
      await context.addInitScript(() => {
        window.__auditFailedImages = [];
        document.addEventListener('error', event => {
          if (event.target instanceof HTMLImageElement) window.__auditFailedImages.push(event.target.currentSrc || event.target.src);
        }, true);
      });
      const page = await context.newPage();
      let pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      for (const route of paths) {
        pageErrors = [];
        const response = await page.goto(origin + route);
        await page.getByRole('button', { name: /^Switch to .* mode$/ }).first().waitFor();
        await page.evaluate(() => document.fonts.ready);
        // Fetch below-fold imagery too; otherwise lazy images can evade checks.
        // This is audit-only: production loading behavior is left unchanged.
        await page.evaluate(() => { for (const img of document.images) img.loading = 'eager'; });
        await page.waitForFunction(() => [...document.images].every(img => img.complete));
        // Settle layout/reveal transitions before examining contrast and bounds.
        await page.waitForLoadState('networkidle');
        const layout = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          h1Count: document.querySelectorAll('main h1').length,
          brokenImages: [...new Set([...window.__auditFailedImages, ...[...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.getAttribute('src'))])],
        }));
        const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
        const result = { route, width, colorScheme, status: response.status(), ...layout, errors: [...pageErrors],
          violations: axe.violations.map(({ id, impact, help, nodes }) => ({ id, impact, help, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) })),
          manualReview: axe.incomplete.map(({ id, nodes }) => ({ id, targets: nodes.map(node => node.target) })),
        };
        results.push(result);
        await saveReport();
        const issues = result.violations.length + result.errors.length + result.brokenImages.length + Number(result.overflow) + Number(result.h1Count !== 1) + Number(result.status !== 200);
        console.log(`${issues ? 'FAIL' : 'PASS'} ${colorScheme} ${width} ${route}${issues ? ` (${issues} issues)` : ''}`);
        if (issues) console.log(JSON.stringify(result));
        if (process.env.PORTFOLIO_AUDIT_SCREENSHOTS === '1' && ['/', '/about/', '/experience/', '/events/', '/blog/', '/contact/'].includes(route)) {
          await page.screenshot({ path: path.join(reportDir, `${route.replaceAll('/', '_')}-${colorScheme}-${width}.png`), fullPage: true });
        }
      }
      await context.close();
    }
  }));
} finally {
  await saveReport();
  await browser?.close();
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
  console.log(`Audit report: ${reportDir}/report.json`);
}
const failures = results.filter(r => r.status !== 200 || r.h1Count !== 1 || r.overflow || r.brokenImages.length || r.errors.length || r.violations.length);
console.log(`${results.length} route/theme/viewport checks; ${failures.length} failed. Automated checks do not replace manual accessibility review.`);
if (failures.length) process.exitCode = 1;
