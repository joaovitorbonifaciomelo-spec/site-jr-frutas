import Image, { type StaticImageData } from "next/image";
import melancias from "@/assets/images/hero-melancia.webp";
import galpao from "@/assets/images/galpao-abacaxi.webp";
import carregamento from "@/assets/images/carregamento.webp";
import cocoEstoque from "@/assets/images/coco-verde-estoque.webp";
import selecao from "@/assets/images/selecao-abacaxi.webp";
import { operationFacts } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";

type Shot = { src: StaticImageData; alt: string; caption: string; area: string; pos?: string };

/** Fotos reais da operação JR — legenda = o que a foto prova. */
const shots: Shot[] = [
  { src: melancias, alt: "Melancias empilhadas em grande volume no galpão", caption: "Volume no galpão", area: "lg:col-start-1 lg:row-span-2", pos: "50% 50%" },
  { src: galpao, alt: "Abacaxis organizados em grande quantidade na unidade", caption: "Abacaxi em estoque", area: "lg:col-span-2", pos: "50% 55%" },
  { src: carregamento, alt: "Equipe acomodando abacaxis na carroceria do caminhão", caption: "Carregamento cuidadoso", area: "lg:col-start-4 lg:row-span-2 lg:row-start-1", pos: "50% 60%" },
  { src: cocoEstoque, alt: "Coco verde segurado à mão diante do estoque de cocos", caption: "Coco verde selecionado", area: "", pos: "50% 40%" },
  { src: selecao, alt: "Abacaxis selecionados e separados em engradado", caption: "Seleção do abacaxi", area: "", pos: "50% 45%" },
];

/**
 * Operação — prova real, sem cards abstratos de "qualidade/confiança".
 * Desktop: mosaico 4×2 em largura total. Tablet: 2 colunas. Mobile: carrossel de fotos legendadas.
 */
export function Operation() {
  return (
    <section id="operacao" aria-labelledby="operacao-titulo" className="bg-white text-black">
      <div className="container-site py-14 sm:py-20 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <Reveal>
            <p className="eyebrow text-black/55">Operação</p>
            <h2 id="operacao-titulo" className="h-section mt-3 max-w-[17ch]">
              Estrutura que se vê, todos os dias.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="max-w-[48ch] text-[1rem] leading-relaxed text-black/65">
              Galpão, estoque, seleção e frota funcionando de verdade. O que você vê aqui é a rotina das nossas unidades — não
              imagem de banco.
            </p>
          </Reveal>
        </div>

        {/* Mosaico */}
        <ul aria-label="Fotos da operação" tabIndex={0} className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:mt-14 lg:grid-cols-4 lg:grid-rows-[repeat(2,minmax(0,250px))] xl:grid-rows-[repeat(2,minmax(0,280px))]">
          {shots.map((s, i) => (
            <Reveal
              as="li"
              key={s.caption}
              delay={i * 70}
              className={`relative aspect-[4/5] w-[78vw] max-w-[360px] shrink-0 snap-start overflow-hidden rounded-[var(--radius-card)] bg-neutral-200 sm:w-auto sm:max-w-none ${
                i === 0 ? "sm:row-span-2 sm:aspect-auto" : "sm:aspect-[4/3]"
              } lg:aspect-auto ${s.area}`}
            >
              <figure className="group h-full">
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 78vw"
                  placeholder="blur"
                  className="object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04] motion-reduce:transition-none"
                  style={{ objectPosition: s.pos }}
                />
                <figcaption className="caption absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1.5 text-white backdrop-blur-sm">
                  {s.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>

        {/* Ficha da operação */}
        <Reveal as="ul" delay={100} className="mt-10 grid grid-cols-2 border-t border-black/12 lg:mt-14 lg:grid-cols-4">
          {operationFacts.map((f, i) => (
            <li
              key={f.value}
              className={`border-b border-black/12 py-5 pr-4 lg:border-b-0 lg:py-7 ${i % 2 === 1 ? "border-l pl-4" : ""} ${i > 0 ? "lg:border-l lg:pl-6" : ""}`}
            >
              <p className="font-display text-[1.3rem] font-black leading-none tracking-[-0.02em] sm:text-[1.5rem]">{f.value}</p>
              <p className="mt-2 text-[0.86rem] leading-snug text-black/60">{f.label}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
