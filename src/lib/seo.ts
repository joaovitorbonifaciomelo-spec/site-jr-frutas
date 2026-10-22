import type { Metadata } from "next";
import { site } from "@/data/site";

type PageSeo = {
  /** título da aba/SERP (sem o sufixo da marca quando `absolute`) */
  title: string;
  description: string;
  /** caminho canônico relativo (ex.: "/empresas/jr-coco") — resolvido por metadataBase */
  path: string;
  /** imagem OG 1200×630 em /public */
  image?: string;
  absolute?: boolean;
  noindex?: boolean;
};

/**
 * Metadata completa por rota: title, description, canonical, Open Graph e Twitter.
 * (No App Router o `openGraph` de uma página SUBSTITUI o do layout — por isso
 * cada rota monta o objeto inteiro aqui, sem depender de merge.)
 */
export function pageMetadata({ title, description, path, image = "/og-image.jpg", absolute = false, noindex = false }: PageSeo): Metadata {
  const ogTitle = absolute ? title : `${title} · ${site.shortName}`;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      title: ogTitle,
      description,
      url: path,
      images: [{ url: image, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: [image] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
