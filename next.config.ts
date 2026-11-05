import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Multiple root layouts need a document-level fallback for unmatched URLs.
  experimental: { globalNotFound: true },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    deviceSizes: [480, 960, 1440],
    imageSizes: [],
  },
  trailingSlash: true,
};

export default nextConfig;
