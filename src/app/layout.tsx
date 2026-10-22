import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import localFont from "next/font/local";
import { companies, companyHref } from "@/data/companies";
import { site, units } from "@/data/site";
import { GtmNoScript, GtmScript } from "@/components/analytics/Gtm";
import "./globals.css";

/**
 * Tipografia
 * - DISPLAY (identidade): Marine Rounded, self-hosted em /public/fonts — WOFF2 gerado dos OTF oficiais com
 *   todos os glifos/features e SEM hinting: o hinting CFF fazia o pingo do "i" sumir em
 *   certos tamanhos em telas 1× ("Quals", "dlsponível"); sem ele, todos os tamanhos ficam corretos. Via
 *   next/font/local — só os pesos usados (400 Regular, 700 Bold, 900 Black).
 * - BODY (textos longos): Nunito.
 * As famílias entram no Tailwind como --font-display / --font-body (globals.css).
 */
const marine = localFont({
  src: [
    { path: "../../public/fonts/MarineRounded-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/MarineRounded-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/MarineRounded-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-marine",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  fallback: ["Nunito", "ui-rounded", "system-ui", "sans-serif"],
});

const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  // metadataBase vem de NEXT_PUBLIC_SITE_URL (domínio previsto: jrfrutas.com.br). Sem ele: localhost.
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Atacado de frutas desde ${site.foundingYear}`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: site.name,
    description: site.description,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: "summary_large_image" },
  // Indexação só com o domínio final configurado — evita indexar preview/localhost com canonical errado.
  robots: site.urlConfigured ? { index: true, follow: true } : { index: false, follow: false },
  icons: { icon: [{ url: "/icon.png", type: "image/png" }], apple: "/brand/icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

const abs = (path: string) => (site.urlConfigured ? `${site.url}${path}` : undefined);

/** JSON-LD da JR Frutas: organização, unidades (WholesaleStore) e operações. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: site.shortName,
  legalName: site.legalName,
  foundingDate: String(site.foundingYear),
  description: site.description,
  ...(site.email ? { email: site.email } : {}),
  // URL/logo absolutos só quando o domínio final estiver definido
  ...(site.urlConfigured ? { url: site.url, logo: `${site.url}/brand/logo-jr-frutas-black.png` } : {}),
  sameAs: [site.social.instagram.href],
  areaServed: ["Goiás", "Distrito Federal"],
  department: units.map((u) => ({
    "@type": "WholesaleStore",
    name: `${site.name} — ${u.name}`,
    telephone: u.phoneE164,
    hasMap: u.mapsUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: u.street,
      addressLocality: u.locality,
      addressRegion: u.state,
      ...(u.postalCode ? { postalCode: u.postalCode } : {}),
      addressCountry: "BR",
    },
  })),
  subOrganization: companies.map((c) => ({
    "@type": "Organization",
    name: c.name,
    ...(abs(companyHref(c)) ? { url: abs(companyHref(c)) } : {}),
  })),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${marine.variable} ${nunito.variable}`} data-env={process.env.NODE_ENV}>
      <head>
        {/* Marca que há JS antes do primeiro paint (habilita o reveal sem esconder conteúdo sem JS) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.setAttribute('data-js','')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-dvh">
        <GtmNoScript />
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-black"
        >
          Pular para o conteúdo
        </a>
        {children}
        <GtmScript />
      </body>
    </html>
  );
}
