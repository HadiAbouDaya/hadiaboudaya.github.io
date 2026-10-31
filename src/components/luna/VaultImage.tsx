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
  className?: string;
  style?: CSSProperties;
  onLoad?: () => void;
}

/** The HTTP cache only sees ciphertext. Decrypted object URLs live with this view. */
export function VaultImage({ asset, alt, fill = false, width, height, priority = false, className, style, onLoad }: VaultImageProps) {
  const { decryptAsset } = useVault();
  const host = useRef<HTMLSpanElement>(null);
  const [near, setNear] = useState(priority);
  const [result, setResult] = useState<{ id: string; url: string } | null>(null);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [retryWithParent, setRetryWithParent] = useState(false);

  useEffect(() => {
    const parent = host.current?.closest("button, a") as HTMLElement | null;
    let disposed = false;
    void Promise.resolve().then(() => { if (!disposed) setRetryWithParent(Boolean(parent)); });
    return () => { disposed = true; };
  }, []);

  useEffect(() => {
    if (!failed) return;
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
  }, [failed]);

  useEffect(() => {
    if (priority) return;
    const element = host.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => setNear(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: "800px 0px" });
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
      setFailed(false);
      setResult(null);
      try {
        const blob = await decryptAsset(asset, controller.signal);
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(blob);
        setResult({ id: asset.id, url: objectUrl });
      } catch {
        if (!controller.signal.aborted) setFailed(true);
      }
    })();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [asset, decryptAsset, near, retry]);

  const imageWidth = width ?? asset?.width;
  const imageHeight = height ?? asset?.height;
  const ready = near && result?.id === asset?.id;
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
          src={result.url}
          alt={alt}
          width={imageWidth}
          height={imageHeight}
          className={className}
          style={style}
          decoding="async"
          draggable={false}
          onLoad={onLoad}
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <span className={styles.imageError} role="status">
          <span>Photo unavailable</span>
          {retryWithParent ? <span>Try again</span> : <button type="button" onClick={(event) => { event.stopPropagation(); setRetry((value) => value + 1); }}>Try again</button>}
        </span>
      )}
      {!ready && !failed && <span className={styles.imagePlaceholder} aria-hidden="true" />}
    </span>
  );
}
