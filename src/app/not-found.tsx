import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "A página que você procurou não existe ou mudou de endereço.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="conteudo" className="bg-white text-black">
        <div className="container-site max-w-[820px] py-20 sm:py-28">
          <p className="eyebrow text-black/60">Erro 404</p>
          <h1 className="h-section mt-3">Página não encontrada</h1>
          <p className="mt-5 max-w-[50ch] text-[1rem] leading-relaxed text-black/68">
            O endereço que você procurou não existe ou mudou de lugar.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" variant="black" className="w-full sm:w-auto">
              Ir para a página inicial
            </ButtonLink>
            <ButtonLink href="/#cotacao" variant="outline-black" className="w-full sm:w-auto">
              Fale com a gente
            </ButtonLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
