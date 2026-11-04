/**
 * Loader do next/image para o export estático (sem otimizador em runtime).
 * As versões são geradas no build por scripts/optimize-export-images.mjs, em out/img/.
 * Em dev (next dev) devolve o arquivo original, porque out/ não existe.
 */

/** Larguras do srcset; o next.config.ts usa esta mesma lista. */
export const IMAGE_SIZES = [128, 256, 384];
export const DEVICE_SIZES = [640, 828, 1200, 1600];
export const IMAGE_WIDTHS = [...IMAGE_SIZES, ...DEVICE_SIZES];
export const IMAGE_QUALITIES = [75, 85];
export const DEFAULT_QUALITY = 75;

/** /_next/static/media/coco.a1b2.webp → coco.a1b2 · /brand/x/logo.png → brand-x-logo */
export function imageSlug(src) {
  const path = src.split("?")[0].replace(/^\/+/, "").replace(/^_next\/static\/media\//, "");
  return path.replace(/\.[a-z0-9]+$/i, "").replace(/[^a-zA-Z0-9.]+/g, "-");
}

export const imagePath = (src, width, quality) => `/img/${imageSlug(src)}.w${width}.q${quality}.webp`;

export default function imageLoader({ src, width, quality }) {
  if (process.env.NODE_ENV !== "production") return src;
  return imagePath(src, width, quality ?? DEFAULT_QUALITY);
}
