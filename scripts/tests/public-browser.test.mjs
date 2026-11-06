import test from 'node:test';
import assert from 'node:assert/strict';
import { publicBrowserConfig } from '../lib/public-browser.mjs';

test('public QA defaults to installed Chrome or the Playwright Chromium fallback', () => {
  assert.deepEqual(publicBrowserConfig({}, () => true), {
    engine: 'chromium', launchOptions: { executablePath: '/usr/bin/google-chrome' },
  });
  assert.deepEqual(publicBrowserConfig({}, () => false), {
    engine: 'chromium', launchOptions: { executablePath: undefined },
  });
});

test('an explicit Chromium executable takes precedence over system detection', () => {
  assert.deepEqual(publicBrowserConfig({ PORTFOLIO_BROWSER: 'chromium', PORTFOLIO_CHROME_PATH: '/custom/chrome' }, () => true), {
    engine: 'chromium', launchOptions: { executablePath: '/custom/chrome' },
  });
});

test('WebKit selection never launches a Chromium executable', () => {
  assert.deepEqual(publicBrowserConfig({ PORTFOLIO_BROWSER: 'webkit', PORTFOLIO_CHROME_PATH: '/custom/chrome' }, () => true), {
    engine: 'webkit', launchOptions: {},
  });
});

test('unsupported or empty selectors fail instead of silently using Chromium', () => {
  for (const engine of ['firefox', 'webkt', '']) {
    assert.throws(() => publicBrowserConfig({ PORTFOLIO_BROWSER: engine }), /PORTFOLIO_BROWSER must be chromium or webkit/);
  }
});
