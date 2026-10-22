import Link from "next/link";
import { companies, companyHref } from "@/data/companies";
import { contacts, nav, products, quoteWhatsappLink, site, unitMessage, units, unitWhatsappLink } from "@/data/site";
import { ButtonLink } from "@/components/ui/Button";
import { DeveloperCredit } from "@/components/ui/DeveloperCredit";
import { Logo } from "@/components/ui/Logo";
import { Instagram, Mail, MapPin, WhatsApp } from "@/components/ui/Icons";

const year = new Date().getFullYear();

/**
 * Footer único da JR Frutas (todas as rotas).
 * Desktop: faixa superior [marca | contato + cotação] e 4 colunas
 * (Navegação · Produtos · Empresas · Unidades). Tablet: 2×2.
 * Mobile: padrão aprovado — um eixo central, subseções com divisores (.footer-section).
 */
export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container-site py-12 md:py-16 lg:py-20">
        {/* ---------- MARCA + CONTATO ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 md:border-b md:border-white/10 md:pb-12 lg:grid-cols-12">
          <div className="footer-section md:flex md:flex-col md:items-start lg:col-span-5">
            <Logo variant="stacked" height={96} href={null} />
            <p className="eyebrow mt-6 text-white/85">{site.signature}</p>
            <p className="mt-3 max-w-[34ch] text-[0.88rem] leading-relaxed text-white/60">
              Atacado de frutas desde {site.foundingYear}, em Goiânia e Brasília.
            </p>
          </div>

          <div className="footer-section md:flex md:flex-col md:items-start lg:col-span-7 lg:items-end lg:text-right">
            <h2 className="eyebrow mb-5 text-white">Contato</h2>
            <ul className="flex flex-col items-center gap-3 text-[0.92rem] text-white/75 md:items-start lg:items-end">
              {contacts.email ? (
                <li>
                  <a href={contacts.email.href} className="inline-flex items-center gap-2 font-bold text-white transition-colors hover:text-white/75">
                    <Mail size={16} /> {contacts.email.address}
                  </a>
                </li>
              ) : null}
              <li>
                <a href={contacts.instagram.href} target="_blank" rel="noopener" className="inline-flex items-center gap-2 transition-colors hover:text-white">
                  <Instagram size={16} /> @{contacts.instagram.handle}
                </a>
              </li>
            </ul>
            <ButtonLink href={quoteWhatsappLink()} target="_blank" rel="noopener" className="mt-6 w-full sm:w-auto">
              Solicite uma cotação
            </ButtonLink>
          </div>
        </div>

        {/* ---------- COLUNAS ---------- */}
        <div className="grid grid-cols-1 md:mt-12 md:grid-cols-2 md:gap-10 lg:grid-cols-12">
          {/* mobile: divisor e respiro iguais aos das demais subseções (é a 1ª do novo grid) */}
          <FooterColumn title="Navegação" className="max-md:border-t max-md:border-white/10 max-md:!pt-12 lg:col-span-2">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="transition-colors hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Produtos" className="lg:col-span-2">
            {products.map((p) => (
              <li key={p.slug}>
                <Link href="/#produtos" className="transition-colors hover:text-white">
                  {p.name}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Empresas" className="lg:col-span-3">
            {companies.map((c) => (
              <li key={c.slug}>
                <Link href={companyHref(c)} className="transition-colors hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <div className="footer-section md:flex md:flex-col md:items-start lg:col-span-5">
            <h2 className="eyebrow mb-5 text-white">Unidades</h2>
            <ul className="grid gap-6 text-[0.9rem] text-white/70 sm:grid-cols-2 sm:gap-8 md:grid-cols-1 lg:grid-cols-2">
              {units.map((u) => (
                <li key={u.id} className="flex flex-col items-center md:items-start">
                  <p className="font-display font-bold text-white">{u.name}</p>
                  <a
                    href={unitWhatsappLink(u, unitMessage(u.city)) ?? `tel:${u.phoneE164}`}
                    target="_blank"
                    rel="noopener"
                    aria-label={`WhatsApp ${u.name}: ${u.phone}`}
                    className="mt-1 inline-flex items-center gap-2 font-bold text-white transition-colors hover:text-white/80"
                  >
                    <WhatsApp size={14} /> {u.phone}
                  </a>
                  <p className="mt-1.5 max-w-[28ch] leading-relaxed md:max-w-none">
                    {u.addressLines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </p>
                  <a
                    href={u.mapsUrl}
                    target="_blank"
                    rel="noopener"
                    className="mt-2 inline-flex items-center gap-1.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white/80 underline-offset-4 hover:underline"
                  >
                    <MapPin size={14} /> Ver no mapa
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- FAIXA FINAL ---------- */}
        <div className="footer-section footer-section--last !flex !flex-col items-center gap-4 border-t border-white/10 !pt-6 text-center text-[0.75rem] text-white/65 md:mt-14 md:!flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-8 md:gap-y-3 md:text-left">
          {/* cada item é inquebrável: no mobile a linha quebra entre os itens, nunca dentro de "Política de Privacidade" */}
          <p>
            <span className="whitespace-nowrap">
              © {year} {site.shortName}
              <span className="mx-2 text-white/25">·</span>
            </span>{" "}
            <span className="whitespace-nowrap">
              {site.legalName}
              <span className="mx-2 text-white/25">·</span>
            </span>{" "}
            <Link href="/politica-de-privacidade" className="whitespace-nowrap transition-colors hover:text-white">
              Política de Privacidade
            </Link>
          </p>
          <DeveloperCredit />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, className = "", children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`footer-section md:flex md:flex-col md:items-start ${className}`}>
      <h2 className="eyebrow mb-5 text-white">{title}</h2>
      <ul className="space-y-2.5 text-[0.9rem] text-white/70">{children}</ul>
    </div>
  );
}
