import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Authority } from "@/components/sections/Authority";
import { Products } from "@/components/sections/Products";
import { Operation } from "@/components/sections/Operation";
import { Process } from "@/components/sections/Process";
import { Logistics } from "@/components/sections/Logistics";
import { Companies } from "@/components/sections/Companies";
import { Clients } from "@/components/sections/Clients";
import { About } from "@/components/sections/About";
import { Quote } from "@/components/sections/Quote";
import { Faq } from "@/components/sections/Faq";
import { MobileCta } from "@/components/sections/MobileCta";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} — Atacado de frutas desde ${site.foundingYear} em Goiânia e Brasília`,
  description: site.description,
  path: "/",
  absolute: true,
});

/**
 * Home — ordem definitiva:
 * Hero → Autoridade → Quem confia (prova imediata do "+1.500 clientes") → Produtos
 * → Operação → Processo → Nossas Empresas (uma das experiências mais fortes, sobe)
 * → Estrutura e Unidades → História → Cotação → FAQ.
 * "Campo e Origem" foi removida: induzia a ler a FRUTAFORTE como a origem/produtora
 * da JR; o fluxo Produção → Seleção → Logística → Abastecimento já está no Processo.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Authority />
        <Clients />
        <Products />
        <Operation />
        <Process />
        <Companies />
        <Logistics />
        <About />
        <Quote />
        <Faq />
        <MobileCta />
      </main>
      <Footer />
    </>
  );
}
