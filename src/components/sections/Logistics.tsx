import { quoteWhatsappLink, unitMessage, units, unitWhatsappLink, type Unit } from "@/data/site";
import { ButtonLink } from "@/components/ui/Button";
import { BrazilMap } from "@/components/ui/BrazilMap";
import { ExternalArrow, MapPin, Phone, WhatsApp } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Estrutura / Unidades — geografia honesta: Goiás, Distrito Federal e entorno
 * (o mapa mostra o Brasil só como contexto). Cada unidade com telefone/WhatsApp,
 * endereço completo, Google Maps (links oficiais do legado) e ação de contato.
 */
export function Logistics() {
  return (
    <section id="estrutura" aria-labelledby="estrutura-titulo" className="bg-white text-black">
      <div className="container-site py-14 sm:py-20 lg:py-24">
        {/* Um único mapa no DOM (o SVG é pesado): mobile = texto → mapa → unidades;
            desktop = coluna esquerda (texto + unidades) e mapa ocupando as duas linhas à direita. */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-x-14 lg:gap-y-10">
          <Reveal className="lg:col-start-1 lg:row-start-1 lg:self-end">
            <p className="eyebrow text-black/55">Estrutura e unidades</p>
            <h2 id="estrutura-titulo" className="h-section mt-3 max-w-[18ch]">
              Duas unidades. Goiás, Distrito Federal e entorno.
            </h2>
            <p className="mt-5 max-w-[50ch] text-[1rem] leading-relaxed text-black/65">
              Operamos a partir de Goiânia e de Brasília, com entregas rápidas e programadas para a região. Para outras
              localidades, fale com a equipe e avaliamos a melhor rota.
            </p>
          </Reveal>

          <Reveal delay={80} className="mx-auto w-full max-w-[440px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-[540px] lg:self-center">
            <BrazilMap className="h-auto w-full lg:drop-shadow-[0_30px_40px_rgba(0,0,0,0.22)]" />
          </Reveal>

          <div className="lg:col-start-1 lg:row-start-2">
            <ul className="grid gap-4 md:grid-cols-2">
              {units.map((u, i) => (
                <Reveal as="li" key={u.id} delay={120 + i * 80}>
                  <UnitCard unit={u} />
                </Reveal>
              ))}
            </ul>

            <Reveal delay={240} className="mt-8">
              <ButtonLink href={quoteWhatsappLink()} target="_blank" rel="noopener" variant="black" className="w-full sm:w-auto">
                Solicite uma cotação
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

const action =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[10px] px-3 text-[0.7rem] font-bold uppercase tracking-[0.08em] transition-colors";

function UnitCard({ unit }: { unit: Unit }) {
  const wa = unitWhatsappLink(unit, unitMessage(unit.city));
  return (
    <article className="flex h-full flex-col rounded-[var(--radius-card)] border border-black/12 p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-black text-white">
          <MapPin size={18} />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-[1.1rem] font-black leading-tight">{unit.name}</h3>
          <p className="mt-0.5 text-[0.82rem] text-black/55">{unit.role}</p>
        </div>
      </div>
      <address className="mt-4 text-[0.9rem] not-italic leading-relaxed text-black/75">
        {unit.addressLines.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </address>
      <p className="mt-3 font-display text-[1.05rem] font-extrabold">{unit.phone}</p>
      <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
        {wa ? (
          <a href={wa} target="_blank" rel="noopener" aria-label={`WhatsApp da ${unit.name}`} className={`${action} col-span-2 bg-black text-white hover:bg-neutral-800`}>
            <WhatsApp size={15} /> WhatsApp
          </a>
        ) : null}
        <a href={`tel:${unit.phoneE164}`} aria-label={`Ligar para a ${unit.name}: ${unit.phone}`} className={`${action} border border-black/20 hover:border-black hover:bg-black hover:text-white`}>
          <Phone size={15} /> Ligar
        </a>
        <a
          href={unit.mapsUrl}
          target="_blank"
          rel="noopener"
          aria-label={`Mapa da ${unit.name} (Google Maps)`}
          className={`${action} border border-black/20 hover:border-black hover:bg-black hover:text-white`}
        >
          Mapa <ExternalArrow size={13} />
        </a>
      </div>
    </article>
  );
}
