// Carry an explicit destination: History API fragment changes need not emit hashchange.
export const REVEAL_FRAGMENT_EVENT = "site:reveal-fragment";
export function requestFragmentReveal(id: string) {
  window.dispatchEvent(new CustomEvent(REVEAL_FRAGMENT_EVENT, { detail: { id } }));
}
export function fragmentFromEvent(event: Event): string | undefined {
  const id: unknown = (event as CustomEvent<{ id?: unknown }>).detail?.id;
  return typeof id === "string" ? `#${encodeURIComponent(id)}` : undefined;
}
