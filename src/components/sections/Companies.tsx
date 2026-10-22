import { companies } from "@/data/companies";
import { Reveal } from "@/components/ui/Reveal";
import { CompaniesShowcase } from "./CompaniesShowcase";

/** Nossas empresas — introdução (servidor) + vitrine em capítulos (cliente). */
export function Companies() {
  return (
    <section id="empresas" aria-labelledby="empresas-titulo" className="bg-black text-white">
      <div className="container-site pt-14 pb-10 sm:pt-20 lg:pt-28 lg:pb-16">
        <Reveal className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
          <div>
            <p className="eyebrow text-white/55">Nossas empresas</p>
            <h2 id="empresas-titulo" className="h-display mt-3 max-w-[14ch]">
              Uma JR Frutas. Quatro operações.
            </h2>
          </div>
          <p className="max-w-[46ch] text-[1rem] leading-relaxed text-white/68">
            {companies.map((c) => c.shortName).join(", ").replace(/, ([^,]*)$/, " e $1")}: cada operação com o seu foco — e o mesmo
            padrão de qualidade da JR Frutas.
          </p>
        </Reveal>
      </div>
      <CompaniesShowcase />
    </section>
  );
}
