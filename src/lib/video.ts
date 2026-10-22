/**
 * Seleção adaptativa de vídeo — MP4 progressivo em várias versões (sem HLS/DASH).
 * Versões geradas a partir dos ORIGINAIS de câmera por scripts/build-videos.py.
 */

export type Rendition = { src: string; width: number; height: number };

/** Um vídeo em várias resoluções + posters equivalentes (ordem crescente de largura). */
export type VideoSet = { renditions: Rendition[]; posters: Rendition[] };

/**
 * Orçamento de mídia do dispositivo/rede:
 * - "none"   → prefers-reduced-motion: só poster, sem autoplay;
 * - "poster" → Save-Data: só poster;
 * - "light"  → 2G/3G, downlink baixo, pouca memória ou poucos núcleos: versão leve;
 * - "full"   → versão suficiente para a resolução física do quadro.
 */
export type MediaBudget = "none" | "poster" | "light" | "full";

type NetInfo = { saveData?: boolean; effectiveType?: string; downlink?: number };
type Nav = Navigator & { connection?: NetInfo; deviceMemory?: number };

export function mediaBudget(): MediaBudget {
  if (typeof window === "undefined") return "none";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "none";
  const nav = navigator as Nav;
  const net = nav.connection;
  if (net?.saveData) return "poster";
  if (/^(slow-2g|2g|3g)$/.test(net?.effectiveType ?? "")) return "light";
  if (typeof net?.downlink === "number" && net.downlink > 0 && net.downlink < 2.5) return "light";
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return "light";
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency > 0 && nav.hardwareConcurrency <= 2) return "light";
  return "full";
}

const byWidth = (list: Rendition[]) => [...list].sort((a, b) => a.width - b.width);

/**
 * Escolhe a versão para um quadro `object-fit: cover` de frameW×frameH (px CSS):
 * largura física necessária = largura renderizada da fonte × min(DPR, 2).
 * Retorna null quando o orçamento não permite vídeo.
 */
export function pickRendition(set: VideoSet, frameW: number, frameH: number, budget: MediaBudget): Rendition | null {
  if (budget === "none" || budget === "poster" || set.renditions.length === 0) return null;
  const list = byWidth(set.renditions);
  if (budget === "light") return list[0];
  const largest = list[list.length - 1];
  const aspect = largest.width / largest.height;
  const renderedW = Math.max(frameW, frameH * aspect); // cover
  const need = renderedW * Math.min(window.devicePixelRatio || 1, 2);
  // tolerância de 0,8: ampliar até ~1,25× em tela 2×/3× é imperceptível e evita baixar a versão alta à toa
  return list.find((r) => r.width >= need * 0.8) ?? largest;
}

/** srcset de posters (largura) para <img>/<source>. */
export const posterSrcSet = (set: VideoSet) => byWidth(set.posters).map((p) => `${p.src} ${p.width}w`).join(", ");
export const smallestPoster = (set: VideoSet) => byWidth(set.posters)[0];

/** Conjunto vertical padrão gerado pelo pipeline: <base>-720/-1080.mp4 + <poster>-720/-1080.webp. */
export function portraitSet(base: string, posterBase: string): VideoSet {
  return {
    renditions: [
      { src: `${base}-720.mp4`, width: 720, height: 1280 },
      { src: `${base}-1080.mp4`, width: 1080, height: 1920 },
    ],
    posters: [
      { src: `${posterBase}-720.webp`, width: 720, height: 1280 },
      { src: `${posterBase}-1080.webp`, width: 1080, height: 1920 },
    ],
  };
}
