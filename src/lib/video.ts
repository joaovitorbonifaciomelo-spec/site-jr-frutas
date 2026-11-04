/**
 * Seleção adaptativa de vídeo — MP4 progressivo em várias versões (sem HLS/DASH).
 * Versões geradas a partir dos ORIGINAIS de câmera por scripts/build-videos.py.
 */

export type Rendition = { src: string; width: number; height: number };

/** Um vídeo em várias resoluções + posters equivalentes (ordem crescente de largura). */
export type VideoSet = { renditions: Rendition[]; posters: Rendition[] };

/**
 * Nível de qualidade da sessão, decidido ANTES de atribuir o src do vídeo:
 * - "poster" → reduced-motion ou Save-Data: nenhum vídeo é baixado;
 * - "low"    → sinal claro de limitação: versão 540;
 * - "medium" → condição normal/intermediária ou dados insuficientes: versão 720;
 * - "high"   → rede claramente boa + aparelho adequado: versão pedida pelo tamanho do quadro.
 */
export type MediaBudget = "poster" | "low" | "medium" | "high";

type NetInfo = { saveData?: boolean; effectiveType?: string; downlink?: number };
type Nav = Navigator & { connection?: NetInfo; deviceMemory?: number };

const LOW_DOWNLINK = 1.5; // Mbps
const GOOD_DOWNLINK_DESKTOP = 5;
const GOOD_DOWNLINK_MOBILE = 8; // dados móveis oscilam mais; a versão alta pesa cerca de 7 MB
const BIG_DESKTOP = "(min-width: 1400px) and (orientation: landscape)";
const DESKTOP = "(hover: hover) and (pointer: fine)";

function deviceAndNetworkBudget(): Exclude<MediaBudget, "poster"> {
  const nav = navigator as Nav;
  const net = nav.connection;
  const type = net?.effectiveType ?? "";
  const downlink = typeof net?.downlink === "number" && net.downlink > 0 ? net.downlink : null;
  const memory = typeof nav.deviceMemory === "number" ? nav.deviceMemory : null;
  const cores = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency > 0 ? nav.hardwareConcurrency : null;
  const hasNetworkInfo = Boolean(type) || downlink !== null;
  const desktop = window.matchMedia(DESKTOP).matches;

  // Sinais de limitação. Fora do Chromium, o número de núcleos só pesa no desktop:
  // o Safari pode informar um valor reduzido no celular, sem refletir o aparelho.
  if (/^(slow-2g|2g|3g)$/.test(type)) return "low";
  if (downlink !== null && downlink < LOW_DOWNLINK) return "low";
  if (memory !== null && memory <= 2) return "low";
  if (cores !== null && cores <= 2 && (hasNetworkInfo || desktop)) return "low";

  // Sem Network Information API (Safari, Firefox): decisão equilibrada, nunca "low" por falta de dado.
  // Só desktop grande com processador folgado recebe a versão alta.
  if (!hasNetworkInfo) {
    return desktop && cores !== null && cores >= 6 && window.matchMedia(BIG_DESKTOP).matches ? "high" : "medium";
  }

  const goodDevice = (memory === null || memory >= 4) && (cores === null || cores >= 4);
  const goodNetwork = downlink !== null && downlink >= (desktop ? GOOD_DOWNLINK_DESKTOP : GOOD_DOWNLINK_MOBILE);
  return goodDevice && goodNetwork ? "high" : "medium";
}

/** Rede e aparelho são avaliados uma vez por carga: os vídeos da página não oscilam entre qualidades. */
let sessionBudget: Exclude<MediaBudget, "poster"> | null = null;

export function mediaBudget(): MediaBudget {
  if (typeof window === "undefined") return "poster";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "poster";
  if ((navigator as Nav).connection?.saveData) return "poster";
  sessionBudget ??= deviceAndNetworkBudget();
  return sessionBudget;
}

const byWidth = (list: Rendition[]) => [...list].sort((a, b) => a.width - b.width);
/** Lado menor da versão: 540, 720 ou 1080, em quadro horizontal ou vertical. */
const shortSide = (r: Rendition) => Math.min(r.width, r.height);

/**
 * Escolhe a única versão a baixar para um quadro `object-fit: cover` de frameW×frameH (px CSS).
 * - "low" → a menor; "medium" → a de 720; "high" → a suficiente para a largura física
 *   do quadro (largura renderizada × DPR, até 3×), sem descer à 540, que é só para limitação.
 * Conjuntos sem o degrau pedido usam o mais próximo. Retorna null quando o orçamento é só poster.
 */
export function pickRendition(set: VideoSet, frameW: number, frameH: number, budget: MediaBudget): Rendition | null {
  if (budget === "poster" || set.renditions.length === 0) return null;
  const list = byWidth(set.renditions);
  if (budget === "low") return list[0];
  const standard = list.filter((r) => shortSide(r) > 540);
  if (standard.length === 0) return list[list.length - 1];
  if (budget === "medium") return standard.find((r) => shortSide(r) === 720) ?? standard[0];
  const largest = standard[standard.length - 1];
  const aspect = largest.width / largest.height;
  const renderedW = Math.max(frameW, frameH * aspect); // cover
  const need = renderedW * Math.min(window.devicePixelRatio || 1, 3);
  // tolerância de 0,8: ampliar até ~1,25× é imperceptível e evita baixar a versão alta à toa
  return standard.find((r) => r.width >= need * 0.8) ?? largest;
}

/** srcset de posters (largura) para <img>/<source>. */
export const posterSrcSet = (set: VideoSet) => byWidth(set.posters).map((p) => `${p.src} ${p.width}w`).join(", ");
export const smallestPoster = (set: VideoSet) => byWidth(set.posters)[0];

/** Conjunto horizontal gerado pelo pipeline (masters 16:9): <base>-540/-720/-1080.mp4 + <poster>-720/-1080.webp. */
export function landscapeSet(base: string, posterBase: string): VideoSet {
  return {
    renditions: [
      { src: `${base}-540.mp4`, width: 960, height: 540 },
      { src: `${base}-720.mp4`, width: 1280, height: 720 },
      { src: `${base}-1080.mp4`, width: 1920, height: 1080 },
    ],
    posters: [
      { src: `${posterBase}-720.webp`, width: 1280, height: 720 },
      { src: `${posterBase}-1080.webp`, width: 1920, height: 1080 },
    ],
  };
}

/** Conjunto vertical padrão gerado pelo pipeline: <base>-540/-720/-1080.mp4 + <poster>-720/-1080.webp. */
export function portraitSet(base: string, posterBase: string): VideoSet {
  return {
    renditions: [
      { src: `${base}-540.mp4`, width: 540, height: 960 },
      { src: `${base}-720.mp4`, width: 720, height: 1280 },
      { src: `${base}-1080.mp4`, width: 1080, height: 1920 },
    ],
    posters: [
      { src: `${posterBase}-720.webp`, width: 720, height: 1280 },
      { src: `${posterBase}-1080.webp`, width: 1080, height: 1920 },
    ],
  };
}
