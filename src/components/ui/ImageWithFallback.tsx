"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps
  extends Omit<ImageProps, "onError" | "fill"> {
  fallbackText?: string;
  fallbackClassName?: string;
}

export function ImageWithFallback({
  fallbackText,
  fallbackClassName,
  alt,
  width,
  height,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  onLoad,
  ...rest
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-400/20 dark:from-primary-900/30 dark:to-accent-400/10 text-primary-600 dark:text-primary-400",
          fallbackClassName
        )}
        style={{ width: width as number, height: height as number }}
      >
        <span className="text-sm font-semibold">{fallbackText || alt.slice(0, 2).toUpperCase()}</span>
      </div>
    );
  }

  // Carry only the box/shape classes (rounding, padding) onto the shimmer
  // overlay; object-fit / transform / group-hover utilities are image-only and
  // would be meaningless or wrong on a plain placeholder div.
  const skeletonClassName = className
    ?.split(" ")
    .filter(
      (c) =>
        c.startsWith("rounded") ||
        c === "w-full" ||
        c === "h-full" ||
        /^p[xytrbl]?-/.test(c)
    )
    .join(" ");

  return (
    <>
      {!isLoaded && (
        <span
          aria-hidden
          className={cn("skeleton absolute inset-0", skeletonClassName)}
          style={{ width: width as number, height: height as number }}
        />
      )}
      <Image
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={className}
        onError={() => setHasError(true)}
        onLoad={(e) => {
          setIsLoaded(true);
          onLoad?.(e);
        }}
        {...rest}
      />
    </>
  );
}
