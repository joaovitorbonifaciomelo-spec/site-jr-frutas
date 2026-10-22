"use client";

import { useEffect, useState } from "react";
import { mediaBudget, pickRendition, portraitSet, posterSrcSet, type VideoSet } from "@/lib/video";

/** Loop do hub — mesmo corte de antes, regenerado dos ORIGINAIS de câmera (720/1080). */
const LOOP = portraitSet("/video/links-loop", "/video/links-poster");
/** No celular o vídeo fica sob overlay + glass: 720 basta e economiza dados (bio do Instagram). */
const LOOP_MOBILE: VideoSet = { ...LOOP, renditions: LOOP.renditions.filter((r) => r.width <= 720) };

type Props = {
  /** true quando o bottom sheet está aberto → escurece/desfoca um pouco mais */
  dimmed?: boolean;
};

/**
 * Fundo em vídeo real da operação (loop curto, sem áudio).
 *
 * Ordem de carregamento: fundo preto (CSS) → interface → poster (WebP, srcset
 * 720/1080, <img> nativo com fetchpriority high) → vídeo (só após hidratação).
 * Versão escolhida por lib/video.ts: reduced-motion/Save-Data → só poster;
 * 2G/3G/pouca memória → 720; demais → pelo tamanho físico da tela (no celular, até 720).
 * Se falhar (onError), o poster assume automaticamente.
 * Overlay leve + gradientes localizados (topo/base) — o vídeo continua visível.
 *
 * O glass dos cards usa backdrop-filter com blur baixo (ver .glass-card):
 * o <video> fica como elemento normal (sem espelho em canvas) — mesma
 * estratégia validada no hub da Frutas Beca. Diagnóstico A/B: ?debug=1.
 */
export function VideoBackground({ dimmed = false }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      const set = window.matchMedia("(min-width: 768px)").matches ? LOOP : LOOP_MOBILE;
      setSrc(pickRendition(set, window.innerWidth, window.innerHeight, mediaBudget())?.src ?? null);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const showVideo = !!src && !failed;

  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 bg-black transition-[filter] duration-500 ease-[var(--ease-out-soft)] ${
        dimmed ? "blur-[10px] lg:blur-[14px]" : "lg:blur-[6px]"
      }`}
      aria-hidden
    >
      {/* Poster: <img> nativo para não depender do runtime do next/image na primeira pintura */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOOP.posters[0].src}
        srcSet={posterSrcSet(LOOP)}
        sizes="100vw"
        alt=""
        width={720}
        height={1280}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center lg:scale-105"
      />
      {showVideo ? (
        <video
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 lg:scale-105 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          src={src ?? undefined}
          data-rendition={src?.split("/").pop()}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onPlaying={() => {
            setReady(true);
            window.dispatchEvent(new CustomEvent("jr:video-playing"));
          }}
          onError={() => setFailed(true)}
        />
      ) : null}

      {/* Overlay leve e uniforme (mantém o vídeo perceptível) */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-500 ${dimmed ? "opacity-55" : "opacity-[0.16] lg:opacity-30"}`}
      />
      {/* Gradientes localizados: atrás do logo (topo) e atrás dos cards/rodapé (base) */}
      <div className="absolute inset-x-0 top-0 h-[40%] bg-[linear-gradient(180deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.28)_55%,rgba(0,0,0,0)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(0deg,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.3)_45%,rgba(0,0,0,0)_100%)]" />
    </div>
  );
}
