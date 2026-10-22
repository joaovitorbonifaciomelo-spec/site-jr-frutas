import { quoteWhatsappLink, site } from "@/data/site";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { HeroVideo } from "./HeroVideo";

/**
 * Hero em tela cheia — vídeo real da operação (único vídeo do hero do site).
 * Altura = viewport − header (svh: estável com a barra do navegador mobile).
 */
export function Hero() {
  return (
    <section id="inicio" className="relative isolate bg-black text-white">
      <HeroVideo className="absolute inset-0 -z-10" />

      <div className="container-site relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-end pt-16 pb-12 sm:justify-center sm:pb-20 lg:min-h-[calc(100svh-var(--header-h)-36px)] lg:py-24">
        <div className="max-w-[680px]">
          <Reveal>
            <p className="eyebrow text-white/80 [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
              {site.name} · Desde {site.foundingYear}
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="h-display mt-4 [text-shadow:0_2px_24px_rgba(0,0,0,0.6)]">{site.tagline}</h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 max-w-[44ch] text-[1.02rem] leading-relaxed text-white/85 sm:text-[1.1rem] [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
              Frutas selecionadas com rigor, logística inteligente e atendimento dedicado para o seu negócio crescer.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {/* cotação → WhatsApp da Unidade Goiânia */}
              <ButtonLink href={quoteWhatsappLink()} target="_blank" rel="noopener" size="lg" className="w-full sm:w-auto lg:px-5">
                Solicite uma cotação
              </ButtonLink>
              <ButtonLink href="/#produtos" variant="outline-white" size="lg" className="w-full sm:w-auto lg:px-5">
                Conheça nossos produtos
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        {/* indicação de rolagem — só desktop/tablet, sem animação */}
        <a
          href="/#autoridade"
          aria-label="Rolar para a próxima seção"
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-white sm:flex"
        >
          Role
          <span aria-hidden className="h-10 w-px bg-gradient-to-b from-white/70 to-white/0" />
        </a>
      </div>
    </section>
  );
}
