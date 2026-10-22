import { Boxes, ClipboardCheck, Tractor, Truck, type LucideIcon } from "lucide-react";
import { processSteps, type ProcessStep } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";

/** Ícones das etapas: família única (Lucide), lineares, monocromáticos */
const stepIcons: Record<ProcessStep["icon"], LucideIcon> = {
  field: Tractor,
  select: ClipboardCheck,
  truck: Truck,
  box: Boxes,
};

/**
 * Processo — editorial: numeral grande, régua contínua, texto completo visível
 * (sem accordion). Desktop 4 colunas · tablet 2×2 · mobile lista com numeral à esquerda.
 */
export function Process() {
  return (
    <section id="processo" aria-labelledby="processo-titulo" className="bg-black text-white">
      <div className="container-site py-14 sm:py-20 lg:py-24">
        <Reveal className="max-w-[640px]">
          <p className="eyebrow text-white/55">Processo</p>
          <h2 id="processo-titulo" className="h-section mt-3">
            Do campo ao seu negócio, em quatro etapas.
          </h2>
        </Reveal>

        <ol className="mt-10 grid gap-x-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-x-0">
          {processSteps.map((s, i) => {
            const StepIcon = stepIcons[s.icon];
            return (
              <Reveal
                as="li"
                key={s.number}
                delay={i * 90}
                className="grid grid-cols-[64px_minmax(0,1fr)] gap-x-4 border-t border-white/15 py-7 sm:block sm:py-8 lg:border-t-0 lg:py-0 lg:pr-8 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-white/12 lg:[&:not(:first-child)]:pl-8"
              >
                <span aria-hidden className="h-mega text-[3.4rem] text-white/90 sm:text-[4.2rem] lg:text-[5rem]">
                  {s.number}
                </span>
                <div className="sm:mt-6">
                  <div className="flex items-center gap-3">
                    <StepIcon size={22} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="shrink-0 text-white/70" />
                    <h3 className="font-display text-[1.3rem] font-black tracking-[-0.02em]">{s.title}</h3>
                  </div>
                  <p className="mt-3 text-[0.98rem] font-semibold leading-snug text-white/90">{s.description}</p>
                  <p className="mt-2.5 text-[0.9rem] leading-relaxed text-white/60">{s.detail}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
