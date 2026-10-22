import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // 85 = artes de produto (seção de cotação); 75 = padrão
    qualities: [75, 85],
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
