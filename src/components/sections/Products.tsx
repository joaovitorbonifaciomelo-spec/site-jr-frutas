import Image, { type StaticImageData } from "next/image";
import abacaxi from "@/assets/images/abacaxi-corte.webp";
import melancia from "@/assets/images/melancia-fatia.webp";
import cocoSeco from "@/assets/images/coco-seco.webp";
import cocoVerde from "@/assets/images/coco-verde.webp";
import melao from "@/assets/images/melao-corte.webp";
import { products, unitWhatsappLink, units, type Product } from "@/data/site";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const images: Record<Product["image"], StaticImageData> = { abacaxi, melancia, cocoSeco, cocoVerde, melao };

/* Não existe página de produto: o CTA pede a lista completa pelo WhatsApp (Unidade Goiânia). */
const listHref =
  unitWhatsappLink(units[0], "Olá! Vim pelo site da JR Frutas e gostaria de receber a lista completa de produtos e a cotação do dia.") ??
  "/#cotacao";

/**
 * Produtos — a fruta é a protagonista: foto em altura total, nome sobre a imagem.
 * Mobile/tablet: carrossel com snap (1,3 cards no celular, ~2,3 no tablet).
 * Desktop: 3+2 (1024) → 5 colunas (≥1280).
 */
export function Products() {
  return (
    <section id="produtos" aria-labelledby="produtos-titulo" className="bg-black text-white">
      <div className="container-site py-14 sm:py-20 lg:py-24">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-white/55">Produtos</p>
            <h2 id="produtos-titulo" className="h-section mt-3 max-w-[16ch]">
              Frutas selecionadas para o seu negócio.
            </h2>
          </div>
          <ButtonLink href={listHref} variant="outline-white" target="_blank" rel="noopener" className="self-start sm:self-auto">
            Solicitar lista de produtos
          </ButtonLink>
        </Reveal>

        <ul
          aria-label="Produtos (role para o lado)"
          tabIndex={0}
          className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:gap-4 sm:px-6 sm:mt-12 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-5 lg:overflow-visible lg:px-0 xl:grid-cols-5 xl:gap-4"
        >
          {products.map((p, i) => (
            <Reveal
              as="li"
              key={p.slug}
              delay={i * 70}
              className={`w-[76vw] max-w-[340px] shrink-0 snap-start sm:w-[42vw] lg:w-auto lg:max-w-none lg:col-span-2 xl:col-span-1 ${i === 3 ? "lg:col-start-2 xl:col-start-auto" : ""}`}
            >
              <article className="group relative aspect-[3/4.4] overflow-hidden rounded-[var(--radius-card)] bg-neutral-900">
                <Image
                  src={images[p.image]}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 1280px) 230px, (min-width: 1024px) 300px, (min-width: 640px) 42vw, 76vw"
                  placeholder="blur"
                  className="object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.06] motion-reduce:transition-none"
                />
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_45%,rgba(0,0,0,0.55)_68%,rgba(0,0,0,0.92)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5 xl:p-4 2xl:p-5">
                  <p aria-hidden className="font-display text-[0.7rem] font-extrabold tracking-[0.14em] text-white/60">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 font-display text-[1.65rem] font-black leading-none tracking-[-0.03em] xl:text-[1.45rem] 2xl:text-[1.65rem]">
                    {p.name}
                  </h3>
                  <p className="mt-2.5 text-[0.86rem] leading-snug text-white/78 xl:text-[0.82rem]">{p.short}</p>
                </div>
                <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[var(--radius-card)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
