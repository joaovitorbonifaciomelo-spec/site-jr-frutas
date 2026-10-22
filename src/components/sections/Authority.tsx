import { authority } from "@/data/site";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Autoridade — tipográfica, não "4 cards": o ano de fundação vira a peça
 * principal e os outros três fatos entram como linhas de uma ficha.
 */
export function Authority() {
  const { since, items } = authority;
  return (
    <section id="autoridade" aria-labelledby="autoridade-titulo" className="bg-white text-black">
      <div className="container-site py-14 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <Reveal>
            <h2 id="autoridade-titulo" className="eyebrow text-black/55">
              {since.label}
            </h2>
            <p className="h-mega mt-3 text-[clamp(6.5rem,26vw,13.5rem)] lg:text-[clamp(9rem,15vw,15rem)]">
              {since.value}
            </p>
            <p className="mt-5 font-display text-[1.3rem] font-extrabold leading-tight tracking-[-0.01em] sm:text-[1.6rem]">
              {since.detail}.
            </p>
            <p className="mt-3 max-w-[46ch] text-[0.98rem] leading-relaxed text-black/62">
              Três décadas no atacado de frutas, abastecendo mercados, feirantes e restaurantes com regularidade.
            </p>
          </Reveal>

          <Reveal as="ul" delay={100} className="border-t border-black/12">
            {items.map((it) => (
              <li key={it.label} className="flex items-center gap-5 border-b border-black/12 py-5 sm:py-6">
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-black/15">
                  <Icon name={it.icon} size={22} />
                </span>
                <p className="min-w-0">
                  <span className="block font-display text-[1.7rem] font-black leading-none tracking-[-0.03em] sm:text-[2.1rem]">{it.value}</span>
                  <span className="mt-1.5 block text-[0.74rem] font-bold uppercase leading-snug tracking-[0.12em] text-black/60">{it.label}</span>
                </p>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
