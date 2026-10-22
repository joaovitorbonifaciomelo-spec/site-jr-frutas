import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { companies, companyCta, companyHref, companyWhatsappLink, skinTone, type Company, type ProductLine } from "@/data/companies";
import { quoteWhatsappLink, unitMessage, units, unitWhatsappLink } from "@/data/site";
import { ButtonLink } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { ArrowRight, ExternalArrow, Instagram, MapPin, Phone, WhatsApp } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SmartVideo } from "@/components/ui/SmartVideo";

/**
 * Template ÚNICO das páginas das operações (/empresas/[slug]).
 * A linguagem de cada skin vem de dados + tokens, não de CSS por página:
 * - skin (cores)  → [data-skin] em globals.css
 * - heroLayout    → cinematic (JR COCO) · editorial (Bela) · documental (FRUTAFORTE) · lean (Abacaxi.com)
 * - SectionHead   → numeração editorial, "Registro" documental ou eyebrow simples
 * Seções sem dado confirmado não renderizam (nada de placeholder público).
 */
export function CompanyPage({ company: c }: { company: Company }) {
  const sections: { id: string; eyebrow: string; title: string; body: ReactNode }[] = [];
  if (c.heroLayout !== "lean")
    sections.push({ id: "sobre", eyebrow: "A operação", title: `O que é ${c.article} ${c.shortName}`, body: <Intro c={c} /> });
  if (c.products.length)
    sections.push({ id: "produtos", eyebrow: "Especialidade", title: c.products.length > 3 ? "Produtos em volume, com padrão." : "Produtos da operação.", body: <Products c={c} /> });
  if (c.differentials.length) sections.push({ id: "diferencial", eyebrow: "Diferencial", title: "O que faz a diferença.", body: <Differentials c={c} /> });
  if (c.steps.length)
    sections.push({
      id: "operacao",
      eyebrow: c.slug === "frutaforte" ? "Parceria no campo" : c.slug === "bela-fruta" ? "Como comprar" : "Operação",
      title: c.slug === "frutaforte" ? "Do pé ao caminhão, acompanhado de perto." : c.slug === "bela-fruta" ? "Do WhatsApp ao seu caminhão." : "Do coqueiral ao seu negócio.",
      body: <Steps c={c} />,
    });
  if (c.people.length) sections.push({ id: "pessoas", eyebrow: "Quem está no campo", title: "Pessoas reais, na lavoura.", body: <People c={c} /> });
  if (c.gallery.length) sections.push({ id: "galeria", eyebrow: "Galeria", title: "A operação, como ela é.", body: <Gallery c={c} /> });

  return (
    <div data-skin={c.skin} className="bg-sk-bg text-sk-fg">
      <Hero c={c} />
      {sections.map((s, i) => (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-titulo`} className={i % 2 === 1 && c.heroLayout !== "editorial" ? "bg-sk-surface" : ""}>
          <div className="container-site py-14 sm:py-20 lg:py-24">
            <Reveal>
              <SectionHead c={c} n={i + 1} eyebrow={s.eyebrow} title={s.title} id={`${s.id}-titulo`} />
            </Reveal>
            <div className="mt-10 lg:mt-14">{s.body}</div>
          </div>
        </section>
      ))}
      <Contact c={c} />
      <Others current={c} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

const pad = (n: number) => String(n).padStart(2, "0");
const logoTone = (c: Company) => (skinTone[c.skin] === "dark" ? "white" : "black");

function SectionHead({ c, n, eyebrow, title, id }: { c: Company; n: number; eyebrow: string; title: string; id: string }) {
  if (c.heroLayout === "editorial")
    return (
      <div className="grid gap-3 border-t-2 border-sk-fg pt-6 md:grid-cols-[140px_minmax(0,1fr)] md:gap-8">
        <span aria-hidden className="h-mega text-[3.2rem] md:text-[5rem]">
          {pad(n)}
        </span>
        <div>
          <p className="eyebrow text-sk-muted">{eyebrow}</p>
          <h2 id={id} className="h-section mt-2 max-w-[20ch] md:text-[clamp(2rem,1.2rem+2.2vw,3.2rem)]">
            {title}
          </h2>
        </div>
      </div>
    );
  if (c.heroLayout === "documental")
    return (
      <div>
        <p className="caption flex flex-wrap items-center gap-3 text-sk-muted">
          <span className="rounded-[4px] border border-sk-fg/30 px-2 py-1 text-sk-fg">Registro {pad(n)}</span>
          {eyebrow}
        </p>
        <h2 id={id} className="h-section mt-4 max-w-[22ch]">
          {title}
        </h2>
      </div>
    );
  return (
    <div>
      <p className="eyebrow text-sk-muted">{eyebrow}</p>
      <h2 id={id} className="h-section mt-3 max-w-[22ch]">
        {title}
      </h2>
    </div>
  );
}

function Breadcrumb({ c }: { c: Company }) {
  return (
    <nav aria-label="Trilha de navegação" className="caption">
      <ol className="flex flex-wrap items-center gap-2 opacity-75">
        <li>
          <Link href="/" className="hover:underline">
            JR Frutas
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          <Link href="/#empresas" className="hover:underline">
            Empresas
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li aria-current="page">{c.shortName}</li>
      </ol>
    </nav>
  );
}

/** CTA principal: canal PRÓPRIO da operação; sem canal próprio, diz explicitamente que é a JR Frutas. */
function PrimaryCta({ c, size = "lg", className = "" }: { c: Company; size?: "md" | "lg"; className?: string }) {
  const own = companyWhatsappLink(c);
  return own ? (
    <ButtonLink href={own} target="_blank" rel="noopener" size={size} variant="skin" icon={<WhatsApp size={18} />} className={className}>
      Fale com {c.article} {c.shortName}
    </ButtonLink>
  ) : (
    <ButtonLink
      href={quoteWhatsappLink(`Olá! Vim pela página da ${c.name} no site da JR Frutas e gostaria de mais informações.`)}
      target="_blank"
      rel="noopener"
      size={size}
      variant="skin"
      icon={<WhatsApp size={18} />}
      className={className}
    >
      Fale com a JR Frutas
    </ButtonLink>
  );
}

function SecondaryCta({ c, className = "" }: { c: Company; className?: string }) {
  return c.products.length ? (
    <ButtonLink href="#produtos" size="lg" variant="skin-outline" className={className}>
      Ver produtos
    </ButtonLink>
  ) : (
    <ButtonLink href="/#empresas" size="lg" variant="skin-outline" className={className}>
      Outras operações
    </ButtonLink>
  );
}

/* ============================== HERO ============================== */

function Hero({ c }: { c: Company }) {
  if (c.heroLayout === "cinematic" && c.media)
    return (
      <section className="relative isolate overflow-hidden bg-black text-white" aria-labelledby="empresa-h1">
        {/* desktop: placeholder horizontal PENDENTE DE NOVA GRAVAÇÃO · mobile: vertical dos originais */}
        <SmartVideo portrait={c.media.portrait} landscape={c.media.landscape} priority className="absolute inset-0 -z-10" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.25)_40%,rgba(0,0,0,0.92)_100%)] md:bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.55)_50%,rgba(0,0,0,0.15)_100%)]" />
        <div className="container-site flex min-h-[calc(100svh-var(--header-h))] flex-col justify-between gap-10 py-8 lg:min-h-[calc(100svh-var(--header-h)-36px)] lg:py-12">
          <Breadcrumb c={c} />
          <div className="max-w-[620px] pb-4">
            <CompanyLogo company={c} tone="white" height={104} priority className="sm:!h-[128px]" />
            {c.concept ? <p className="eyebrow mt-8 text-white/75">{c.concept}</p> : null}
            <h1 id="empresa-h1" className="h-section mt-3 [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]">
              {c.h1}
            </h1>
            <p className="mt-4 max-w-[48ch] text-[1.05rem] leading-relaxed text-white/80">{c.heroLine ?? c.summary}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row" data-skin={c.skin}>
              <PrimaryCta c={c} className="w-full sm:w-auto" />
              <SecondaryCta c={c} className="w-full sm:w-auto" />
            </div>
          </div>
        </div>
      </section>
    );

  if (c.heroLayout === "editorial" && c.media)
    return (
      <section aria-labelledby="empresa-h1">
        <div className="container-site grid gap-10 py-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch lg:gap-14 lg:py-12">
          <div className="flex flex-col">
            <Breadcrumb c={c} />
            <div className="flex flex-1 flex-col justify-center py-8 lg:py-12">
              <CompanyLogo company={c} tone="black" height={96} priority className="lg:!h-[120px]" />
              {c.concept ? <p className="eyebrow mt-8 text-sk-muted">{c.concept}</p> : null}
              <h1 id="empresa-h1" className="h-display mt-3 max-w-[16ch]">
                {c.h1}
              </h1>
              <p className="mt-5 max-w-[50ch] text-[1.08rem] leading-relaxed text-sk-muted">{c.summary}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryCta c={c} className="w-full sm:w-auto" />
                <SecondaryCta c={c} className="w-full sm:w-auto" />
              </div>
              {c.heroFacts?.length ? (
                <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-sk-line bg-sk-line sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                  {c.heroFacts.map((f) => (
                    <li key={f} className="bg-sk-bg p-3.5">
                      <p className="font-display text-[0.86rem] font-black leading-tight">{f}</p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-black sm:aspect-[16/11] lg:aspect-auto lg:min-h-[640px]">
            <SmartVideo portrait={c.media.portrait} frame="portrait" priority sizes="(min-width: 1024px) 45vw, 100vw" className="absolute inset-0" />
          </div>
        </div>
      </section>
    );

  if (c.heroLayout === "documental" && c.media)
    return (
      <section aria-labelledby="empresa-h1">
        <div className="container-site py-8 lg:py-12">
          <Breadcrumb c={c} />
          <div className="mt-8 grid gap-8 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
            <div>
              {c.concept ? <p className="caption text-sk-muted">{c.concept}</p> : null}
              <h1 id="empresa-h1" className="h-display mt-3 max-w-[18ch]">
                {c.h1}
              </h1>
              <p className="mt-5 max-w-[56ch] text-[1.08rem] leading-relaxed text-sk-muted">{c.summary}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryCta c={c} className="w-full sm:w-auto" />
                <SecondaryCta c={c} className="w-full sm:w-auto" />
              </div>
            </div>
            <CompanyLogo company={c} tone="black" height={110} priority className="hidden lg:block xl:!h-[140px]" />
          </div>
          <figure className="mt-10 lg:mt-14">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-black sm:aspect-[16/9] lg:aspect-[21/9]">
              <SmartVideo portrait={c.media.portrait} frame="portrait" priority position="50% 42%" sizes="(min-width: 1280px) 1136px, 100vw" className="absolute inset-0" />
            </div>
            <figcaption className="caption mt-3 flex flex-wrap justify-between gap-2 border-b border-sk-line pb-3 text-sk-muted">
              <span>Lavoura do produtor parceiro · registro em vídeo</span>
              <span>{c.signature}</span>
            </figcaption>
          </figure>
        </div>
      </section>
    );

  // lean — sem mídia própria: preto, logo branca
  return (
    <section aria-labelledby="empresa-h1" className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(55%_50%_at_50%_42%,rgba(255,255,255,0.09),rgba(255,255,255,0)_70%)]" />
      <div className="container-site relative flex min-h-[calc(100svh-var(--header-h))] flex-col py-8 lg:min-h-[calc(100svh-var(--header-h)-36px)] lg:py-12">
        <Breadcrumb c={c} />
        <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
          <CompanyLogo company={c} tone="white" height={150} priority align="center" className="sm:!h-[210px]" />
          <h1 id="empresa-h1" className="mt-10 max-w-[22ch] font-display text-[1.35rem] font-extrabold leading-tight sm:text-[1.6rem]">
            {c.h1}
          </h1>
          <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <PrimaryCta c={c} className="w-full sm:w-auto" />
            <SecondaryCta c={c} className="w-full sm:w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================== SEÇÕES ============================== */

function Intro({ c }: { c: Company }) {
  const facts: { label: string; value: ReactNode }[] = [{ label: "Faz parte de", value: "JR Frutas Atacadista" }];
  if (c.products.length)
    facts.push({ label: "Produtos", value: [...c.products.map((p) => p.name), ...(c.productLine ? [c.productLine.chip] : [])].join(" · ") });
  if (c.address) facts.push({ label: "Onde", value: c.address.lines.join(" · ") });
  if (c.contact?.whatsappDisplay) facts.push({ label: "WhatsApp", value: c.contact.whatsappDisplay });
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
      <Reveal>
        {c.quote ? (
          <blockquote className="font-display text-[clamp(1.8rem,1.1rem+2.4vw,3.2rem)] font-black leading-[1.05] tracking-[-0.03em]">
            “{c.quote.replace(/\.$/, "")}.”
          </blockquote>
        ) : null}
        <p className="mt-6 max-w-[56ch] text-[1.02rem] leading-relaxed text-sk-muted">{c.description}</p>
      </Reveal>
      <Reveal as="dl" delay={80} className="border-t border-sk-line">
        {facts.map((f) => (
          <div key={f.label} className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 border-b border-sk-line py-4 text-[0.92rem]">
            <dt className="caption pt-0.5 text-sk-muted">{f.label}</dt>
            <dd className="font-semibold">{f.value}</dd>
          </div>
        ))}
      </Reveal>
    </div>
  );
}

function Products({ c }: { c: Company }) {
  const many = c.products.length > 3;
  const two = c.products.length === 2;
  return (
    <>
      <ul
        aria-label={`Produtos da ${c.name}`}
        tabIndex={two ? undefined : 0}
        className={
          two
            ? "grid gap-5 sm:grid-cols-2"
            : `no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:gap-5 sm:overflow-visible sm:px-0 ${
                many ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" : "sm:grid-cols-3"
              }`
        }
      >
        {c.products.map((p, i) => (
          <Reveal as="li" key={p.name} delay={i * 70} className={two ? "" : "w-[72vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none"}>
            <article>
              <div className={`relative overflow-hidden rounded-[var(--radius-card)] bg-black/10 ${two ? "aspect-[4/3]" : "aspect-[4/5]"}`}>
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  fill
                  sizes={two ? "(min-width: 640px) 50vw, 100vw" : many ? "(min-width: 1280px) 230px, (min-width: 640px) 33vw, 72vw" : "(min-width: 640px) 33vw, 72vw"}
                  placeholder="blur"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 font-display text-[1.3rem] font-black tracking-[-0.02em]">{p.name}</h3>
              <p className="mt-1.5 text-[0.9rem] leading-relaxed text-sk-muted">{p.short}</p>
            </article>
          </Reveal>
        ))}
      </ul>
      {c.productLine ? <ProductLineBlock line={c.productLine} /> : null}
    </>
  );
}

/**
 * Linha embalada (JR COCO · coco ralado 2 kg): bloco editorial com matriz
 * Sem película / Com película — não vira um card por variação. A foto é a
 * mídia real relacionada (coco ralado no galpão), não uma foto de embalagem.
 */
function ProductLineBlock({ line }: { line: ProductLine }) {
  return (
    <Reveal className="mt-8 overflow-hidden rounded-[var(--radius-card)] border border-sk-line bg-sk-surface lg:mt-10">
      <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        {line.image ? (
          <figure className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[440px]">
            <Image src={line.image.src} alt={line.image.alt} fill sizes="(min-width: 1024px) 460px, 100vw" placeholder="blur" className="object-cover" />
            {line.image.caption ? (
              <figcaption className="caption absolute bottom-3 left-3 rounded-full bg-black/65 px-3 py-1.5 text-white backdrop-blur-sm">
                {line.image.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}
        <div className="p-6 sm:p-8 lg:p-12">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="eyebrow text-sk-muted">{line.eyebrow}</p>
              <h3 className="mt-2 font-display text-[clamp(1.7rem,1.2rem+1.5vw,2.4rem)] font-black leading-[1.05] tracking-[-0.03em]">{line.title}</h3>
            </div>
            <p className="shrink-0 rounded-full border border-sk-fg/30 px-4 py-2 font-display text-[1rem] font-black">{line.pack}</p>
          </div>
          <p className="mt-4 max-w-[50ch] text-[0.95rem] leading-relaxed text-sk-muted">{line.text}</p>
          <div className="mt-8 grid grid-cols-2 gap-x-6 sm:gap-x-12">
            {line.groups.map((g) => (
              <div key={g.name}>
                <h4 className="caption border-b border-sk-fg/40 pb-3 text-sk-fg">{g.name}</h4>
                <ul aria-label={`${line.title} — ${g.name}`}>
                  {g.items.map((it) => (
                    <li key={it} className="border-b border-sk-line py-3 font-display text-[1.05rem] font-bold sm:py-3.5 sm:text-[1.2rem]">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Differentials({ c }: { c: Company }) {
  return (
    <ul className={`grid gap-x-8 sm:grid-cols-2 ${c.differentials.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {c.differentials.map((d, i) => (
        <Reveal as="li" key={d.title} delay={i * 70} className="border-t border-sk-line py-6">
          <span aria-hidden className="h-mega text-[2.6rem] text-sk-muted">
            {pad(i + 1)}
          </span>
          <h3 className="mt-4 font-display text-[1.2rem] font-black tracking-[-0.01em]">{d.title}</h3>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-sk-muted">{d.text}</p>
        </Reveal>
      ))}
    </ul>
  );
}

function Steps({ c }: { c: Company }) {
  const withImages = c.steps.every((s) => s.image);
  if (withImages)
    return (
      <ol aria-label="Etapas da operação" tabIndex={0} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {c.steps.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 80} className="w-[74vw] max-w-[330px] shrink-0 snap-start sm:w-auto sm:max-w-none">
            <figure>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-black/10">
                <Image src={s.image!.src} alt={s.image!.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 74vw" placeholder="blur" className="object-cover" style={{ objectPosition: s.image!.position }} />
              </div>
              <figcaption className="mt-4">
                <span className="caption text-sk-muted">Etapa {pad(i + 1)}</span>
                <span className="mt-1.5 block font-display text-[1.25rem] font-black tracking-[-0.02em]">{s.title}</span>
                <span className="mt-1.5 block text-[0.9rem] leading-relaxed text-sk-muted">{s.text}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ol>
    );
  return (
    <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
      {c.steps.map((s, i) => (
        <Reveal as="li" key={s.title} delay={i * 80} className="grid grid-cols-[56px_minmax(0,1fr)] gap-x-3 border-t border-sk-line py-6 sm:block">
          <span aria-hidden className="h-mega text-[3rem] sm:text-[3.6rem]">
            {pad(i + 1)}
          </span>
          <div className="sm:mt-5">
            <h3 className="font-display text-[1.2rem] font-black tracking-[-0.01em]">{s.title}</h3>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-sk-muted">{s.text}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

function People({ c }: { c: Company }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {c.people.map((p, i) => (
        <Reveal as="li" key={p.name} delay={i * 80}>
          <figure>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-black/10 sm:aspect-[4/4.4]">
              <Image src={p.image.src} alt={p.image.alt} fill sizes="(min-width: 640px) 45vw, 100vw" placeholder="blur" className="object-cover" style={{ objectPosition: p.image.position }} />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-b border-sk-line pb-4">
              <span className="font-display text-[1.3rem] font-black tracking-[-0.02em]">{p.name}</span>
              <span className="caption text-right text-sk-muted">{p.role}</span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
  );
}

/**
 * Galeria — equilibrada pelo número de fotos e sem coluna única gigante no mobile:
 * 4 fotos → grade 2×2 · 3 fotos → destaque + 2 (mobile) / 3 colunas (desktop) ·
 * demais → masonry em 2 colunas (mobile) / 3 (desktop).
 */
function Gallery({ c }: { c: Company }) {
  const n = c.gallery.length;
  const round = c.heroLayout === "documental" ? "rounded-[6px]" : "rounded-[var(--radius-card)]";
  const caption = (text?: string) => (text ? <figcaption className="caption mt-2 text-sk-muted sm:mt-2.5">{text}</figcaption> : null);

  if (n === 4 || n === 3)
    return (
      <ul className={`grid grid-cols-2 gap-3 sm:gap-5 ${n === 3 ? "lg:grid-cols-3" : ""}`}>
        {c.gallery.map((g, i) => (
          <Reveal as="li" key={g.caption ?? i} delay={(i % 3) * 70} className={n === 3 && i === 0 ? "col-span-2 lg:col-span-1" : ""}>
            <figure>
              <div className={`relative overflow-hidden bg-black/10 ${round} ${n === 4 ? "aspect-[4/3]" : i === 0 ? "aspect-[4/3] lg:aspect-[4/5]" : "aspect-[4/5]"}`}>
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes={n === 4 ? "(min-width: 1024px) 580px, 50vw" : "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"}
                  placeholder="blur"
                  className="object-cover"
                  style={{ objectPosition: g.position }}
                />
              </div>
              {caption(g.caption)}
            </figure>
          </Reveal>
        ))}
      </ul>
    );

  return (
    <ul className="columns-2 gap-3 sm:gap-4 lg:columns-3 [&>li]:mb-3 [&>li]:break-inside-avoid sm:[&>li]:mb-4">
      {c.gallery.map((g, i) => (
        <Reveal as="li" key={g.caption ?? i} delay={(i % 3) * 70}>
          <figure>
            <Image
              src={g.src}
              alt={g.alt}
              sizes="(min-width: 1024px) 380px, 50vw"
              placeholder="blur"
              className={`h-auto w-full ${round}`}
            />
            {caption(g.caption)}
          </figure>
        </Reveal>
      ))}
    </ul>
  );
}

/* ============================== CONTATO ============================== */

const action =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-btn)] px-5 font-display text-[0.76rem] font-bold uppercase tracking-[0.1em] transition-colors";

function Contact({ c }: { c: Company }) {
  const own = companyWhatsappLink(c);
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="border-t border-sk-line">
      <div className="container-site py-14 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <Reveal>
            <p className="eyebrow text-sk-muted">Contato</p>
            <h2 id="contato-titulo" className="h-display mt-3 max-w-[14ch]">
              {own ? `Fale com ${c.article} ${c.shortName}.` : "Atendimento pela JR Frutas."}
            </h2>
            <p className="mt-5 max-w-[46ch] text-[1rem] leading-relaxed text-sk-muted">
              {own
                ? "Atendimento comercial direto. Envie produtos e quantidades e receba a cotação."
                : `${c.name} ainda não tem canal de atendimento próprio publicado. Fale com uma das unidades da JR Frutas.`}
            </p>
          </Reveal>

          <Reveal delay={80} className="flex flex-col gap-3">
            {own && c.contact ? (
              <>
                <a href={own} target="_blank" rel="noopener" className={`${action} bg-sk-fg text-sk-bg hover:opacity-85`}>
                  <WhatsApp size={18} /> WhatsApp {c.contact.whatsappDisplay}
                </a>
                {c.contact.phone && c.contact.phoneE164 ? (
                  <a href={`tel:${c.contact.phoneE164}`} className={`${action} border border-sk-fg/35 hover:bg-sk-fg hover:text-sk-bg`}>
                    <Phone size={17} /> Ligar {c.contact.phone}
                  </a>
                ) : null}
                {c.instagram ? (
                  <a href={c.instagram.href} target="_blank" rel="noopener" className={`${action} border border-sk-fg/35 hover:bg-sk-fg hover:text-sk-bg`}>
                    <Instagram size={17} /> @{c.instagram.handle}
                  </a>
                ) : null}
              </>
            ) : (
              units.map((u) => (
                <a
                  key={u.id}
                  href={unitWhatsappLink(u, unitMessage(u.city)) ?? `tel:${u.phoneE164}`}
                  target="_blank"
                  rel="noopener"
                  className={`${action} border border-sk-fg/35 hover:bg-sk-fg hover:text-sk-bg`}
                >
                  <WhatsApp size={17} /> JR Frutas · {u.city} {u.phone}
                </a>
              ))
            )}
            {c.address ? (
              <div className="mt-3 flex items-start justify-between gap-4 rounded-[var(--radius-card)] border border-sk-line p-5">
                <div className="flex gap-3">
                  <MapPin size={20} className="mt-0.5 shrink-0" />
                  <address className="text-[0.92rem] not-italic leading-relaxed">
                    {c.address.lines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                    {c.address.note ? <span className="mt-1.5 block text-[0.8rem] text-sk-muted">{c.address.note}</span> : null}
                  </address>
                </div>
                {c.address.mapsUrl ? (
                  <a
                    href={c.address.mapsUrl}
                    target="_blank"
                    rel="noopener"
                    aria-label={`Mapa da ${c.name} (Google Maps)`}
                    className="inline-flex shrink-0 items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-[0.1em] underline-offset-4 hover:underline"
                  >
                    Mapa <ExternalArrow size={13} />
                  </a>
                ) : null}
              </div>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================== OUTRAS OPERAÇÕES ============================== */

function Others({ current }: { current: Company }) {
  const others = companies.filter((c) => c.slug !== current.slug);
  return (
    <section aria-labelledby="outras-titulo" className="bg-black text-white">
      <div className="container-site py-14 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="outras-titulo" className="h-section">
            Outras operações da JR Frutas
          </h2>
          <Link href="/" className="group inline-flex items-center gap-2 text-[0.76rem] font-bold uppercase tracking-[0.12em] text-white/75 hover:text-white">
            <ArrowRight size={15} className="rotate-180 transition-transform duration-300 group-hover:-translate-x-1" /> Voltar para a JR Frutas
          </Link>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {others.map((o) => (
            <li key={o.slug} data-skin={o.skin}>
              <Link
                href={companyHref(o)}
                className="group flex h-full flex-col justify-between gap-8 rounded-[var(--radius-card)] border border-sk-line bg-sk-bg p-5 text-sk-fg transition-transform duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 motion-reduce:transition-none sm:min-h-[220px]"
              >
                <CompanyLogo company={o} tone={logoTone(o)} variant="wordmark" height={26} optical />
                <span>
                  <span className="block text-[0.88rem] leading-snug text-sk-muted">{o.summary}</span>
                  <span className="mt-3 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.12em]">
                    {companyCta(o)} <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
