import { useEffect, useRef } from "react";

/**
 * Linear-style cursor spotlight with zero React re-renders.
 *
 * Attaches a single delegated `pointermove` handler to the container ref. On
 * move it resolves the `.card-spotlight` element under the pointer and writes
 * its `--spot-x` / `--spot-y` CSS custom props (in %) directly via
 * `el.style.setProperty`, throttled with `requestAnimationFrame`. The matching
 * `.card-spotlight::before` rule in globals.css renders the radial glow.
 *
 * No state is set, so the component using this hook never re-renders on move.
 * No-op when the pointer is coarse (`(hover: none)`) or the user prefers
 * reduced motion. The listener and any pending rAF are cleaned up on unmount.
 */
export function useSpotlight<
  T extends HTMLElement = HTMLDivElement,
>(): React.RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    if (
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let frame = 0;
    let pending: { card: HTMLElement; clientX: number; clientY: number } | null =
      null;

    const apply = () => {
      frame = 0;
      if (!pending) return;
      const { card, clientX, clientY } = pending;
      pending = null;
      const rect = card.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--spot-x", `${x}%`);
      card.style.setProperty("--spot-y", `${y}%`);
    };

    const onPointerMove = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const card = target?.closest<HTMLElement>(".card-spotlight");
      if (!card) return;
      pending = { card, clientX: event.clientX, clientY: event.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    container.addEventListener("pointermove", onPointerMove);

    return () => {
      container.removeEventListener("pointermove", onPointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}
