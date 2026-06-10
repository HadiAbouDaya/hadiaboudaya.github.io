import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    deviceSizes: [480, 960, 1440],
    imageSizes: [],
  },
  trailingSlash: true,
};

export default nextConfig;
