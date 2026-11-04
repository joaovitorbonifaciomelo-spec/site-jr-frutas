import type { NextConfig } from "next";
import { DEVICE_SIZES, IMAGE_QUALITIES, IMAGE_SIZES } from "./src/lib/image-loader.mjs";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    // Sem otimizador em runtime: as versões são geradas no build (scripts/optimize-export-images.mjs).
    loader: "custom",
    loaderFile: "./src/lib/image-loader.mjs",
    deviceSizes: DEVICE_SIZES,
    imageSizes: IMAGE_SIZES,
    qualities: IMAGE_QUALITIES,
  },
  // Herdado da época em que o projeto rodava do Google Drive via junctions
  // (runner). Em disco local não é necessário, mas é inofensivo — mantido
  // para não alterar a resolução de módulos do site.
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
