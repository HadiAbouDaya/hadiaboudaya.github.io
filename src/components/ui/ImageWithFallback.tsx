"use client";

import { useState, type CSSProperties } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError" | "fill"> {
  fallbackText?: string;
  fallbackClassName?: string;
  /** Sizing belongs to this responsive box; intrinsic width/height describe aspect ratio. */
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
}
export function ImageWithFallback(props: ImageWithFallbackProps) {
  const source = typeof props.src === "string" ? props.src : "default" in props.src ? props.src.default.src : props.src.src;
  return <SourceImage key={source} {...props} />;
}
function SourceImage({ fallbackText, fallbackClassName, wrapperClassName, wrapperStyle,
  alt, width, height, className, sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  onLoad, ...rest }: ImageWithFallbackProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  return (
    <span className={cn("relative block h-full w-full max-w-full overflow-hidden", wrapperClassName)}
      style={{ aspectRatio: width && height ? `${width} / ${height}` : undefined, ...wrapperStyle }}>
      {status === "error" ? (
        <span role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}
          className={cn("absolute inset-0 flex items-center justify-center bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300", fallbackClassName)}>
          <span aria-hidden="true" className="text-sm font-semibold">{fallbackText || alt.slice(0, 2).toUpperCase()}</span>
        </span>
      ) : (
        <>
          {status === "loading" && <span aria-hidden="true" className="skeleton pointer-events-none absolute inset-0" />}
          <Image {...rest} alt={alt} width={width} height={height} sizes={sizes}
            className={className} onError={() => setStatus("error")}
            onLoad={(event) => { setStatus("loaded"); onLoad?.(event); }} />
        </>
      )}
    </span>
  );
}
