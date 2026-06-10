const WIDTHS = [480, 960, 1440];

export default function mediaLoader({
  src,
  width,
}: {
  src: string;
  width: number;
}): string {
  // In development, serve originals (variants are generated at build time).
  if (process.env.NODE_ENV === "development") {
    return src;
  }

  // Only rewrite local /Media/ raster images; skip SVG/GIF and anything else.
  if (!src.startsWith("/Media/") || /\.(svg|gif)$/i.test(src)) {
    return src;
  }

  // Pick the smallest variant width that covers the requested width.
  const w = WIDTHS.find((candidate) => candidate >= width) ?? 1440;

  return src.replace(/\.(webp|jpe?g|png)$/i, `-${w}w.webp`);
}
