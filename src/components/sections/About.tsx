import Image from "next/image";
import fachada from "@/assets/images/arquivo-fachada.webp";
import { aboutPillars, history, site } from "@/data/site";
import { ButtonLink } from "@/components/ui/Button";
import { Check } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";

/**
 * História / Quem somos — 1994 → hoje, apenas marcos confirmados
 * (2009/Melancia e Cia e Uruana-GO ficam em HISTORY_TO_VALIDATE, fora do ar).
 * Foto de arquivo: fachada da JR Frutas Atacadista recuperada do site legado.
 */
export function About() {
  return (
    <section id="quem-somos" aria-labelledby="quem-somos-titulo" className="bg-white text-black">
      {/* filete no topo: separa da seção Estrutura (também branca) que vem logo acima */}
      <div className="container-site border-t border-black/10 py-14 sm:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Reveal>
              <p className="eyebrow text-black/55">Quem somos</p>
              <h2 id="quem-somos-titulo" className="h-section mt-3 max-w-[18ch]">
                Desde {site.foundingYear}, a ponte entre o campo e o seu negócio.
              </h2>
              <p className="mt-5 max-w-[50ch] text-[1rem] leading-relaxed text-black/68">
                A JR Frutas atua no atacado de frutas há mais de 30 anos. Frutas selecionadas, estrutura própria e atendimento
                direto por unidade — com confiança, transparência e compromisso em cada entrega.
              </p>
            </Reveal>

            <Reveal as="ul" delay={100} className="mt-8 grid gap-x-6 sm:grid-cols-2">
              {aboutPillars.map((p) => (
                <li key={p.title} className="flex gap-3 border-t border-black/10 py-4">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-black text-white">
                    <Check size={13} />
                  </span>
                  <p className="text-[0.9rem] leading-snug">
                    <span className="block font-display font-extrabold">{p.title}</span>
                    <span className="text-black/60">{p.text}</span>
                  </p>
                </li>
              ))}
            </Reveal>

            <Reveal delay={160} className="mt-8">
              <ButtonLink href="/#empresas" variant="outline-black" className="w-full sm:w-auto">
                Conheça nossas operações
              </ButtonLink>
            </Reveal>
          </div>

          <div className="flex flex-col gap-10">
            {/* Linha do tempo */}
            <Reveal as="ol" delay={80} className="relative">
              <span aria-hidden className="absolute top-3 bottom-3 left-[7px] w-px bg-black/15" />
              {history.map((h, i) => (
                <li key={h.year} className={`relative pl-10 ${i > 0 ? "mt-10" : ""}`}>
                  <span aria-hidden className="absolute top-3 left-0 grid size-[15px] place-items-center rounded-full border-2 border-black bg-white">
                    <span className="size-[5px] rounded-full bg-black" />
                  </span>
                  <p className="h-mega text-[4.2rem] sm:text-[5rem]">{h.year}</p>
                  <h3 className="mt-3 font-display text-[1.15rem] font-black">{h.title}</h3>
                  <p className="mt-1.5 max-w-[44ch] text-[0.95rem] leading-relaxed text-black/65">{h.text}</p>
                  {i === 0 ? (
                    <p className="caption mt-6 inline-flex rounded-full border border-black/15 px-3 py-1.5 text-black/60">
                      Mais de 30 anos de mercado
                    </p>
                  ) : null}
                </li>
              ))}
            </Reveal>

            {/* Arquivo */}
            <Reveal as="figure" delay={140} className="max-w-[460px]">
              <div className="relative aspect-[617/361] overflow-hidden rounded-[var(--radius-card)] bg-neutral-200">
                <Image
                  src={fachada}
                  alt="Fachada da JR Frutas Atacadista com caminhões estacionados à frente"
                  fill
                  sizes="460px"
                  placeholder="blur"
                  className="object-cover"
                />
              </div>
              <figcaption className="caption mt-3 text-black/60">Arquivo · fachada da JR Frutas Atacadista</figcaption>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
