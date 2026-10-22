"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { companies, companyHref } from "@/data/companies";
import { contacts, nav, quoteWhatsappLink, unitMessage, units, unitWhatsappLink } from "@/data/site";
import { ButtonLink } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { Logo } from "@/components/ui/Logo";
import { ArrowRight, Close, Instagram, Mail, Menu, WhatsApp } from "@/components/ui/Icons";

/**
 * Header único da JR Frutas — o mesmo em todas as rotas (home e páginas das operações).
 * - Faixa utilitária (≥1024px, não fixa): WhatsApp das duas unidades + e-mail + Instagram.
 * - Barra principal fixa: logo · navegação · dropdown "Empresas" · CTA de cotação.
 * - Mobile/tablet (<1024px): menu em tela cheia, "Empresas" como sublista expansível.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Faixa utilitária — desktop */}
      <div className="hidden border-b border-white/10 bg-black text-white lg:block">
        <div className="container-site flex h-9 items-center justify-between gap-6 text-[0.72rem] text-white/65">
          <ul className="flex items-center gap-6">
            {units.map((u) => (
              <li key={u.id}>
                <a
                  href={unitWhatsappLink(u, unitMessage(u.city)) ?? `tel:${u.phoneE164}`}
                  target="_blank"
                  rel="noopener"
                  aria-label={`WhatsApp ${u.name}: ${u.phone}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <WhatsApp size={13} />
                  <span className="font-bold text-white/85">{u.city}</span>
                  <span>{u.phone}</span>
                </a>
              </li>
            ))}
          </ul>
          <ul className="flex items-center gap-6">
            {contacts.email ? (
              <li>
                <a href={contacts.email.href} className="inline-flex items-center gap-2 transition-colors hover:text-white">
                  <Mail size={13} /> {contacts.email.address}
                </a>
              </li>
            ) : null}
            <li>
              <a href={contacts.instagram.href} target="_blank" rel="noopener" className="inline-flex items-center gap-2 transition-colors hover:text-white">
                <Instagram size={13} /> @{contacts.instagram.handle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 bg-black text-white transition-[border-color] duration-300 ${
          scrolled ? "border-b border-white/10" : "border-b border-transparent"
        }`}
      >
        <div className="container-site flex h-[var(--header-h)] items-center justify-between gap-4">
          <Logo height={40} priority />

          {/* Navegação desktop */}
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-4 xl:gap-6">
              {nav.map((item) =>
                item.dropdown === "empresas" ? (
                  <li key={item.href}>
                    <CompaniesDropdown label={item.label} />
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link href={item.href} className={navLink}>
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="hidden lg:block">
            <ButtonLink href={quoteWhatsappLink()} target="_blank" rel="noopener" icon={false} className="h-11 px-4 xl:px-5">
              Solicite uma cotação
            </ButtonLink>
          </div>

          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
            className="grid size-12 place-items-center rounded-lg text-white lg:hidden"
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>

        <MobileMenu open={open} onClose={() => setOpen(false)} />
      </header>
    </>
  );
}

const navLink =
  "relative font-display whitespace-nowrap text-[0.78rem] font-bold tracking-[0.02em] text-white/85 transition-colors hover:text-white after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-white after:transition-[width] after:duration-300 hover:after:w-full";

/**
 * Dropdown "Empresas" — disclosure acessível (button + painel).
 * Abre no clique/Enter/Espaço e no hover (ponteiro fino); fecha com Esc,
 * clique fora ou ao tirar o foco do conjunto.
 */
function CompaniesDropdown({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const uid = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);
  /** tipo do último ponteiro: com mouse o hover já abre, então o clique não pode fechar (toggle) */
  const pointer = useRef<string>("");

  const close = useCallback((focusButton = false) => {
    setOpen(false);
    if (focusButton) btn.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const hoverOpen = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timer.current);
    setOpen(true);
  };
  const hoverClose = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 160);
  };

  return (
    <div
      ref={wrap}
      className="relative"
      onPointerEnter={hoverOpen}
      onPointerLeave={hoverClose}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls={`${uid}-panel`}
        onPointerDown={(e) => {
          pointer.current = e.pointerType;
        }}
        onClick={() => {
          // mouse: o hover já abriu → clique mantém aberto · teclado/toque: alterna
          if (pointer.current === "mouse") setOpen(true);
          else setOpen((v) => !v);
          pointer.current = "";
        }}
        className={`${navLink} inline-flex items-center gap-1.5`}
      >
        {label}
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        id={`${uid}-panel`}
        className={`absolute top-full left-1/2 z-50 w-[360px] -translate-x-1/2 pt-5 transition-[opacity,transform,visibility] duration-300 ease-[var(--ease-out-soft)] ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-[18px] border border-white/12 bg-[#0b0b0b] p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]">
          <p className="eyebrow px-3 pt-2 pb-2 text-[0.62rem] text-white/60">Operações da JR Frutas</p>
          <ul>
            {companies.map((c) => (
              <li key={c.slug}>
                <Link
                  href={companyHref(c)}
                  onClick={() => close()}
                  className="group flex items-center gap-3 rounded-[12px] px-3 py-3 transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
                >
                  {/* wordmark real de cada operação (os selos são todos iguais) — tamanho óptico */}
                  <span className="flex min-w-0 flex-1 flex-col items-start">
                    <CompanyLogo company={c} tone="white" variant="wordmark" height={17} optical />
                    <span className="mt-1.5 block w-full truncate text-[0.76rem] text-white/60">{c.summary}</span>
                  </span>
                  <ArrowRight size={15} className="shrink-0 text-white/40 transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:text-white" />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#empresas"
            onClick={() => close()}
            className="mt-1 flex items-center justify-between rounded-[12px] border-t border-white/10 px-3 pt-3 pb-2.5 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-white/70 transition-colors hover:text-white"
          >
            Ver todas as operações <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [empresas, setEmpresas] = useState(false);
  const uid = useId();

  return (
    <div
      id="menu-mobile"
      aria-hidden={!open}
      inert={!open}
      className={`fixed inset-x-0 top-[var(--header-h)] bottom-0 z-40 bg-black transition-[opacity,visibility] duration-300 lg:hidden ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div className="container-site flex h-full flex-col overflow-y-auto pt-2 pb-8">
        <nav aria-label="Menu mobile">
          <ul className="divide-y divide-white/10 border-b border-white/10">
            {nav.map((item, i) => (
              <li
                key={item.href}
                className={`transition-[opacity,transform] duration-500 ease-[var(--ease-out-soft)] motion-reduce:transition-none ${
                  open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${60 + i * 40}ms` : "0ms" }}
              >
                {item.dropdown === "empresas" ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={empresas}
                      aria-controls={`${uid}-empresas`}
                      onClick={() => setEmpresas((v) => !v)}
                      className="flex min-h-13 w-full items-center justify-between py-2.5 text-left font-display text-[1.25rem] font-extrabold tracking-[-0.01em]"
                    >
                      {item.label}
                      <span aria-hidden className={`text-white/40 transition-transform duration-300 ${empresas ? "rotate-45" : ""}`}>
                        +
                      </span>
                    </button>
                    <div
                      id={`${uid}-empresas`}
                      className={`grid transition-[grid-template-rows] duration-400 ease-[var(--ease-out-soft)] ${empresas ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <div className="overflow-hidden">
                        <ul className="grid grid-cols-2 gap-2 pb-4" inert={!empresas}>
                          {companies.map((c) => (
                            <li key={c.slug}>
                              <Link
                                href={companyHref(c)}
                                onClick={onClose}
                                className="flex h-full min-h-[72px] items-center rounded-[14px] border border-white/14 px-3 py-4 transition-colors hover:border-white/40"
                              >
                                <CompanyLogo company={c} tone="white" variant="wordmark" height={19} optical />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex min-h-13 items-center justify-between py-2.5 font-display text-[1.25rem] font-extrabold tracking-[-0.01em]"
                  >
                    {item.label}
                    <span aria-hidden className="text-white/40">
                      →
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={`mt-6 flex flex-col gap-3 transition-[opacity,transform] duration-500 motion-reduce:transition-none ${
            open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
          style={{ transitionDelay: open ? "360ms" : "0ms" }}
        >
          <p className="eyebrow text-white/55">Unidades</p>
          <ul className="flex flex-col gap-2 sm:flex-row">
            {units.map((u) => (
              <li key={u.id} className="sm:flex-1">
                <a
                  href={unitWhatsappLink(u, unitMessage(u.city)) ?? `tel:${u.phoneE164}`}
                  target="_blank"
                  rel="noopener"
                  onClick={onClose}
                  className="flex min-h-14 items-center gap-3 rounded-[var(--radius-pill)] border border-white/18 px-4 py-3 text-white transition-colors hover:border-white/40"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-black">
                    <WhatsApp size={18} />
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block font-display text-[0.92rem] font-extrabold">{u.name}</span>
                    <span className="block text-[0.82rem] text-white/70">{u.phone} · WhatsApp</span>
                  </span>
                  <ArrowRight size={18} className="shrink-0 text-white/60" />
                </a>
              </li>
            ))}
          </ul>
          <ButtonLink href={quoteWhatsappLink()} target="_blank" rel="noopener" size="lg" full className="mt-2" onClick={onClose}>
            Solicite uma cotação
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
