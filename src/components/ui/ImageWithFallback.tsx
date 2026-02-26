"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  fallbackText?: string;
  className?: string;
  fallbackClassName?: string;
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  fallbackText,
  className,
  fallbackClassName,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-400/20 text-primary-600",
          fallbackClassName
        )}
        style={{ width, height }}
      >
        <span className="text-sm font-semibold">{fallbackText || alt.slice(0, 2).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
