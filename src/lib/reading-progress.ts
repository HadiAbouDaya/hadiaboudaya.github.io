export const READING_MILESTONES = [25, 50, 75, 100] as const;
export type ReadingMilestone = (typeof READING_MILESTONES)[number];
export interface ArticleGeometry {
  top: number;
  height: number;
  viewportHeight: number;
}

/** Fraction of the actual prose height passed by the viewport's lower edge. */
export function measureArticleProgress({ top, height, viewportHeight }: ArticleGeometry): number {
  if (![top, height, viewportHeight].every(Number.isFinite) || height <= 0 || viewportHeight <= 0) return 0;
  return Math.max(0, Math.min(1, (viewportHeight - top) / height));
}

/** Pure visit state: end and active dwell can arrive in either order, once per mount/slug. */
export function createReadingSession(readingTimeMinutes: number) {
  const dwellRequired = Math.max(1, Number.isFinite(readingTimeMinutes) ? readingTimeMinutes : 1) * 60_000 * 0.3;
  const milestones = new Set<ReadingMilestone>();
  let lastNow: number | undefined;
  let wasActive = false;
  let activeMs = 0;
  let reachedEnd = false;
  let completed = false;

  return {
    sample(now: number, visible: boolean, geometry: ArticleGeometry) {
      if (lastNow !== undefined && wasActive) activeMs += Math.max(0, now - lastNow);
      lastNow = now;
      const intersects = geometry.top < geometry.viewportHeight && geometry.top + geometry.height > 0;
      wasActive = visible && intersects;
      const progress = measureArticleProgress(geometry);
      const depths: ReadingMilestone[] = [];
      if (visible && intersects) {
        for (const depth of READING_MILESTONES) {
          if (progress * 100 >= depth && !milestones.has(depth)) {
            milestones.add(depth);
            depths.push(depth);
          }
        }
        if (progress === 1) reachedEnd = true;
      }
      const complete = !completed && reachedEnd && activeMs >= dwellRequired;
      if (complete) completed = true;
      return { progress, depths, complete, activeSeconds: Math.floor(activeMs / 1000) };
    },
  };
}

type ReadingUpdate = ReturnType<ReturnType<typeof createReadingSession>["sample"]>;
let progress = 0;
let owner: symbol | undefined;
const subscribers = new Set<() => void>();
export const getReadingProgress = () => progress;
export const getServerReadingProgress = () => 0;
export function subscribeReadingProgress(callback: () => void) {
  subscribers.add(callback);
  return () => { subscribers.delete(callback); };
}
function publish(value: number) {
  if (progress === value) return;
  progress = value;
  subscribers.forEach((callback) => callback());
}

/** One geometry source serves the progress bar and telemetry; never inserts article nodes. */
export function observeArticleReading(
  article: HTMLElement,
  readingTime: number,
  onUpdate: (update: ReadingUpdate) => void,
) {
  const token = Symbol("article visit");
  owner = token;
  publish(0);
  const session = createReadingSession(readingTime);
  let frame: number | undefined;
  let timer: ReturnType<typeof setInterval> | undefined;
  let stopped = false;

  function measure() {
    frame = undefined;
    if (stopped) return;
    const rect = article.getBoundingClientRect();
    const update = session.sample(performance.now(), document.visibilityState === "visible", {
      top: rect.top, height: rect.height, viewportHeight: window.innerHeight,
    });
    if (owner === token) publish(update.progress);
    if (update.depths.length || update.complete) onUpdate(update);
  }
  function schedule() {
    if (!stopped && frame === undefined) frame = requestAnimationFrame(measure);
  }
  function visibilityChanged() {
    // Account for the last visible interval immediately, then stop background timers.
    if (frame !== undefined) cancelAnimationFrame(frame);
    measure();
    if (timer !== undefined) clearInterval(timer);
    timer = document.visibilityState === "visible" ? setInterval(schedule, 1000) : undefined;
  }
  const observer = new ResizeObserver(schedule);
  observer.observe(article);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  document.addEventListener("visibilitychange", visibilityChanged);
  visibilityChanged();

  return () => {
    stopped = true;
    observer.disconnect();
    if (frame !== undefined) cancelAnimationFrame(frame);
    if (timer !== undefined) clearInterval(timer);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    document.removeEventListener("visibilitychange", visibilityChanged);
    if (owner === token) {
      owner = undefined;
      publish(0);
    }
  };
}
