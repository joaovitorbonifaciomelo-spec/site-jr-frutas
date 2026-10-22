import Image from "next/image";
import { clients } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "Quem confia, recomenda." — marquee contínuo com os logos reais dos clientes.
 * O track tem duas metades idênticas (a segunda é aria-hidden); a animação
 * desloca -50% e reinicia sem pulo. Cada metade repete a lista 2× para cobrir
 * viewports largos. Pausa em hover/focus e vira faixa estática com
 * prefers-reduced-motion (ver .logo-marquee em globals.css).
 */
export function Clients() {
  return (
    <section id="clientes" className="bg-black text-white">
      <div className="container-site py-12 sm:py-14 lg:py-16">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <p className="eyebrow text-white/55">Clientes e parceiros</p>
          <h2 className="h-section text-[1.5rem] sm:text-[1.7rem]">Quem confia, recomenda.</h2>
        </Reveal>
      </div>

      <Reveal delay={80} className="pb-12 sm:pb-14 lg:pb-16">
        <div className="logo-marquee" role="region" aria-label="Clientes e parceiros">
          <div className="logo-marquee-track">
            <LogoRow />
            <LogoRow clone />
          </div>
        </div>
      </Reveal>
      {/* filete: separa da seção Produtos (também preta) que vem logo abaixo */}
      <div className="container-site">
        <div aria-hidden className="h-px bg-white/10" />
      </div>
    </section>
  );
}

function LogoRow({ clone = false }: { clone?: boolean }) {
  // 2× a lista por metade → a metade sempre é mais larga que a viewport
  const items = [...clients, ...clients];
  return (
    <ul
      aria-hidden={clone || undefined}
      data-marquee-clone={clone ? "" : undefined}
      className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16 lg:gap-20 lg:pr-20"
    >
      {items.map((c, i) => (
        <li
          key={`${c.name}-${i}`}
          data-marquee-dup={i >= clients.length ? "" : undefined}
          className="flex shrink-0 items-center justify-center"
        >
          <div className="flex h-12 w-[132px] items-center justify-center sm:h-14 sm:w-[150px] lg:h-16 lg:w-[160px]">
            <Image
              src={c.src}
              alt={clone ? "" : c.name}
              title={clone ? undefined : c.name}
              width={c.width}
              height={c.height}
              sizes="160px"
              className="max-h-full w-auto max-w-full object-contain opacity-70 transition-opacity duration-300 hover:opacity-100"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
