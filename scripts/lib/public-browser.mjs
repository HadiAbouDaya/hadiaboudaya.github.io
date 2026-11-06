import { existsSync } from 'node:fs';
import { chromium, webkit } from '@playwright/test';

// One policy for all public QA suites. WebKit never receives Chromium-only
// executable overrides, and a misspelled selector must not silently run Chrome.
export function publicBrowserConfig(env = process.env, fileExists = existsSync) {
  const engine = env.PORTFOLIO_BROWSER ?? 'chromium';
  if (!['chromium', 'webkit'].includes(engine)) {
    throw new Error('PORTFOLIO_BROWSER must be chromium or webkit');
  }
  const launchOptions = engine === 'chromium' ? {
    executablePath: env.PORTFOLIO_CHROME_PATH ?? (fileExists('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined),
  } : {};
  return { engine, launchOptions };
}

export async function launchPublicBrowser(env = process.env) {
  const { engine, launchOptions } = publicBrowserConfig(env);
  const browser = await (engine === 'webkit' ? webkit : chromium).launch(launchOptions);
  return { browser, engine };
}
