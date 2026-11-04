"use client";

import { useEffect, useRef, useState } from "react";
import { landscapeSet, mediaBudget, pickRendition, portraitSet, posterSrcSet } from "@/lib/video";

/**
 * Vídeo de fundo do hero JR Frutas — edição final (masters em scripts/build-videos.py → MASTERS).
 * - Quadro horizontal (desktop, tablet deitado, celular deitado): hero-jr-desktop (16:9) 540/720/1080.
 * - Quadro vertical (celular, tablet em pé): hero-jr-mobile (9:16) editado para mobile — nunca crop do desktop.
 * - Versão escolhida pelo tamanho físico do quadro + rede/dispositivo (pickRendition); só UMA é baixada.
 *   Desktop ≥ ~1440px com orçamento "high" → sempre a 1080 (não conclui pelo DPR que a 720 basta).
 * - Poster no servidor (srcset por orientação) → nunca há tela preta. reduced-motion/Save-Data → só poster.
 * - Pausa quando o hero sai da tela.
 */
const PORTRAIT = "(max-aspect-ratio: 1/1)";
const BIG_DESKTOP = "(min-width: 1400px)";
const MOBILE = portraitSet("/video/hero-jr-mobile", "/video/hero-jr-mobile-poster");
const WIDE = landscapeSet("/video/hero-jr-desktop", "/video/hero-jr-desktop-poster");

export function HeroVideo({ className = "" }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const budget = mediaBudget();
    if (budget === "poster") return;
    const r = el.getBoundingClientRect();
    const set = window.matchMedia(PORTRAIT).matches ? MOBILE : WIDE;
    // desktop grande (≥ ~1440px) + rede/dispositivo bons → maior versão disponível, mesmo em DPR 1
    // (o hero é a peça principal da página; rede/dispositivo limitado continua indo para a leve)
    const bigDesktop = set === WIDE && budget === "high" && window.matchMedia(BIG_DESKTOP).matches;
    setSrc((bigDesktop ? WIDE.renditions[WIDE.renditions.length - 1] : pickRendition(set, r.width, r.height, budget))?.src ?? null);
  }, []);

  // pausa fora da viewport
  useEffect(() => {
    const el = box.current;
    if (!el || !src || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => {
      const v = ref.current;
      if (!v) return;
      if (e.isIntersecting) void v.play().catch(() => undefined);
      else v.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <div ref={box} className={`overflow-hidden bg-black ${className}`} aria-hidden>
      <picture>
        <source media={PORTRAIT} srcSet={posterSrcSet(MOBILE)} sizes="100vw" />
        <img
          src={WIDE.posters[0].src}
          srcSet={posterSrcSet(WIDE)}
          sizes="100vw"
          alt=""
          width={1280}
          height={720}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[58%_40%] md:object-center"
        />
      </picture>
      {src ? (
        <video
          ref={ref}
          className={`absolute inset-0 h-full w-full object-cover object-[58%_40%] transition-opacity duration-700 md:object-center ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
          data-rendition={src.split("/").pop()}
          onPlaying={() => setReady(true)}
          onError={() => setSrc(null)}
        />
      ) : null}
      {/* overlay: escurece a esquerda (texto) e a base; vídeo segue presente à direita */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.6)_45%,rgba(0,0,0,0.35)_70%,rgba(0,0,0,0.85)_100%)] md:bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.72)_38%,rgba(0,0,0,0.35)_70%,rgba(0,0,0,0.25)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.85)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(0,0,0,0.6),rgba(0,0,0,0))]" />
    </div>
  );
}
