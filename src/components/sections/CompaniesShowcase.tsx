"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { companies, companyCta, companyHref, skinTone, type Company } from "@/data/companies";
import { ButtonLink } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { SmartVideo } from "@/components/ui/SmartVideo";

const toneOf = (c: Company) => (skinTone[c.skin] === "dark" ? "white" : "black");
const chipsOf = (c: Company) => [...c.products.map((p) => p.name), ...(c.productLine ? [c.productLine.chip] : [])];

/**
 * "Nossas empresas" — duas versões, mesma informação:
 * - DESKTOP (≥1024px): capítulos. Palco sticky com a altura da tela; cada operação
 *   ocupa 100svh de rolagem. Ao trocar de capítulo, a skin do palco muda
 *   (preto → branco → papel → preto), texto e mídia fazem crossfade e só o
 *   vídeo do capítulo ativo toca. Sem scroll-jacking: a rolagem é nativa.
 * - MOBILE/TABLET (<1024px): cards empilhados (sticky só em telas altas),
 *   cada um com a skin da operação; o vídeo toca só no card do topo.
 * - prefers-reduced-motion: sem transições e sem vídeo (posters).
 */
export function CompaniesShowcase() {
  return (
    <>
      <Chapters />
      <Cards />
    </>
  );
}

/* ============================== DESKTOP ============================== */

function Chapters() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  // capítulo ativo = progresso da rolagem dentro do trilho (fatias iguais por operação)
  const range = useCallback(() => {
    const t = track.current;
    const st = stage.current;
    if (!t || !st) return null;
    const header = parseFloat(getComputedStyle(st).top) || 0; // offset do sticky (= altura do header)
    const start = t.getBoundingClientRect().top + window.scrollY - header;
    return { start, length: Math.max(1, t.offsetHeight - st.offsetHeight) };
  }, []);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = range();
      if (!r) return;
      const progress = (window.scrollY - r.start) / r.length;
      setActive(Math.min(companies.length - 1, Math.max(0, Math.floor(progress * companies.length))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    const el = track.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        onScroll();
      } else {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    });
    io.observe(el);
    const seen = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    if (stage.current) seen.observe(stage.current);
    return () => {
      io.disconnect();
      seen.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [range]);

  const goTo = (i: number) => {
    const r = range();
    if (!r) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: r.start + ((i + 0.5) / companies.length) * r.length, behavior: reduced ? "auto" : "smooth" });
  };

  const current = companies[active];

  return (
    <div ref={track} className="relative hidden lg:grid [&>*]:[grid-area:1/1]">
      {/* trilho de rolagem: 100svh por operação */}
      <div aria-hidden style={{ height: `${companies.length * 100}svh` }} />

      <div>
        <div
          ref={stage}
          data-skin={current.skin}
          className="sticky top-[var(--header-h)] h-[calc(100svh-var(--header-h))] overflow-hidden bg-sk-bg text-sk-fg transition-colors duration-700 ease-[var(--ease-out-soft)] motion-reduce:transition-none"
        >
          <div className="container-site grid h-full grid-cols-12 gap-10 py-8 xl:gap-14 xl:py-10">
            {/* ---- texto ---- */}
            <div className="col-span-5 flex min-h-0 flex-col justify-between">
              <p className="caption flex items-center gap-3 text-sk-muted">
                <span className="tabular-nums text-sk-fg">{String(active + 1).padStart(2, "0")}</span>
                <span className="h-px w-10 bg-sk-line" />
                <span className="tabular-nums">{String(companies.length).padStart(2, "0")}</span>
                <span className="ml-2">Nossas empresas</span>
              </p>

              <div className="grid [&>*]:[grid-area:1/1]">
                {companies.map((c, i) => (
                  <article
                    key={c.slug}
                    aria-hidden={i !== active}
                    inert={i !== active}
                    className={`flex flex-col items-start transition-[opacity,transform] duration-700 ease-[var(--ease-out-soft)] motion-reduce:transition-none ${
                      i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
                    }`}
                  >
                    <h3>
                      {c.media ? (
                        <CompanyLogo company={c} tone={toneOf(c)} height={92} optical className="xl:[--logo-h:108px]" />
                      ) : (
                        <CompanyLogo company={c} tone={toneOf(c)} variant="wordmark" height={34} optical />
                      )}
                    </h3>
                    <p className="mt-7 font-display text-[clamp(1.7rem,1rem+1.6vw,2.6rem)] font-black leading-[1.02] tracking-[-0.03em]">
                      {c.concept ?? c.summary}
                    </p>
                    {/* sem conceito confirmado, o resumo já é a frase — não repetir a descrição */}
                    {c.concept ? <p className="mt-4 max-w-[46ch] text-[0.98rem] leading-relaxed text-sk-muted">{c.description}</p> : null}
                    {chipsOf(c).length ? (
                      <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Produtos da ${c.name}`}>
                        {chipsOf(c).map((name) => (
                          <li key={name} className="rounded-full border border-sk-line px-3 py-1 text-[0.76rem] font-bold">
                            {name}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <ButtonLink href={companyHref(c)} variant="skin" className="mt-7">
                      {companyCta(c)}
                    </ButtonLink>
                  </article>
                ))}
              </div>

              {/* índice de capítulos */}
              <ol className="flex flex-wrap gap-x-4 gap-y-2 border-t border-sk-line pt-4 xl:gap-x-6" aria-label="Escolha a operação">
                {companies.map((c, i) => (
                  <li key={c.slug}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={i === active ? "step" : undefined}
                      className={`relative py-1 font-display text-[0.8rem] font-bold transition-colors ${
                        i === active ? "text-sk-fg" : "text-sk-muted hover:text-sk-fg"
                      }`}
                    >
                      <span className="mr-1.5 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      {c.shortName}
                      <span
                        aria-hidden
                        className={`absolute -bottom-0.5 left-0 h-[2px] bg-current transition-[width] duration-500 motion-reduce:transition-none ${i === active ? "w-full" : "w-0"}`}
                      />
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            {/* ---- mídia ---- */}
            <div className="col-span-7 min-h-0">
              <div className="relative h-full overflow-hidden rounded-[28px] bg-black">
                {companies.map((c, i) => (
                  <div
                    key={c.slug}
                    aria-hidden
                    className={`absolute inset-0 transition-opacity duration-700 ease-[var(--ease-out-soft)] motion-reduce:transition-none ${
                      i === active ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {c.media ? (
                      <SmartVideo portrait={c.media.portrait} frame="portrait" active={inView && i === active} sizes="(min-width: 1280px) 640px, 55vw" className="absolute inset-0" />
                    ) : (
                      <LogoPanel company={c} />
                    )}
                  </div>
                ))}
                <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[28px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Operação sem foto/vídeo próprio (Abacaxi.com): fundo preto e símbolo branco (o nome já está no texto ao lado). */
function LogoPanel({ company }: { company: Company }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-black">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,rgba(255,255,255,0.08),rgba(255,255,255,0)_70%)]" />
      <CompanyLogo company={company} tone="white" variant="symbol" height={170} decorative align="center" className="relative" />
    </div>
  );
}

/* ============================ MOBILE / TABLET ============================ */

function Cards() {
  const list = useRef<HTMLOListElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const [top, setTop] = useState<number | null>(null);

  // card "do topo" = o último cujo topo já passou da metade da tela (funciona com e sem sticky)
  useEffect(() => {
    const el = list.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const half = window.innerHeight * 0.5;
      let idx: number | null = null;
      items.current.forEach((li, i) => {
        if (li && li.getBoundingClientRect().top <= half) idx = i;
      });
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) idx = null;
      setTop(idx);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
      } else {
        window.removeEventListener("scroll", onScroll);
        setTop(null);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <ol ref={list} className="container-site flex flex-col gap-4 pb-14 sm:gap-5 sm:pb-20 lg:hidden">
      {companies.map((c, i) => (
        <li
          key={c.slug}
          ref={(el) => {
            items.current[i] = el;
          }}
          data-skin={c.skin}
          style={{ top: `calc(var(--header-h) + 12px + ${i * 10}px)` }}
          className="overflow-hidden rounded-[24px] border border-sk-line bg-sk-bg text-sk-fg shadow-[0_-18px_40px_-24px_rgba(0,0,0,0.9)] [@media(min-height:760px)]:sticky"
        >
          <article className="grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="relative aspect-[4/3] bg-black md:aspect-auto md:min-h-[400px]">
              {c.media ? (
                <SmartVideo portrait={c.media.portrait} frame="portrait" active={top === i} sizes="(min-width: 768px) 45vw, 100vw" className="absolute inset-0" />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-black">
                  <CompanyLogo company={c} tone="white" variant="symbol" height={96} decorative />
                </div>
              )}
              <span className="caption absolute top-3 left-3 rounded-full bg-black/65 px-3 py-1.5 text-white backdrop-blur-sm">
                {String(i + 1).padStart(2, "0")} / {String(companies.length).padStart(2, "0")}
              </span>
            </div>
            <div className="flex flex-col items-start p-5 sm:p-7">
              <h3>
                <CompanyLogo company={c} tone={toneOf(c)} variant="wordmark" height={28} optical className="sm:[--logo-h:34px]" />
              </h3>
              <p className="mt-4 font-display text-[1.45rem] font-black leading-[1.05] tracking-[-0.02em] sm:text-[1.7rem]">
                {c.concept ?? c.summary}
              </p>
              {c.concept ? <p className="mt-2.5 text-[0.92rem] leading-relaxed text-sk-muted">{c.summary}</p> : null}
              {chipsOf(c).length ? (
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`Produtos da ${c.name}`}>
                  {chipsOf(c).map((name) => (
                    <li key={name} className="rounded-full border border-sk-line px-2.5 py-1 text-[0.72rem] font-bold">
                      {name}
                    </li>
                  ))}
                </ul>
              ) : null}
              <ButtonLink href={companyHref(c)} variant="skin" size="lg" full className="mt-6 sm:w-auto">
                {companyCta(c)}
              </ButtonLink>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
