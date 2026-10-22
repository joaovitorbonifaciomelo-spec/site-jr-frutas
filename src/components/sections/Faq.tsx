import { faq } from "@/data/site";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";

export function Faq() {
  const half = Math.ceil(faq.length / 2);
  const cols = [faq.slice(0, half), faq.slice(half)];

  return (
    <section id="faq" aria-labelledby="faq-titulo" className="bg-white text-black">
      <div className="container-site py-14 sm:py-16 lg:py-20">
        <Reveal>
          <p className="eyebrow text-black/55 sm:text-center">FAQ</p>
          <h2 id="faq-titulo" className="h-section mt-3 text-[1.5rem] sm:text-center sm:text-[1.7rem]">
            Dúvidas frequentes
          </h2>
        </Reveal>

        {/* Mobile/tablet: uma coluna · Desktop: duas colunas */}
        <Reveal delay={80} className="mt-8 lg:hidden">
          <Accordion tone="light" items={faq.map((f) => ({ title: f.q, content: f.a }))} />
        </Reveal>
        <Reveal delay={80} className="mt-10 hidden grid-cols-2 items-start gap-4 lg:grid">
          {cols.map((col, i) => (
            <Accordion key={i} tone="light" items={col.map((f) => ({ title: f.q, content: f.a }))} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
