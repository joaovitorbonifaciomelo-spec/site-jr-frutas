import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site, units } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Política de Privacidade",
  description: `Como o site da ${site.name} trata informações pessoais: formulário que abre o WhatsApp, contatos diretos, registros técnicos e direitos previstos na LGPD.`,
  path: "/politica-de-privacidade",
  noindex: true,
});

/** Data da última revisão (fixa — não muda sozinha a cada build). */
const UPDATED = "15 de outubro de 2026";

/**
 * Política escrita a partir do funcionamento REAL do site (sem banco de leads,
 * sem analytics/publicidade ativos, sem cookies próprios). Se alguma tecnologia
 * nova for ativada (ex.: GTM e as tags que ele carregar), atualizar ESTA página
 * antes/junto da ativação, descrevendo o que efetivamente passou a ser usado.
 */
export default function PrivacyPage() {
  const email = site.email;
  return (
    <>
      <Header />
      <main id="conteudo" className="bg-white text-black">
        <article className="container-site max-w-[820px] py-14 sm:py-20">
          <p className="eyebrow text-black/60">Legal</p>
          <h1 className="h-section mt-3">Política de Privacidade</h1>
          <p className="mt-3 text-[0.85rem] text-black/60">Última atualização: {UPDATED}</p>

          <div className="mt-8 space-y-10 text-[0.98rem] leading-relaxed text-black/75">
            <p>
              Esta política explica como o site da {site.name} ({site.legalName}) trata informações pessoais. Ela vale para
              todas as páginas deste domínio, inclusive as das operações JR COCO, Bela Fruta Atacadista, FRUTAFORTE e
              Abacaxi.com, e descreve o funcionamento atual do site.
            </p>

            <Block title="Resumo">
              <ul className="list-disc space-y-2 pl-5">
                <li>O site não tem cadastro, login, newsletter nem banco de dados de contatos.</li>
                <li>
                  O formulário de cotação não envia dados para um servidor: ele apenas monta uma mensagem e abre o WhatsApp. Os
                  dados só chegam até nós se você confirmar o envio no WhatsApp.
                </li>
                <li>O site não utiliza ferramentas de análise de audiência, publicidade ou remarketing, nem cookies para esses fins.</li>
                <li>A hospedagem do site pode registrar dados técnicos de acesso (como endereço IP) por segurança.</li>
              </ul>
            </Block>

            <Block title="Formulário de cotação">
              <p>
                Os campos do formulário (nome, WhatsApp, empresa, cidade/estado, produto de interesse e mensagem) são usados
                apenas para montar, no seu próprio navegador, uma mensagem de cotação. Ao clicar em enviar, o site abre o
                WhatsApp com essa mensagem já preenchida. Nada é transmitido à {site.shortName} até que você confirme o envio no
                aplicativo. O site não armazena o que você digitou.
              </p>
              <p>
                Depois de enviada, a conversa acontece no WhatsApp, um serviço de terceiros com termos e política de privacidade
                próprios. Usamos as informações recebidas somente para responder à sua solicitação e dar andamento ao
                atendimento comercial.
              </p>
            </Block>

            <Block title="Contato direto">
              <p>
                O site traz links de WhatsApp, telefone e e-mail das unidades e das operações. Ao usar esses canais, você nos envia
                diretamente as informações que escolher compartilhar, que serão usadas para atender ao seu contato.
              </p>
            </Block>

            <Block title="Salvar contato e compartilhar">
              <p>
                Na página de links, o botão &ldquo;Salvar contato&rdquo; gera o cartão de contato (vCard) no próprio aparelho, sem
                enviar dados a nós. O botão &ldquo;Compartilhar&rdquo; usa o recurso de compartilhamento do seu dispositivo ou
                copia o endereço da página.
              </p>
            </Block>

            <Block title="Links externos">
              <p>
                O site contém links para serviços de terceiros, como WhatsApp, Google Maps e Instagram. Ao clicar, você sai do
                site, e o tratamento de dados nesses serviços segue as políticas de cada um deles. Este site não incorpora mapas,
                vídeos ou widgets de redes sociais de terceiros; fontes, imagens e vídeos são servidos pela própria hospedagem.
              </p>
            </Block>

            <Block title="Registros técnicos">
              <p>
                Como acontece em qualquer site, a infraestrutura de hospedagem pode registrar automaticamente dados técnicos de
                cada acesso, como endereço IP, tipo de navegador (user-agent), página solicitada, data e horário. Esses registros
                servem à segurança, à estabilidade e à prevenção de abusos, são mantidos pelo período definido pelo provedor e não
                são usados para publicidade.
              </p>
            </Block>

            <Block title="Finalidades e bases legais">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Responder a pedidos de cotação e contatos: procedimentos preliminares relacionados a contrato, a pedido do
                  titular (Lei nº 13.709/2018, art. 7º, V).
                </li>
                <li>Registros técnicos de acesso: legítimo interesse na segurança e no funcionamento do site (art. 7º, IX).</li>
              </ul>
            </Block>

            <Block title="Compartilhamento e retenção">
              <p>
                Não vendemos nem alugamos dados pessoais. Eles podem ser tratados por fornecedores necessários ao funcionamento
                dos canais (a hospedagem do site e o aplicativo de mensagens que você escolheu usar). As conversas de atendimento
                são mantidas pelo tempo necessário ao relacionamento comercial e ao cumprimento de obrigações legais.
              </p>
            </Block>

            <Block title="Seus direitos">
              <p>
                Nos termos do art. 18 da LGPD, você pode solicitar: confirmação da existência de tratamento; acesso aos dados;
                correção de dados incompletos, inexatos ou desatualizados; anonimização, bloqueio ou eliminação de dados
                desnecessários ou excessivos; portabilidade; informação sobre com quem os dados foram compartilhados; e, quando o
                tratamento depender de consentimento, sua revogação.
              </p>
              {email ? (
                <p>
                  Para exercer esses direitos ou tirar dúvidas, escreva para{" "}
                  <a href={`mailto:${email}`} className="font-bold text-black underline underline-offset-4">
                    {email}
                  </a>
                  .
                </p>
              ) : null}
            </Block>

            <Block title="Alterações desta política">
              <p>
                Se o site passar a usar novas tecnologias (por exemplo, ferramentas de medição), esta política será atualizada
                para descrever exatamente o que foi ativado e, quando aplicável, como você pode consentir ou se opor.
              </p>
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
