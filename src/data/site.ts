/**
 * Fonte única de conteúdo e dados da JR Frutas (núcleo do site unificado).
 * As operações (JR COCO, Bela Fruta, FRUTAFORTE, Abacaxi.com) ficam em
 * `companies.ts` — cada uma com os próprios contatos (nunca herdados daqui).
 *
 * REGRA: nada é inventado. O que não foi confirmado fica `null` ou com
 * `pending: true` e aparece com contorno tracejado em `npm run dev`
 * (globals.css → [data-pending]).
 *
 * CONFIRMADO (cliente / arquivos do Grupo JR / auditoria do legado — docs/legacy-audit.md):
 * - Marca: JR Frutas Atacadista · razão social "JR. Comercial de Frutas"
 * - Desde 1994 (mais de 30 anos de mercado) · +1.500 clientes atendidos
 * - E-mail: contato@jrfrutas.com.br · Instagram: @jr.frutas
 * - Unidade Goiânia: (62) 3522-9333 (fixo e WhatsApp) · Rodovia BR-153, Km 5,5,
 *   GP04, Box 06, Fazenda Retiro, CEASA · CEP 74675-090 (confirmado pelo cliente em 15/10/2026)
 * - Unidade Brasília: (61) 3974-6842 (fixo e WhatsApp) · SIA Trecho 10, Guará, CEP 71200-100
 * - Links do Google Maps: os mesmos do site legado (perfis oficiais)
 * - Produtos: abacaxi, melancia, coco seco, coco verde e melão
 * - Clientes: SOMENTE os logos brancos já entregues (public/partners)
 *
 * A VALIDAR (fora do site até confirmação): aquisição da Melancia e Cia (2009),
 * escritório de compras em Uruana-GO, ano de abertura da unidade de Brasília.
 */

// ---------------------------------------------------------------------------
// CONFIGURAÇÃO PÚBLICA (via .env) — ver .env.example
// ---------------------------------------------------------------------------
/**
 * URL pública final. O domínio previsto é o do site legado (jrfrutas.com.br),
 * mas ele só passa a valer quando NEXT_PUBLIC_SITE_URL for definido no corte.
 * Sem ele: localhost + noindex (robots.ts) — nunca publicar canonical errado.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
/** WhatsApp geral — NÃO EXISTE (atendimento é por unidade). Só entra se configurado no .env. */
const GENERAL_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "") || null;
/** Google Tag Manager — DESLIGADO por padrão. Ver .env.example (GTM-P7K9X4MP só após validar o container). */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() || null;

export const FOUNDING_YEAR = 1994;

export const site = {
  name: "JR Frutas Atacadista",
  shortName: "JR Frutas",
  legalName: "JR. Comercial de Frutas",
  foundingYear: FOUNDING_YEAR,
  /** headline do hero (aprovada) */
  tagline: "Qualidade que começa no campo. Confiança que chega até o seu negócio.",
  /** assinatura da marca */
  signature: "Cultivando qualidade.",
  description:
    "Atacado de abacaxi, melancia, coco verde, coco seco e melão desde 1994. Frutas selecionadas, entregas rápidas e programadas e atendimento direto para mercados, feirantes e restaurantes a partir de Goiânia e Brasília.",
  url: SITE_URL ?? "http://localhost:3000",
  /** true somente quando NEXT_PUBLIC_SITE_URL estiver definido (domínio final) */
  urlConfigured: Boolean(SITE_URL),
  locale: "pt_BR",
  /** E.164 sem "+" ou null — não existe WhatsApp geral */
  whatsapp: GENERAL_WHATSAPP as string | null,
  email: "contato@jrfrutas.com.br" as string | null, // CONFIRMADO
  social: {
    instagram: { href: "https://www.instagram.com/jr.frutas/", handle: "jr.frutas", pending: false }, // CONFIRMADO
  },
};

/** Canais gerais de contato (o atendimento comercial é por unidade — ver `units`). */
export const contacts = {
  email: site.email ? { address: site.email, href: `mailto:${site.email}` } : null,
  instagram: site.social.instagram,
};

/**
 * Crédito do desenvolvedor (faixa final do footer).
 * - `logo`: wordmark oficial BRANCO (Interno/Branding/branco.svg, sem alteração) — o footer é preto.
 * - `url`: site oficial da Bonifácio; a logo é o link (nova aba).
 */
export const developerCredit = {
  name: "Bonifácio Marketing Digital",
  url: "https://bonifacioconsultoria.com.br" as string | null,
  logo: "/brand/bonifacio-branco.svg" as string | null,
  logoWidth: 2000,
  logoHeight: 469,
};

// ---------------------------------------------------------------------------
// NAVEGAÇÃO — âncoras com "/" na frente: funcionam a partir de qualquer rota.
// Mesma ordem das seções da home. "Empresas" abre o dropdown (itens de companies.ts).
// ---------------------------------------------------------------------------
export type NavItem = { label: string; href: string; dropdown?: "empresas" };
export const nav: NavItem[] = [
  { label: "Início", href: "/#inicio" },
  { label: "Produtos", href: "/#produtos" },
  { label: "Operação", href: "/#operacao" },
  { label: "Empresas", href: "/#empresas", dropdown: "empresas" },
  { label: "Estrutura", href: "/#estrutura" },
  { label: "Quem somos", href: "/#quem-somos" },
  { label: "Contato", href: "/#cotacao" },
];

// ---------------------------------------------------------------------------
// UNIDADES
// ---------------------------------------------------------------------------
export type Unit = {
  id: "goiania" | "brasilia";
  city: string;
  state: string;
  name: string;
  /** telefone em formato humano (fixo — também é o WhatsApp da unidade) */
  phone: string;
  /** E.164 para tel:/vCard */
  phoneE164: string;
  phonePending: boolean;
  /** WhatsApp da unidade em E.164 ("+55…"). null = não confirmado — não usar wa.me. */
  whatsapp: string | null;
  /** endereço em uma linha (sheet do /links, vCard, cópia) */
  address: string;
  /** endereço em linhas (footer, cards) */
  addressLines: string[];
  street: string;
  locality: string;
  postalCode: string | null;
  addressPending: boolean;
  role: string;
  /** Google Maps — link oficial usado no site legado */
  mapsUrl: string;
  mapsPending: boolean;
  lon: number;
  lat: number;
};

export const units: Unit[] = [
  {
    id: "goiania",
    city: "Goiânia",
    state: "GO",
    name: "Unidade Goiânia",
    phone: "(62) 3522-9333",
    phoneE164: "+556235229333",
    phonePending: false,
    whatsapp: "+556235229333", // CONFIRMADO: mesmo número do fixo
    address: "Rodovia BR-153, Km 5,5, GP04, Box 06, Fazenda Retiro, CEASA, Goiânia - GO, 74675-090",
    addressLines: ["Rodovia BR-153, Km 5,5", "GP04, Box 06 · Fazenda Retiro, CEASA", "Goiânia - GO · 74675-090"],
    street: "Rodovia BR-153, Km 5,5, GP04, Box 06, Fazenda Retiro, CEASA",
    locality: "Goiânia",
    postalCode: "74675-090", // CONFIRMADO pelo cliente (15/10/2026)
    addressPending: false,
    role: "Operação, seleção e expedição para Goiás e região.",
    mapsUrl: "https://maps.app.goo.gl/65GD5dzdYD3PcdFv6", // link do site legado
    mapsPending: false,
    lon: -49.27,
    lat: -16.68,
  },
  {
    id: "brasilia",
    city: "Brasília",
    state: "DF",
    name: "Unidade Brasília",
    phone: "(61) 3974-6842",
    phoneE164: "+556139746842",
    phonePending: false,
    whatsapp: "+556139746842", // CONFIRMADO: mesmo número do fixo
    address: "SIA Trecho 10, Guará, Brasília - DF, 71200-100",
    addressLines: ["SIA Trecho 10", "Guará, Brasília - DF", "71200-100"],
    street: "SIA Trecho 10, Guará",
    locality: "Brasília",
    postalCode: "71200-100",
    addressPending: false,
    role: "Distribuição e atendimento ao Distrito Federal e entorno.",
    mapsUrl: "https://maps.app.goo.gl/wqCuLBbAcWR6E8vh6", // link do site legado
    mapsPending: false,
    lon: -47.93,
    lat: -15.78,
  },
];

// ---------------------------------------------------------------------------
// AUTORIDADE — dados informados pelo cliente
// ---------------------------------------------------------------------------
export type IconName = "award" | "users" | "truck" | "pin" | "check" | "box" | "field" | "select";

export const authority = {
  since: { value: String(FOUNDING_YEAR), label: "Desde", detail: "Mais de 30 anos de mercado" },
  items: [
    { value: "+1.500", label: "clientes atendidos", icon: "users" as IconName },
    { value: "Entregas", label: "rápidas e programadas", icon: "truck" as IconName },
    { value: "2", label: "unidades · Goiânia e Brasília", icon: "pin" as IconName },
  ],
};

// ---------------------------------------------------------------------------
// PRODUTOS
// ---------------------------------------------------------------------------
export type Product = {
  slug: string;
  name: string;
  short: string;
  description: string;
  image: "abacaxi" | "melancia" | "cocoSeco" | "cocoVerde" | "melao";
  alt: string;
};

export const products: Product[] = [
  {
    slug: "abacaxi",
    name: "Abacaxi",
    short: "Selecionado no ponto certo de maturação e com alto padrão de qualidade.",
    description:
      "Coroa verde e firme, casca uniforme e aroma doce na base. Selecionamos o abacaxi para chegar na fase certa de venda.",
    image: "abacaxi",
    alt: "Abacaxi cortado ao meio mostrando a polpa amarela, sobre abacaxis inteiros",
  },
  {
    slug: "melancia",
    name: "Melancia",
    short: "Frescor, sabor e doçura na medida certa para atender seus clientes.",
    description: "Pesada para o tamanho, casca firme e som certo na batida. Melancia que vende, não que encalha.",
    image: "melancia",
    alt: "Fatia de melancia vermelha e suculenta segurada à mão",
  },
  {
    slug: "coco-verde",
    name: "Coco Verde",
    short: "Produto fresco, hidratante e ideal para diferentes negócios.",
    description:
      "Água no ponto e frescor máximo. Giro rápido em praia, quiosque, mercado e feira — volume garantido no calor.",
    image: "cocoVerde",
    alt: "Coco verde fresco segurado à mão em frente ao estoque",
  },
  {
    slug: "coco-seco",
    name: "Coco Seco",
    short: "Qualidade, rendimento e segurança para o seu abastecimento.",
    description:
      "Durabilidade alta e demanda constante em padaria, restaurante e mercado. O item de base que nunca sai da lista.",
    image: "cocoSeco",
    alt: "Cocos secos empilhados, com um coco aberto mostrando a polpa branca",
  },
  {
    slug: "melao",
    name: "Melão",
    short: "Selecionado com qualidade para atender diferentes tipos de negócio.",
    description:
      "Casca, cor de fundo e aroma na base indicam o ponto certo. Entregamos melão pronto para vender, não para amadurecer na prateleira.",
    image: "melao",
    alt: "Melão amarelo inteiro sendo cortado sobre caixa de madeira",
  },
];

export const productOptions = [...products.map((p) => p.name), "Mais de um produto"] as const;

// ---------------------------------------------------------------------------
// OPERAÇÃO — prova real (fotos da operação com legenda do que mostram)
// ---------------------------------------------------------------------------
export const operationFacts = [
  { value: "Volume", label: "estoque e giro diário nas unidades" },
  { value: "Seleção", label: "conferência de calibre, casca e ponto" },
  { value: "Frota", label: "carregamento cuidadoso e rotas programadas" },
  { value: "Retirada", label: "ou entrega, combinada no atendimento" },
];

// ---------------------------------------------------------------------------
// PROCESSO
// ---------------------------------------------------------------------------
export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  detail: string;
  icon: "field" | "select" | "truck" | "box";
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Produção",
    description: "Produção própria e parceria com produtores confiáveis.",
    detail:
      "Acompanhamos o manejo e o ponto de colheita, na produção própria e com produtores parceiros selecionados, para garantir fruta com padrão desde a origem.",
    icon: "field",
  },
  {
    number: "02",
    title: "Seleção",
    description: "Rigor na escolha para garantir qualidade, calibre e padronização.",
    detail:
      "Cada lote é conferido no recebimento: calibre, casca, peso e maturação. O que não passa na seleção não segue para o seu negócio.",
    icon: "select",
  },
  {
    number: "03",
    title: "Logística",
    description: "Estrutura própria e frota preparada para entregas seguras e ágeis.",
    detail:
      "Carregamento cuidadoso e rotas planejadas para a fruta chegar com frescor e no prazo combinado, em Goiás, no Distrito Federal e no entorno.",
    icon: "truck",
  },
  {
    number: "04",
    title: "Abastecimento",
    description: "Regularidade e compromisso para manter seu negócio sempre abastecido.",
    detail: "Entregas rápidas e programadas, com volume constante para o seu negócio não perder venda por falta de produto.",
    icon: "box",
  },
];

// ---------------------------------------------------------------------------
// CLIENTES — SOMENTE os logos já entregues (não usar a lista de 2013 do legado)
// ---------------------------------------------------------------------------
export type ClientLogo = { name: string; src: string; width: number; height: number };

export const clients: ClientLogo[] = [
  { name: "Carrefour", src: "/partners/carrefour.png", width: 900, height: 670 },
  { name: "Assaí Atacadista", src: "/partners/assai.png", width: 900, height: 654 },
  { name: "Costa Atacadão", src: "/partners/costa-atacadao.png", width: 900, height: 372 },
  { name: "Atacadão Dia a Dia", src: "/partners/atacadao-dia-a-dia.png", width: 900, height: 377 },
  { name: "Atacadão", src: "/partners/atacadao.png", width: 900, height: 217 },
  { name: "Pão de Açúcar", src: "/partners/pao-de-acucar.png", width: 900, height: 601 },
];

// ---------------------------------------------------------------------------
// HISTÓRIA — só marcos confirmados (1994 → hoje)
// ---------------------------------------------------------------------------
export const history = [
  {
    year: "1994",
    title: "O começo",
    text: "A JR Frutas inicia as atividades no atacado de frutas.",
  },
  {
    year: "Hoje",
    title: "Duas unidades, quatro operações",
    text: "Unidades em Goiânia e Brasília, mais de 1.500 clientes atendidos e as operações JR COCO, Bela Fruta, FRUTAFORTE e Abacaxi.com.",
  },
];

/** Marcos encontrados no legado (site de 2013) que AINDA NÃO podem ir ao ar. */
export const HISTORY_TO_VALIDATE = [
  "2009 — aquisição da Melancia e Cia (Goiânia)",
  "Escritório de compras em Uruana-GO",
  "Ano de abertura da unidade de Brasília (1994 × 2006 no legado)",
] as const;

export const aboutPillars: { title: string; text: string }[] = [
  { title: "Produção própria", text: "controle de qualidade desde a origem" },
  { title: "Seleção rigorosa", text: "calibre, casca e ponto conferidos lote a lote" },
  { title: "Atendimento direto", text: "por unidade, pelo WhatsApp" },
  { title: "Foco no cliente", text: "regularidade para o seu negócio" },
];

// ---------------------------------------------------------------------------
// FAQ — conteúdo próprio (o FAQ do legado está contaminado e NÃO é reutilizado)
// ---------------------------------------------------------------------------
export const faq = [
  {
    q: "Quais frutas estão disponíveis para distribuição?",
    a: "Trabalhamos com abacaxi, melancia, coco verde, coco seco e melão. Consulte a disponibilidade da semana pelo WhatsApp da sua unidade.",
  },
  {
    q: "Desde quando a JR Frutas atua?",
    a: "Desde 1994. São mais de 30 anos no atacado de frutas e mais de 1.500 clientes atendidos.",
  },
  {
    q: "Quais regiões são atendidas?",
    a: "Atendemos a partir das unidades de Goiânia (GO) e Brasília (DF), com cobertura em Goiás, no Distrito Federal e no entorno. Para outras regiões, fale com a nossa equipe e avaliamos a melhor rota.",
  },
  {
    q: "Como funciona a logística de entregas?",
    a: "Pedido confirmado entra na separação e o carregamento é feito com cuidado. As entregas são rápidas e programadas, no prazo combinado — ou você pode optar pela retirada na unidade.",
  },
  {
    q: "Como solicito uma cotação?",
    a: "Fale com a nossa equipe pelo WhatsApp, envie os produtos e as quantidades e retornamos com a cotação do dia. O formulário do site também abre a conversa já preenchida.",
  },
  {
    q: "O que são JR COCO, Bela Fruta, FRUTAFORTE e Abacaxi.com?",
    a: "São operações da JR Frutas, cada uma com foco próprio: a JR COCO no coco, a Bela Fruta no atacado diário do CEASA-GO e a FRUTAFORTE no trabalho em parceria com produtores, acompanhando a fruta desde a lavoura. Cada página tem os contatos da operação.",
  },
] as const;

// ---------------------------------------------------------------------------
// WHATSAPP
// ---------------------------------------------------------------------------
/** WhatsApp de uma unidade (só quando confirmado em `units[].whatsapp`). */
export const unitWhatsappLink = (u: { whatsapp: string | null }, message?: string) => {
  if (!u.whatsapp) return null;
  const base = `https://wa.me/${u.whatsapp.replace(/\D/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

/** Mensagem padrão para falar com uma unidade (header, menu mobile, hub, footer). */
export const unitMessage = (city: string) => `Olá! Vim pelo site da JR Frutas e gostaria de falar com a unidade de ${city}.`;

/** Mensagem padrão de cotação. */
export const QUOTE_MESSAGE = "Olá! Vim pelo site da JR Frutas e gostaria de solicitar uma cotação.";

/**
 * CTA de cotação ("Solicite uma cotação" e equivalentes): abre DIRETO o
 * WhatsApp da Unidade Goiânia (decisão do cliente). Sem número, cai na seção de contato.
 */
export const quoteWhatsappLink = (message: string = QUOTE_MESSAGE) => {
  const goiania = units.find((u) => u.id === "goiania");
  return (goiania && unitWhatsappLink(goiania, message)) ?? "/#cotacao";
};
