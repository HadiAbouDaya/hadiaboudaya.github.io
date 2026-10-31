"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { VaultAsset } from "@/lib/luna-vault";
import { useVault } from "./VaultProvider";
import styles from "./album.module.css";

export interface VaultImageProps {
  asset: VaultAsset | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  /** Navigation covers must keep opening their chapter when a cover fails. */
  retryOnParentClick?: boolean;
  className?: string;
  style?: CSSProperties;
  onLoad?: () => void;
}

/** The HTTP cache only sees ciphertext. Decrypted object URLs live with this view. */
export function VaultImage({ asset, alt, fill = false, width, height, priority = false, retryOnParentClick = true, className, style, onLoad }: VaultImageProps) {
  const { decryptAsset } = useVault();
  const host = useRef<HTMLSpanElement>(null);
  const [visibility, setVisibility] = useState({ near: priority, generation: 0 });
  const { near, generation } = visibility;
  const [result, setResult] = useState<{ asset: VaultAsset; url: string; generation: number; attempt: number } | null>(null);
  const [failure, setFailure] = useState<{ asset: VaultAsset; generation: number; attempt: number } | null>(null);
  const [retry, setRetry] = useState(0);
  const [retryWithParent, setRetryWithParent] = useState(false);
  const liveUrl = useRef<string | null>(null);
  const failed = near && failure?.asset === asset && failure?.generation === generation && failure?.attempt === retry;

  useEffect(() => {
    const parent = host.current?.closest("button, a") as HTMLElement | null;
    let disposed = false;
    void Promise.resolve().then(() => { if (!disposed) setRetryWithParent(Boolean(parent)); });
    return () => { disposed = true; };
  }, []);

  useEffect(() => {
    if (!failed || !retryOnParentClick) return;
    const parent = host.current?.closest("button, a") as HTMLElement | null;
    if (!parent) return;
    const originalLabel = parent.getAttribute("aria-label");
    parent.setAttribute("aria-label", "Photo unavailable. Try loading again");
    const retryImage = (event: Event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      setRetry((value) => value + 1);
    };
    parent.addEventListener("click", retryImage, true);
    return () => {
      parent.removeEventListener("click", retryImage, true);
      if (originalLabel === null) parent.removeAttribute("aria-label");
      else parent.setAttribute("aria-label", originalLabel);
    };
  }, [failed, retryOnParentClick]);

  useEffect(() => {
    const updateNear = (next: boolean) => setVisibility(current => current.near === next ? current : { near: next, generation: current.generation + 1 });
    if (priority) {
      const frame = requestAnimationFrame(() => updateNear(true));
      return () => cancelAnimationFrame(frame);
    }
    const element = host.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => updateNear(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => updateNear(entry.isIntersecting), { rootMargin: "800px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (!near || !asset) return;
    const controller = new AbortController();
    let objectUrl: string | undefined;
    void (async () => {
      // Keep state updates in this asynchronous task rather than effect setup.
      await Promise.resolve();
      if (controller.signal.aborted) return;
      setFailure(null);
      setResult(null);
      try {
        const blob = await decryptAsset(asset, controller.signal);
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(blob);
        liveUrl.current = objectUrl;
        setResult({ asset, url: objectUrl, generation, attempt: retry });
      } catch {
        if (!controller.signal.aborted) setFailure({ asset, generation, attempt: retry });
      }
    })();
    return () => {
      controller.abort();
      if (liveUrl.current === objectUrl) liveUrl.current = null;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [asset, decryptAsset, near, generation, retry]);

  const imageWidth = width ?? asset?.width;
  const imageHeight = height ?? asset?.height;
  // A visibility change invalidates a revoked URL before effects run again.
  const ready = near && !failed && result?.asset === asset && result?.generation === generation && result?.attempt === retry;
  return (
    <span
      ref={host}
      className={`${styles.vaultImage} ${fill ? styles.vaultImageFill : ""}`}
      style={!fill && imageWidth && imageHeight ? { aspectRatio: `${imageWidth} / ${imageHeight}` } : undefined}
      aria-busy={near && !ready && !failed}
    >
      {ready && result && (
        // Blob images are decrypted locally and cannot pass through an image optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={result.url}
          src={result.url}
          alt={alt}
          width={imageWidth}
          height={imageHeight}
          className={className}
          style={style}
          decoding="async"
          draggable={false}
          onLoad={() => { if (liveUrl.current === result.url) onLoad?.(); }}
          onError={() => {
            if (liveUrl.current === result.url) setFailure({ asset: result.asset, generation: result.generation, attempt: result.attempt });
          }}
        />
      )}
      {failed && (
        <span className={styles.imageError} role="status">
          <span>Photo unavailable</span>
          {retryWithParent ? retryOnParentClick && <span>Try again</span> : <button type="button" onClick={(event) => { event.stopPropagation(); setRetry((value) => value + 1); }}>Try again</button>}
        </span>
      )}
      {!ready && !failed && <span className={styles.imagePlaceholder} aria-hidden="true" />}
    </span>
  );
}
