"use client";

import { useEffect, useRef, useState } from "react";
import { mediaBudget, pickRendition, posterSrcSet, smallestPoster, type VideoSet } from "@/lib/video";

type Props = {
  /** versões verticais (sempre existem — originais de câmera) */
  portrait: VideoSet;
  /** versões horizontais — só quando houver original horizontal (hoje: placeholders) */
  landscape?: VideoSet | null;
  /**
   * Formato do QUADRO: "portrait" usa sempre o conjunto vertical (palcos altos,
   * cards, ou `cover` em quadro largo); "auto" usa o horizontal a partir de 768px, se existir.
   */
  frame?: "auto" | "portrait";
  /** só reproduz quando true (capítulo ativo / card do topo) */
  active?: boolean;
  className?: string;
  /** object-position (ex.: "50% 40%") */
  position?: string;
  /** poster com prioridade de carregamento (hero de página) */
  priority?: boolean;
  /** `sizes` dos posters (largura renderizada do quadro) */
  sizes?: string;
};

/** No máximo UM vídeo deste tipo tocando por vez em toda a página. */
let current: HTMLVideoElement | null = null;

/**
 * Vídeo decorativo poster-first e adaptativo.
 * - Poster (<picture> com srcset) renderizado no servidor: nunca há tela preta.
 * - O <video> só é montado quando o quadro chega perto da viewport E está ativo;
 *   a versão é escolhida pelo tamanho físico do quadro (DPR ≤ 2) e pelo
 *   orçamento do dispositivo/rede (lib/video.ts → mediaBudget):
 *   reduced-motion → poster sem autoplay · Save-Data → poster ·
 *   2G/3G/downlink baixo/pouca memória → versão leve.
 * - Pausa fora da viewport; só um vídeo toca por vez. Sem áudio, playsInline.
 */
export function SmartVideo({
  portrait,
  landscape = null,
  frame = "auto",
  active = true,
  className = "",
  position = "50% 50%",
  priority = false,
  sizes = "100vw",
}: Props) {
  const box = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  // posição do quadro: "perto" (lazy) e "visível" (play/pause)
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      setVisible(true);
      return;
    }
    const lazy = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          lazy.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    const seen = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    lazy.observe(el);
    seen.observe(el);
    return () => {
      lazy.disconnect();
      seen.disconnect();
    };
  }, []);

  // escolhe a versão uma única vez, quando o vídeo passa a ser necessário
  useEffect(() => {
    if (src || failed || !active || !near) return;
    const el = box.current;
    if (!el) return;
    const useLandscape = frame === "auto" && !!landscape && window.matchMedia("(min-width: 768px)").matches;
    const rect = el.getBoundingClientRect();
    const pick = pickRendition(useLandscape && landscape ? landscape : portrait, rect.width, rect.height, mediaBudget());
    if (pick) setSrc(pick.src);
  }, [active, near, src, failed, frame, landscape, portrait]);

  const shouldPlay = active && visible;
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (shouldPlay) {
      if (current && current !== v) current.pause();
      current = v;
      v.muted = true;
      void v.play().catch(() => undefined);
    } else {
      v.pause();
    }
  }, [shouldPlay, src]);

  useEffect(
    () => () => {
      if (current === ref.current) current = null;
    },
    [],
  );

  const wide = frame === "auto" && landscape ? landscape : null;
  const fallback = smallestPoster(portrait);

  return (
    <div ref={box} className={`overflow-hidden ${className}`} aria-hidden>
      <picture>
        {wide ? <source media="(min-width: 768px)" srcSet={posterSrcSet(wide)} sizes={sizes} /> : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fallback.src}
          srcSet={posterSrcSet(portrait)}
          sizes={sizes}
          alt=""
          width={fallback.width}
          height={fallback.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: position }}
        />
      </picture>
      {src && !failed ? (
        <video
          ref={ref}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
          style={{ objectPosition: position }}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
          data-rendition={src.split("/").pop()}
          onPlaying={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      ) : null}
    </div>
  );
}
