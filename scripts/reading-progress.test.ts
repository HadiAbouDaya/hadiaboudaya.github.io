import assert from "node:assert/strict";
import test from "node:test";
import type { AnalyticsClient } from "../src/lib/analytics";
import fs from "node:fs";
import { createRequire } from "node:module";
import { runInThisContext } from "node:vm";
import ts from "typescript";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

// Native Node 22 type stripping, without a test-runner dependency or tsconfig mutation.
const reading: typeof import("../src/lib/reading-progress") = await import(new URL("../src/lib/reading-progress.ts", import.meta.url).href);
const analytics: typeof import("../src/lib/analytics") = await import(new URL("../src/lib/analytics.ts", import.meta.url).href);
const dates: typeof import("../src/lib/dates") = await import(new URL("../src/lib/dates.ts", import.meta.url).href);
// The repository is server-only in Next. In Node unit tests, mock only that
// bundler boundary; execute the actual module and its real YAML parser.
function loadServerCatalog(filesystem = fs): typeof import("../src/lib/mdx") {
  const filename = new URL("../src/lib/mdx.ts", import.meta.url);
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const record = { exports: {} };
  const require = createRequire(import.meta.url);
  const execute = runInThisContext(`(function(require,module,exports){${compiled}\n})`, { filename: filename.pathname });
  execute((name: string) => name === "server-only" ? {} : name === "./dates" ? dates : name === "node:fs" ? filesystem : require(name), record, record.exports);
  return record.exports as typeof import("../src/lib/mdx");
}
const mdx = loadServerCatalog();
const { createReadingSession, measureArticleProgress } = reading;
const { createAnalyticsController, sanitizeAnalyticsProperties, EVENTS } = analytics;
const end = { top: -1400, height: 2000, viewportHeight: 600 };
const beginning = { top: 600, height: 2000, viewportHeight: 600 };

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
async function settle() { await new Promise<void>((resolve) => setImmediate(resolve)); }

test("article geometry uses prose height, independent of direct child counts", () => {
  assert.equal(measureArticleProgress(beginning), 0);
  assert.equal(measureArticleProgress({ top: 100, height: 2000, viewportHeight: 600 }), 0.25);
  assert.equal(measureArticleProgress({ top: -900, height: 2000, viewportHeight: 600 }), 0.75);
  assert.equal(measureArticleProgress(end), 1);
  assert.equal(measureArticleProgress({ top: -900, height: 4000, viewportHeight: 600 }), 0.375, "image/font reflow changes geometry");
  assert.equal(measureArticleProgress({ top: 50, height: 200, viewportHeight: 600 }), 1, "short articles can fit in one viewport");
  assert.equal(measureArticleProgress({ ...end, height: 0 }), 0);
  assert.equal(measureArticleProgress({ ...end, height: NaN }), 0);
});

test("reaching the end first still completes after the visible dwell threshold", () => {
  const session = createReadingSession(1); // 18 seconds of active time
  const first = session.sample(0, true, end);
  assert.deepEqual(first.depths, [25, 50, 75, 100]);
  assert.equal(first.complete, false);
  assert.equal(session.sample(17_999, true, end).complete, false);
  assert.equal(session.sample(18_000, true, end).complete, true);
  assert.deepEqual(session.sample(30_000, true, end).depths, []);
  assert.equal(session.sample(30_001, true, end).complete, false, "completion only fires once");
});

test("dwelling first completes when the reader later reaches the end", () => {
  const session = createReadingSession(1);
  const middle = { top: -400, height: 2000, viewportHeight: 600 };
  assert.deepEqual(session.sample(0, true, middle).depths, [25, 50]);
  assert.equal(session.sample(20_000, true, middle).complete, false);
  const finished = session.sample(21_000, true, end);
  assert.equal(finished.complete, true);
  assert.deepEqual(finished.depths, [75, 100]);
});

test("background time and time outside the prose do not count as active dwell", () => {
  const session = createReadingSession(1);
  session.sample(0, true, end);
  session.sample(5000, false, end);
  assert.equal(session.sample(105_000, false, end).activeSeconds, 5);
  assert.equal(session.sample(105_000, true, end).complete, false);
  assert.equal(session.sample(117_999, true, end).complete, false);
  assert.equal(session.sample(118_000, true, end).complete, true);
  const other = createReadingSession(1);
  other.sample(0, true, beginning);
  assert.equal(other.sample(60_000, true, beginning).activeSeconds, 0);
});

test("hidden geometry cannot trigger depth or completion; a new visit resets state", () => {
  const first = createReadingSession(1);
  assert.deepEqual(first.sample(0, false, end).depths, []);
  assert.equal(first.sample(100_000, false, end).complete, false);
  assert.deepEqual(first.sample(100_001, true, end).depths, [25, 50, 75, 100]);
  assert.equal(first.sample(118_001, true, end).complete, true);
  const nextVisit = createReadingSession(1);
  assert.equal(nextVisit.sample(0, true, end).complete, false);
  assert.deepEqual(nextVisit.sample(1, true, end).depths, []);
});

test("article observation shares progress and cancels frames, observers and listeners on cleanup", () => {
  const names = ["window", "document", "ResizeObserver", "requestAnimationFrame", "cancelAnimationFrame"] as const;
  const original = names.map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)] as const);
  const windowListeners = new Map<string, () => void>();
  const documentListeners = new Map<string, () => void>();
  const frames = new Map<number, FrameRequestCallback>();
  let nextFrame = 0;
  let resize = () => {};
  let disconnected = false;
  let geometry = { top: -1400, height: 2000 };
  const document = {
    visibilityState: "visible",
    addEventListener: (event: string, listener: () => void) => documentListeners.set(event, listener),
    removeEventListener: (event: string) => documentListeners.delete(event),
  };
  let stop: (() => void) | undefined;
  try {
    Object.defineProperties(globalThis, {
      window: { configurable: true, value: {
        innerHeight: 600,
        addEventListener: (event: string, listener: () => void) => windowListeners.set(event, listener),
        removeEventListener: (event: string) => windowListeners.delete(event),
      } },
      document: { configurable: true, value: document },
      ResizeObserver: { configurable: true, value: class {
        constructor(callback: () => void) { resize = callback; }
        observe() {}
        disconnect() { disconnected = true; }
      } },
      requestAnimationFrame: { configurable: true, value: (callback: FrameRequestCallback) => { frames.set(++nextFrame, callback); return nextFrame; } },
      cancelAnimationFrame: { configurable: true, value: (id: number) => frames.delete(id) },
    });
    // No children/insert APIs exist on this element: geometry must stand alone.
    const article = { getBoundingClientRect: () => geometry } as unknown as HTMLElement;
    stop = reading.observeArticleReading(article, 1, () => {});
    assert.equal(reading.getReadingProgress(), 1);
    geometry = { top: -400, height: 2000 };
    resize();
    windowListeners.get("scroll")!();
    assert.equal(frames.size, 1, "resize and scroll share one animation frame");
    document.visibilityState = "hidden";
    documentListeners.get("visibilitychange")!();
    assert.equal(frames.size, 0, "a direct visibility sample cancels a pending frame");
    assert.equal(reading.getReadingProgress(), 0.5);
    resize();
    assert.equal(frames.size, 1);
    stop();
    stop = undefined;
    assert.equal(frames.size, 0);
    assert.equal(disconnected, true);
    assert.equal(windowListeners.size, 0);
    assert.equal(documentListeners.size, 0);
    assert.equal(reading.getReadingProgress(), 0);
  } finally {
    stop?.();
    for (const [name, descriptor] of original) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else Reflect.deleteProperty(globalThis, name);
    }
  }
});

test("analytics has one initializer, a bounded queue, and one pageview per committed path", async () => {
  const startup = deferred<AnalyticsClient | null>();
  const sent: { event: string; props: Record<string, unknown> }[] = [];
  let loads = 0;
  const controller = createAnalyticsController({
    enabled: true, maxQueue: 4, canCapture: () => true,
    load: () => { loads++; return startup.promise; },
  });
  controller.navigate("/blog/");
  controller.navigate("/blog");
  controller.navigate("/blog/?q=private#section");
  assert.equal(controller.queuedCount, 1);
  for (let i = 0; i < 40; i++) controller.track(EVENTS.SEARCH_PERFORMED, { query: "private", result_count: i });
  assert.equal(controller.state, "loading");
  assert.equal(controller.queuedCount, 4);
  assert.equal(loads, 1);
  startup.resolve({ capture: (event, props) => { sent.push({ event, props }); } });
  await settle();
  assert.equal(controller.state, "ready");
  assert.equal(controller.queuedCount, 0);
  assert.ok(sent.every(({ props }) => !("query" in props)));
  assert.equal(sent.filter(({ event }) => event === "$pageview").length, 1);
  controller.navigate("/experience/");
  controller.navigate("/experience/");
  assert.equal(sent.filter(({ event }) => event === "$pageview").length, 2);
});

test("Luna never initializes directly and clears queued events across a transition", async () => {
  const startup = deferred<AnalyticsClient | null>();
  const sent: string[] = [];
  let allowed = false;
  let loads = 0;
  const controller = createAnalyticsController({
    enabled: true, canCapture: () => allowed,
    load: () => { loads++; return startup.promise; },
  });
  controller.navigate("/luna/");
  controller.track(EVENTS.CTA_CLICKED, { label: "private" });
  assert.equal(controller.state, "disabled");
  assert.equal(loads, 0);
  assert.equal(controller.queuedCount, 0);
  allowed = true;
  controller.navigate("/blog/");
  controller.track(EVENTS.SEARCH_PERFORMED, { result_count: 1 });
  assert.equal(loads, 1);
  allowed = false;
  controller.navigate("/luna/");
  startup.resolve({ capture: (event) => { sent.push(event); } });
  await settle();
  assert.deepEqual(sent, []);
  assert.equal(controller.queuedCount, 0);
  assert.equal(controller.state, "disabled");
  allowed = true;
  controller.navigate("/experience/");
  assert.deepEqual(sent, ["$pageview"]);
});

test("unconfigured or failed analytics drops events rather than accumulating them", async () => {
  let loads = 0;
  const disabled = createAnalyticsController({ enabled: false, canCapture: () => true, load: async () => { loads++; return null; } });
  disabled.navigate("/");
  for (let i = 0; i < 1000; i++) disabled.track(EVENTS.CTA_CLICKED);
  assert.equal(loads, 0);
  assert.equal(disabled.queuedCount, 0);
  const failed = createAnalyticsController({ enabled: true, canCapture: () => true, load: async () => { throw new Error("blocked SDK"); } });
  failed.navigate("/");
  await settle();
  assert.equal(failed.state, "failed");
  for (let i = 0; i < 1000; i++) failed.track(EVENTS.CTA_CLICKED);
  assert.equal(failed.queuedCount, 0);
});

test("analytics payloads exclude raw query/contact values and URL parameters", () => {
  assert.deepEqual(sanitizeAnalyticsProperties({
    query: "private search", name: "person", email: "a@example.com", message: "private",
    query_length: 14, result_count: 3, result_id: "work-salesforce-agent-mcp", url: "https://example.com/path?q=private#secret", success: true,
    nested: { query: "private" }, position: NaN,
  }), { query_length: 14, result_count: 3, result_id: "work-salesforce-agent-mcp", url: "https://example.com/path", success: true });
  assert.deepEqual(sanitizeAnalyticsProperties({ href: "mailto:hadi@example.com?body=secret" }), { href: "mailto" });
});

test("calendar helpers validate dates and stay UTC regardless of environment timezone", () => {
  const previous = process.env.TZ;
  try {
    for (const zone of ["UTC", "Europe/Paris", "America/Los_Angeles"]) {
      process.env.TZ = zone;
      assert.equal(dates.formatDate("2026-01-01"), "January 1, 2026");
      assert.equal(dates.formatMonthPeriod("2025-12", "2026-01"), "Dec 2025 – Jan 2026");
      assert.equal(dates.formatMonthPeriod("2026-01"), "Jan 2026");
    }
    assert.throws(() => dates.parseDate("2025-02-29"));
    assert.throws(() => dates.parseMonth("2026-13"));
    assert.throws(() => dates.formatMonthPeriod("2026-02", "2026-01"));
    assert.equal(dates.formatDate("2024-02-29"), "February 29, 2024");
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
});

test("all 11 repository articles compile with the parsed Markdown allowlist", async () => {
  const posts = mdx.getAllPosts();
  assert.equal(posts.length, 11);
  for (const post of posts) {
    await serialize(post.content, { mdxOptions: { remarkPlugins: [remarkGfm, mdx.remarkValidateMdx] } });
    assert.strictEqual(mdx.getPostBySlug(post.slug), post, "lookups reuse parsed entries");
  }
  assert.ok(mdx.getAllPostSummaries().every((post) => !("content" in post)));
  assert.ok(mdx.getAllPostSearchItems().every((post) => !("content" in post)));
});

test("frontmatter accepts YAML only and rejects executable engines, duplicate keys and aliases", () => {
  const fixture = '---\ntitle: "A post"\ndate: "2026-10-19"\ntags: ["AI"]\nexcerpt: "Summary"\ncoverImage: "/Media/branding/og-default.jpg"\n---\nText';
  const safe = mdx.parseBlogSource(fixture, "fixture");
  assert.equal(safe.title, "A post");
  assert.throws(() => mdx.parseBlogSource('---javascript\n({title: process.exit(99)})\n---\nText', "fixture"), /YAML/);
  assert.throws(() => mdx.parseBlogSource(fixture.replace('title: "A post"', 'title: "A post"\ntitle: "Duplicate"'), "fixture"), /invalid YAML/);
  assert.throws(() => mdx.parseBlogSource(fixture.replace('title: "A post"', 'title: !!js/function "function () {}"'), "fixture"), /invalid YAML/);
  assert.throws(() => mdx.parseBlogSource(fixture.replace('title: "A post"', 'title: &name "A post"').replace('excerpt: "Summary"', 'excerpt: *name'), "fixture"), /aliases/);
  assert.throws(() => mdx.parseBlogSource(fixture.replace('"A post"', `"${"x".repeat(65536)}"`), "fixture"), /64 KiB/);
  assert.throws(() => mdx.parseBlogSource(fixture.replace('"2026-10-19"', '"2026-02-30"'), "fixture"), /Invalid calendar/);
  assert.throws(() => mdx.parseBlogSource(fixture.replace('tags:', 'privateNotes: "private"\ntags:'), "fixture"), /unknown frontmatter/);
  assert.throws(() => mdx.parseBlogSource(fixture.replace('/Media/branding/og-default.jpg', '/Media/branding/nonexistent-cover-2026.png'), "fixture"), /coverImage file is missing/);
});

test("a missing blog directory fails on a fresh repository instead of publishing an empty catalog", () => {
  const filesystem = new Proxy(fs, {
    get(target, property) {
      if (property === "existsSync") return (file: fs.PathLike) => String(file).endsWith("/content/blog") ? false : fs.existsSync(file);
      return Reflect.get(target, property);
    },
  });
  const missing = loadServerCatalog(filesystem);
  assert.throws(() => missing.getAllPosts(), /Expected blog content directory is missing/);
  assert.throws(() => missing.getAllPostSearchItems(), /Expected blog content directory is missing/);
});

test("ordinary Markdown blockquotes, autolinks and comparisons compile; code examples stay literal", async () => {
  const body = '> Quoted evidence\n\n2 < 3 and 4 > 3.\n\n<https://example.com/report> and <author@example.com>\n\n`<Component value={1} />`\n\n```tsx\nexport const Demo = () => <div>{1}</div>;\n```';
  const normalized = mdx.normalizeMarkdownProse(body);
  assert.ok(normalized.includes('> Quoted evidence'));
  assert.ok(normalized.includes('2 &lt; 3'));
  assert.ok(normalized.includes('[https://example.com/report](https://example.com/report)'));
  assert.ok(normalized.includes('`<Component value={1} />`'));
  assert.ok(normalized.includes('export const Demo = () => <div>{1}</div>;'));
  await serialize(normalized, { mdxOptions: { remarkPlugins: [remarkGfm, mdx.remarkValidateMdx] } });
});

test("parsed article policy rejects JSX, expressions, imports and executable link protocols", async () => {
  for (const body of ['<script>alert(1)</script>', '<Component value="x" />', '{globalThis.privateData}', 'import X from "somewhere"', '[bad](javascript:alert%281%29)']) {
    await assert.rejects(() => serialize(body, { mdxOptions: { remarkPlugins: [remarkGfm, mdx.remarkValidateMdx] } }));
  }
  assert.throws(() => mdx.validateMdxBody('\\` <script>alert(1)</script> \\`'), /not allowed/);
  assert.throws(() => mdx.validateMdxBody('`\n\n<script>alert(1)</script>\n\n`'), /not allowed/);
});
