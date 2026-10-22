import type { Metadata } from "next";
import { site } from "@/data/site";
import { LinksHub } from "@/components/links/LinksHub";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `${site.shortName} — WhatsApp, produtos e unidades`,
  description: "Atacado de abacaxi, melancia, coco e melão desde 1994, em Goiânia e Brasília. Fale com a JR Frutas.",
  path: "/links",
  image: "/og-links.jpg",
  absolute: true,
});

/**
 * /links — hub de direcionamento para a bio do Instagram.
 * HUB = direciona · SITE = explica · WHATSAPP = atende.
 * Fullscreen, vídeo real da operação ao fundo, interface translúcida por cima.
 * Não usa Header/Footer nem seções do site principal.
 */
export default function LinksPage() {
  return (
    <main id="conteudo" className="relative isolate min-h-[100dvh] bg-black text-white">
      <LinksHub />
    </main>
  );
}
