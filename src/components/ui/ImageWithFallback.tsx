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
  ...rest
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

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

  return (
    <Image
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setHasError(true)}
      {...rest}
    />
  );
}
