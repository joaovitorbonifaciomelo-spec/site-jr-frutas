"use client";

import { useEffect, useRef, useState } from "react";
import { mediaBudget, pickRendition, portraitSet, posterSrcSet } from "@/lib/video";

/**
 * Vídeo de fundo do hero — PENDENTE DE NOVA GRAVAÇÃO/DIREÇÃO (o vídeo atual
 * não é a direção final; não trocar por outro sem nova gravação).
 * - Desktop (≥768px): hero-wide.mp4 atual (placeholder horizontal, mantido como está).
 * - Mobile: mesmo corte, regenerado dos ORIGINAIS de câmera em 720/1080
 *   (scripts/build-videos.py → hero-mobile); versão escolhida pelo quadro + rede.
 * - Poster no servidor → nunca há tela preta. reduced-motion/Save-Data → só poster.
 * - Pausa quando o hero sai da tela.
 */
const MOBILE = portraitSet("/video/hero-mobile", "/video/hero-mobile-poster");
const WIDE = { src: "/video/hero-wide.mp4", poster: "/video/hero-wide-poster.webp" };

export function HeroVideo({ className = "" }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const budget = mediaBudget();
    if (budget === "none" || budget === "poster") return;
    if (window.matchMedia("(min-width: 768px)").matches) {
      setSrc(WIDE.src);
    } else {
      const r = el.getBoundingClientRect();
      setSrc(pickRendition(MOBILE, r.width, r.height, budget)?.src ?? null);
    }
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
        <source media="(max-width: 767px)" srcSet={posterSrcSet(MOBILE)} sizes="100vw" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={WIDE.poster}
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
