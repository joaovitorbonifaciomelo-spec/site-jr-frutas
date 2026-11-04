import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site, units } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Termos de Uso",
  description: `Condições de uso do site da ${site.name}: finalidade, informações publicadas, marcas e imagens, links externos, WhatsApp, privacidade e contato.`,
  path: "/termos-de-uso",
});

/** Data da última revisão (fixa — não muda sozinha a cada build). */
const UPDATED = "3 de novembro de 2026";

/**
 * Termos escritos a partir do funcionamento REAL do site: institucional e comercial, sem
 * cadastro, área do cliente, venda ou pagamento online. Se isso mudar, atualizar ESTA página.
 */
export default function TermsPage() {
  const email = site.email;
  return (
    <>
      <Header />
      <main id="conteudo" className="bg-white text-black">
        <article className="container-site max-w-[820px] py-14 sm:py-20">
          <p className="eyebrow text-black/60">Legal</p>
          <h1 className="h-section mt-3">Termos de Uso</h1>
          <p className="mt-3 text-[0.85rem] text-black/60">Última atualização: {UPDATED}</p>

          <div className="mt-8 space-y-10 text-[0.98rem] leading-relaxed text-black/75">
            <p>
              Estes termos valem para o uso do site da {site.name} ({site.legalName}), inclusive as páginas das operações JR
              COCO, Bela Fruta Atacadista, FRUTAFORTE e Abacaxi.com. Ao navegar pelo site, você concorda com as condições abaixo.
            </p>

            <Block title="Finalidade do site">
              <p>
                O site é institucional e comercial. Ele apresenta a empresa, as operações, os produtos, a estrutura e os canais de
                atendimento, e permite iniciar um pedido de cotação pelo WhatsApp. Negociações e vendas não são concluídas no site:
                elas acontecem diretamente com a nossa equipe.
              </p>
            </Block>

            <Block title="Informações publicadas">
              <p>
                As informações têm caráter informativo e podem ser usadas para conhecer a empresa e entrar em contato. Disponibilidade
                de produtos, calibres, quantidades, prazos, entregas e condições comerciais variam e são confirmados no atendimento.
              </p>
              <p>Não é permitido usar o conteúdo do site de forma enganosa, nem para se passar pela empresa ou por suas operações.</p>
            </Block>

            <Block title="Propriedade intelectual">
              <p>
                Os textos, o layout, as fotos, os vídeos e demais conteúdos do site são protegidos pela legislação de direitos autorais
                e pertencem à {site.shortName} ou são usados com autorização. Eles não podem ser copiados, alterados ou reutilizados para
                fins comerciais sem autorização prévia por escrito.
              </p>
            </Block>

            <Block title="Marcas, logos, fotos e vídeos">
              <p>
                Os nomes e logos JR Frutas, JR COCO, Bela Fruta, FRUTAFORTE e Abacaxi.com identificam a empresa e suas operações e não
                podem ser usados sem autorização. Marcas de terceiros que aparecem no site pertencem aos respectivos titulares.
              </p>
            </Block>

            <Block title="Links externos">
              <p>
                O site contém links para serviços de terceiros, como Google Maps e Instagram. Ao clicar, você sai do site. Esses serviços
                têm termos e políticas próprios, e não respondemos pelo conteúdo ou funcionamento deles.
              </p>
            </Block>

            <Block title="WhatsApp e outros canais de terceiros">
              <p>
                O formulário de cotação monta uma mensagem no seu navegador e abre o WhatsApp, onde você decide se envia ou não. O
                WhatsApp é um serviço de terceiros, sujeito às regras dele, e o mesmo vale para o seu aplicativo de telefone ou de e-mail
                ao usar os contatos publicados.
              </p>
            </Block>

            <Block title="Disponibilidade e atualização">
              <p>
                Buscamos manter o site disponível e as informações corretas, mas o site pode passar por manutenção, ficar
                temporariamente fora do ar ou ser alterado a qualquer momento, sem aviso prévio. Estes termos também podem ser atualizados;
                a data no início da página indica a versão em vigor.
              </p>
            </Block>

            <Block title="Limitação de responsabilidade">
              <p>
                Dentro do permitido pela lei, não respondemos por danos decorrentes de indisponibilidade do site, de falhas de conexão ou
                do seu dispositivo, nem de serviços de terceiros. Se encontrar alguma informação incorreta, confirme com a nossa equipe e
                nos avise pelo canal de contato. Nada nestes termos limita direitos que a legislação brasileira garante e que não
                possam ser afastados.
              </p>
            </Block>

            <Block title="Privacidade">
              <p>
                O tratamento de informações pessoais está descrito na{" "}
                <Link href="/politica-de-privacidade" className="font-bold text-black underline underline-offset-4">
                  Política de Privacidade
                </Link>
                .
              </p>
            </Block>

            <Block title="Legislação aplicável">
              <p>Estes termos são regidos pelas leis da República Federativa do Brasil.</p>
            </Block>

            <Block title="Contato">
              <p>
                {site.legalName} ({site.name})
                {email ? (
                  <>
                    {" "}
                    · <a href={`mailto:${email}`} className="font-bold text-black underline underline-offset-4">{email}</a>
                  </>
                ) : null}
              </p>
              <ul className="space-y-1">
                {units.map((u) => (
                  <li key={u.id}>
                    {u.name}: {u.phone} · {u.address}
                  </li>
                ))}
              </ul>
            </Block>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-[1.25rem] font-black tracking-[-0.01em] text-black">{title}</h2>
      {children}
    </section>
  );
}
