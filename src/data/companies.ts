/**
 * Operações da JR Frutas — JR COCO, Bela Fruta Atacadista, FRUTAFORTE e Abacaxi.com.
 *
 * FONTE de cada dado: o `src/data/site.ts` do projeto próprio de cada marca
 * (2 - Site/<marca>), que já documenta o que foi confirmado pelo cliente.
 * REGRAS:
 * - Contato NUNCA é herdado da JR: cada operação só mostra os canais confirmados
 *   para ela. Sem canal próprio → `contact: null` e a página diz explicitamente
 *   que o atendimento é feito pela JR Frutas.
 * - Sem informação → `null` / lista vazia (a seção correspondente não renderiza)
 *   e o item entra em `pending` (relatório e README).
 */
import type { StaticImageData } from "next/image";
import { portraitSet, type VideoSet } from "@/lib/video";
// JR COCO
import cocoVerde from "@/assets/empresas/jr-coco/produto-coco-verde.webp";
import cocoSeco from "@/assets/empresas/jr-coco/produto-coco-seco.webp";
import cocoRalado from "@/assets/empresas/jr-coco/produto-coco-ralado.webp";
import cocoCaminhao from "@/assets/empresas/jr-coco/estrutura-caminhao.webp";
import cocoGaiolas from "@/assets/empresas/jr-coco/estrutura-gaiolas.webp";
import cocoGalpao from "@/assets/empresas/jr-coco/estrutura-galpao.webp";
import cocoCampo from "@/assets/empresas/jr-coco/quem-somos-campo.webp";
// Bela Fruta
import belaMelancia from "@/assets/empresas/bela-fruta/melancia-protagonista.webp";
import belaAbacaxi from "@/assets/empresas/bela-fruta/abacaxi-cortado.webp";
import belaCocoVerde from "@/assets/empresas/bela-fruta/coco-verde.webp";
import belaCocoSeco from "@/assets/empresas/bela-fruta/coco-seco.webp";
import belaMelao from "@/assets/empresas/bela-fruta/melao.webp";
import belaPlaca from "@/assets/empresas/bela-fruta/galpao-placa.webp";
import belaVolume from "@/assets/empresas/bela-fruta/melancia-volume.webp";
import belaCaixas from "@/assets/empresas/bela-fruta/caixas-bela-fruta.webp";
import belaSeparacao from "@/assets/empresas/bela-fruta/equipe-separacao.webp";
import belaCarga from "@/assets/empresas/bela-fruta/carga-melancia.webp";
import belaCorte from "@/assets/empresas/bela-fruta/melancia-corte-faca.webp";
// FRUTAFORTE
import ffAbacaxi from "@/assets/empresas/frutaforte/abacaxi.webp";
import ffMelancia from "@/assets/empresas/frutaforte/melancia.webp";
import ffMelao from "@/assets/empresas/frutaforte/melao.webp";
import ffCampo from "@/assets/empresas/frutaforte/campo.webp";
import ffColheita from "@/assets/empresas/frutaforte/colheita.webp";
import ffSelecao from "@/assets/empresas/frutaforte/joao-corte.webp";
import ffTransporte from "@/assets/empresas/frutaforte/transporte.webp";
import ffJoaoMarcelo from "@/assets/empresas/frutaforte/joao-marcelo.webp";
import ffMarcelo from "@/assets/empresas/frutaforte/marcelo.webp";
import ffJoao from "@/assets/empresas/frutaforte/joao.webp";
import ffGalpao from "@/assets/empresas/frutaforte/galpao.webp";
import ffCarregamento from "@/assets/empresas/frutaforte/carregamento-campo.webp";

export type CompanySlug = "jr-coco" | "bela-fruta" | "frutaforte" | "abacaxi-com";
export type Skin = "jrCoco" | "belaFruta" | "frutaforte" | "abacaxi";

/** Tom de cada skin (define logo branca/preta e contraste do overlay). Cores em globals.css → [data-skin]. */
export const skinTone: Record<Skin, "dark" | "light"> = {
  jrCoco: "dark",
  belaFruta: "light",
  frutaforte: "light",
  abacaxi: "dark",
};

type Photo = { src: StaticImageData; alt: string; caption?: string; position?: string };

/**
 * Vídeo da operação: conjunto VERTICAL gerado dos originais de câmera
 * (scripts/build-videos.py → 720/1080) e, só quando existir, um horizontal.
 */
export type CompanyMedia = { portrait: VideoSet; landscape: VideoSet | null } | null;

/** Linha de produtos embalados (ex.: coco ralado 2 kg) — apresentada como matriz, não como cards. */
export type ProductLine = {
  eyebrow: string;
  title: string;
  /** rótulo curto para chips (home, dropdown) */
  chip: string;
  pack: string;
  text: string;
  groups: { name: string; items: string[] }[];
  /** mídia REAL relacionada (não é foto de embalagem) */
  image: Photo | null;
};

export type CompanyContact = {
  /** WhatsApp comercial E.164 sem "+" */
  whatsapp: string | null;
  whatsappDisplay: string | null;
  /** telefone fixo (ligação) */
  phone: string | null;
  phoneE164: string | null;
  message: string;
  /** origem da confirmação (documentação) */
  source: string;
};

export type Company = {
  slug: CompanySlug;
  name: string;
  /** nome curto para CTA ("Conheça a …") */
  shortName: string;
  article: "a" | "o";
  skin: Skin;
  /** layout do hero da página: cada skin tem a sua linguagem */
  heroLayout: "cinematic" | "editorial" | "documental" | "lean";
  /** frase-conceito / assinatura — null = não confirmada */
  concept: string | null;
  signature: string | null;
  /** uma linha para cards (home, dropdown, /links) */
  summary: string;
  /** H1 da página (único) */
  h1: string;
  description: string;
  metaDescription: string;
  logo: { white: string; black: string; width: number; height: number; wordmarkWhite: string; wordmarkBlack: string; wordmarkWidth: number; wordmarkHeight: number; symbol: string };
  media: CompanyMedia;
  /** produtos confirmados para a operação */
  products: { name: string; short: string; image: Photo }[];
  productLine?: ProductLine | null;
  /** linha de apoio do hero (quando o resumo repetiria o H1) */
  heroLine?: string;
  /** fatos curtos do hero editorial (Bela) */
  heroFacts?: string[];
  /** diferenciais — somente o que aparece nos registros reais */
  differentials: { title: string; text: string }[];
  /** operação / origem */
  steps: { title: string; text: string; image?: Photo }[];
  people: { name: string; role: string; image: Photo }[];
  gallery: Photo[];
  quote: string | null;
  contact: CompanyContact | null;
  instagram: { handle: string; href: string } | null;
  address: { lines: string[]; mapsUrl: string | null; note: string | null } | null;
  /** itens ainda não confirmados (aparecem no relatório, nunca no site) */
  pending: string[];
};

const wa = (n: string | null, message: string) => (n ? `https://wa.me/${n}?text=${encodeURIComponent(message)}` : null);
export const companyWhatsappLink = (c: Company) => (c.contact ? wa(c.contact.whatsapp, c.contact.message) : null);

const logo = (slug: CompanySlug, w: number, h: number, ww: number, wh: number) => ({
  white: `/brand/empresas/${slug}/logo-white.png`,
  black: `/brand/empresas/${slug}/logo-black.png`,
  width: w,
  height: h,
  wordmarkWhite: `/brand/empresas/${slug}/wordmark-white.png`,
  wordmarkBlack: `/brand/empresas/${slug}/wordmark-black.png`,
  wordmarkWidth: ww,
  wordmarkHeight: wh,
  symbol: `/brand/empresas/${slug}/symbol-white.png`,
});

const media = (slug: CompanySlug, landscape: VideoSet | null = null): CompanyMedia => ({
  portrait: portraitSet(`/video/empresas/${slug}`, `/video/empresas/${slug}-poster`),
  landscape,
});

/**
 * PLACEHOLDER do hero desktop da JR COCO (caminhão/produtor) — NÃO é a direção final.
 * Pendente de nova gravação horizontal; mantido só até a substituição.
 */
const JR_COCO_HERO_PLACEHOLDER: VideoSet = {
  renditions: [{ src: "/video/empresas/jr-coco-wide.mp4", width: 960, height: 540 }],
  posters: [{ src: "/video/empresas/jr-coco-wide-poster.webp", width: 960, height: 540 }],
};

export const companies: Company[] = [
  // -------------------------------------------------------------------------
  {
    slug: "jr-coco",
    name: "JR COCO",
    shortName: "JR COCO",
    article: "a",
    skin: "jrCoco",
    heroLayout: "cinematic",
    concept: "Frescor em movimento.",
    signature: "Cultivando Qualidade.",
    summary: "Coco verde, coco seco e coco ralado — do coqueiral ao galpão.",
    h1: "JR COCO: coco verde, coco seco e coco ralado",
    heroLine: "Do coqueiral ao galpão, com seleção na origem e processamento próprio.",
    description:
      "A operação de coco da JR Frutas. Coco verde, coco seco e coco ralado selecionados na origem, processados no galpão e entregues com cuidado para mercados, quiosques, padarias, restaurantes e distribuidores.",
    metaDescription:
      "JR COCO, operação da JR Frutas: coco verde, coco seco e coco ralado selecionados na origem e processados no galpão. Atendimento comercial B2B em Goiânia.",
    logo: logo("jr-coco", 1147, 1200, 1200, 289),
    media: media("jr-coco", JR_COCO_HERO_PLACEHOLDER),
    products: [
      {
        name: "Coco Verde",
        short: "Água no ponto e frescor máximo. Giro rápido no calor, com volume e padrão.",
        image: { src: cocoVerde, alt: "Coco verde fresco segurado à mão em frente às gaiolas carregadas de cocos" },
      },
      {
        name: "Coco Seco",
        short: "Durabilidade alta e demanda constante. O item de base que nunca sai da lista.",
        image: { src: cocoSeco, alt: "Cocos secos empilhados com dois abertos mostrando a polpa branca" },
      },
    ],
    // Linha embalada confirmada pelo cliente (15/10/2026). Sem foto de embalagem:
    // a mídia é a foto REAL do coco ralado processado no galpão.
    productLine: {
      eyebrow: "Linha embalada",
      title: "Coco ralado · 2 kg",
      chip: "Coco Ralado 2 kg",
      pack: "2 kg",
      text: "Processado no galpão e embalado em pacotes de 2 kg, em versões sem película e com película.",
      groups: [
        { name: "Sem película", items: ["Fatiado", "Grosso", "Médio", "Fino"] },
        { name: "Com película", items: ["Grosso", "Médio", "Fino"] },
      ],
      image: { src: cocoRalado, alt: "Coco ralado fresco em close, com metades de coco seco ao fundo", caption: "Coco ralado processado no galpão" },
    },
    // Diferencial + Operação unificados (antes eram dois blocos numerados quase iguais)
    differentials: [],
    steps: [
      { title: "Plantação", text: "O coco é colhido no coqueiral, no ponto certo de maturação, e sai em carga direto do campo." },
      { title: "Seleção na origem", text: "Calibre, casca íntegra, peso e ponto conferidos em cada lote. Produto padronizado, cliente satisfeito." },
      { title: "Processamento próprio", text: "No galpão, o coco seco é aberto, ralado, embalado em 2 kg, pesado e rotulado. O coco verde segue inteiro, em gaiolas." },
      { title: "Distribuição em volume", text: "Gaiolas e caminhões preparados para grande volume, com descarga organizada e regularidade." },
    ],
    people: [],
    gallery: [
      { src: cocoCaminhao, alt: "Carreta de madeira carregada de cocos verdes no coqueiral", caption: "Carga direto do coqueiral" },
      { src: cocoGalpao, alt: "Fachada do galpão JR COCO com cocos verdes em primeiro plano", caption: "Galpão JR COCO" },
      { src: cocoGaiolas, alt: "Coco verde segurado à mão diante das gaiolas carregadas", caption: "Gaiolas para grande volume" },
      { src: cocoCampo, alt: "Caminhão com carga alta de cocos verdes sob o céu azul", caption: "Volume em movimento" },
    ],
    quote: "Puro por dentro, confiável por fora.",
    contact: {
      whatsapp: "5562999950999",
      whatsappDisplay: "(62) 99995-0999",
      phone: null,
      phoneE164: null,
      message: "Olá! Vim pelo site da JR Frutas e gostaria de falar com a JR COCO.",
      source: "WhatsApp confirmado por João em 27/09/2026 (projeto JR COCO)",
    },
    instagram: { handle: "jrcocooficial", href: "https://www.instagram.com/jrcocooficial/" },
    address: {
      lines: ["CEASA Goiânia · Galpão 8, Box 11", "Goiânia - GO"], // Galpão 8, Box 11: confirmado pelo cliente (15/10/2026)
      mapsUrl:
        "https://www.google.com/maps/place/CEASA+Goi%C3%A2nia/@-16.6264335,-49.2044751,540m/data=!3m1!1e3!4m6!3m5!1s0x935ef29e3b600f1b:0x4e64ec1bed50cd91!8m2!3d-16.6272374!4d-49.2043864!16s%2Fg%2F11bymz0zlz",
      note: null,
    },
    pending: ["Telefone fixo", "E-mail", "Hero desktop: vídeo placeholder — PENDENTE DE NOVA GRAVAÇÃO (horizontal 4K)"],
  },
  // -------------------------------------------------------------------------
  {
    slug: "bela-fruta",
    name: "Bela Fruta Atacadista",
    shortName: "Bela Fruta",
    article: "a",
    skin: "belaFruta",
    heroLayout: "editorial",
    concept: "Atacado com presença.",
    signature: "Cultivando Qualidade.",
    summary: "Atacado diário no CEASA-GO: preço do dia e separação no mesmo dia.",
    h1: "Bela Fruta Atacadista: atacado de frutas todo dia no CEASA-GO",
    description:
      "A operação de atacado diário da JR Frutas no CEASA-GO. Melancia, abacaxi, coco verde, coco seco e melão com volume, padrão de seleção e atendimento direto pelo WhatsApp para mercados, feirantes, restaurantes e padarias.",
    metaDescription:
      "Bela Fruta Atacadista, operação da JR Frutas no CEASA-GO: melancia, abacaxi, coco verde, coco seco e melão com preço do dia e separação no mesmo dia.",
    logo: logo("bela-fruta", 1200, 1080, 1200, 324),
    media: media("bela-fruta"),
    products: [
      {
        name: "Melancia",
        short: "Pesada para o tamanho, casca firme, polpa vermelha no ponto de vender.",
        image: { src: belaMelancia, alt: "Melancia cortada com etiqueta Bela Fruta diante da placa do box" },
      },
      {
        name: "Abacaxi",
        short: "Coroa firme, casca uniforme e aroma doce na base.",
        image: { src: belaAbacaxi, alt: "Abacaxi cortado ao meio mostrando a polpa amarela sobre abacaxis inteiros" },
      },
      {
        name: "Coco Verde",
        short: "Água no ponto e frescor máximo. O produto que vende sozinho no calor.",
        image: { src: belaCocoVerde, alt: "Coco verde fresco segurado à mão no galpão" },
      },
      {
        name: "Coco Seco",
        short: "O item de base que nunca sai da lista. Durabilidade alta e demanda constante.",
        image: { src: belaCocoSeco, alt: "Cocos secos empilhados, com dois cocos abertos mostrando a polpa branca" },
      },
      {
        name: "Melão",
        short: "Casca certa, doçura garantida. Selecionado para vender.",
        image: { src: belaMelao, alt: "Melão amarelo cortado em fatias sobre caixa de madeira" },
      },
    ],
    // Os 4 argumentos ficam nos fatos do hero; o detalhe de cada um já está em
    // "Como comprar" (WhatsApp/preço do dia, separação, entrega/retirada) e o box no "Onde".
    heroFacts: ["Todo dia no CEASA-GO", "Preço do dia", "Separação no mesmo dia", "Entrega ou retirada"],
    differentials: [],
    steps: [
      { title: "Chama no WhatsApp", text: "Sem cadastro complicado. Você fala com quem está na operação." },
      { title: "Manda sua lista", text: "Produtos e quantidades. A cotação sai com o preço do dia." },
      { title: "Separação no mesmo dia", text: "Pedido confirmado entra na separação, com conferência de padrão lote a lote." },
      { title: "Entrega ou retirada", text: "Carregamento cuidadoso para entrega ou retirada direto no box." },
    ],
    people: [],
    gallery: [
      { src: belaPlaca, alt: "Abacaxis organizados no box com a placa Bela Fruta ao fundo", caption: "Box GP-08 · 07, CEASA-GO" },
      { src: belaVolume, alt: "Pilha alta de melancias organizadas no galpão", caption: "Volume para quem precisa de constância" },
      { src: belaCaixas, alt: "Melancias em caixas de madeira com a marca Bela Fruta", caption: "Caixas Bela Fruta" },
      { src: belaSeparacao, alt: "Equipe separando abacaxis no carrinho diante da placa Bela Fruta", caption: "Separação no mesmo dia" },
      { src: belaCarga, alt: "Funcionário carregando melancias no carrinho", caption: "Carregamento cuidadoso" },
      { src: belaCorte, alt: "Melancia sendo cortada com faca, polpa vermelha à mostra", caption: "Padrão conferido na faca" },
    ],
    quote: "Por fora força, por dentro doçura.",
    contact: {
      whatsapp: "5562993357892",
      whatsappDisplay: "(62) 99335-7892",
      phone: "(62) 3522-9363",
      phoneE164: "+556235229363",
      message: "Olá! Vim pelo site da JR Frutas e gostaria de falar com a Bela Fruta Atacadista.",
      source: "WhatsApp informado pelo cliente; fixo da placa do box (projeto Bela Fruta)",
    },
    // Instagram informado diretamente pelo proprietário (15/10/2026) — não havia registro nos arquivos locais
    instagram: { handle: "bela.frutaatacadista", href: "https://www.instagram.com/bela.frutaatacadista/" },
    address: {
      lines: ["CEASA-GO · GP-08, Box 07", "Goiânia - GO"],
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent("CEASA-GO GP-08 Box 07 Bela Fruta Atacadista, Goiânia - GO"),
      note: null,
    },
    pending: ["E-mail", "Endereço rodoviário do box a divulgar / link oficial do Maps"],
  },
  // -------------------------------------------------------------------------
  {
    slug: "frutaforte",
    name: "FRUTAFORTE",
    shortName: "FRUTAFORTE",
    article: "a",
    skin: "frutaforte",
    heroLayout: "documental",
    concept: "Direto com o produtor parceiro.",
    signature: "FRUTAFORTE. Cultivando qualidade.",
    summary: "Em parceria com produtores: seleção no campo e frota identificada.",
    h1: "FRUTAFORTE: a fruta acompanhada desde a lavoura",
    description:
      "Uma das operações da JR Frutas, em parceria direta com produtores: acompanhamento na lavoura, seleção no campo e frota identificada. Abacaxi, melancia e melão para o seu negócio.",
    metaDescription:
      "FRUTAFORTE, uma das operações da JR Frutas, trabalha em parceria com produtores: seleção no campo e frota identificada. Abacaxi, melancia e melão no atacado.",
    logo: logo("frutaforte", 1200, 847, 1600, 334),
    media: media("frutaforte"),
    products: [
      {
        name: "Abacaxi",
        short: "Colhido na lavoura parceira e conferido na hora.",
        image: { src: ffAbacaxi, alt: "Abacaxis maduros ainda na lavoura, entre as folhas da planta" },
      },
      {
        name: "Melancia",
        short: "Polpa firme, cor intensa e doçura no ponto.",
        image: { src: ffMelancia, alt: "Melancia cortada ao meio mostrando a polpa vermelha" },
      },
      {
        name: "Melão",
        short: "Amarelo, calibre padronizado e casca íntegra.",
        image: { src: ffMelao, alt: "Melões amarelos com etiqueta, arrumados em caixa plástica" },
      },
    ],
    differentials: [
      { title: "Proximidade com o produtor", text: "Parceria direta, acompanhada na lavoura." },
      { title: "Seleção no campo", text: "A fruta é cortada e conferida antes de seguir." },
      { title: "Frota identificada", text: "Caminhões com o selo FRUTAFORTE e caixas padronizadas." },
    ],
    steps: [
      {
        title: "Campo",
        text: "Tudo começa na lavoura do produtor parceiro, onde a FRUTAFORTE acompanha o ponto de colheita.",
        image: { src: ffCampo, alt: "Fileiras de abacaxi na lavoura, sob céu nublado", position: "50% 60%" },
      },
      {
        title: "Colheita",
        text: "A fruta é colhida e encaixotada no campo e sobe direto para o caminhão.",
        image: { src: ffColheita, alt: "Trabalhador erguendo caixa de abacaxi para o caminhão na lavoura", position: "50% 40%" },
      },
      {
        title: "Seleção",
        text: "Casca, calibre, peso e polpa conferidos. A fruta é cortada e provada antes de seguir.",
        image: { src: ffSelecao, alt: "João Francisco segurando um abacaxi cortado ao meio ao lado do caminhão", position: "50% 40%" },
      },
      {
        title: "Transporte",
        text: "A carga viaja em frota identificada com o selo FRUTAFORTE, acomodada para chegar inteira.",
        image: { src: ffTransporte, alt: "Caminhão com o símbolo da FRUTAFORTE carregado de abacaxi", position: "50% 50%" },
      },
    ],
    people: [
      {
        name: "João Francisco",
        role: "Diretor Comercial",
        image: { src: ffJoao, alt: "João Francisco, diretor comercial da FRUTAFORTE, na lavoura de abacaxi", position: "50% 35%" },
      },
      {
        name: "Marcelo",
        role: "Produtor rural · lavoura de abacaxi",
        image: { src: ffMarcelo, alt: "Marcelo, produtor rural, segurando um abacaxi na lavoura", position: "50% 40%" },
      },
    ],
    gallery: [
      { src: ffJoaoMarcelo, alt: "João Francisco e o produtor Marcelo conversando na lavoura de abacaxi", caption: "Parceria direta, na lavoura" },
      { src: ffCarregamento, alt: "Caminhão sendo carregado de abacaxi no campo", caption: "Carregamento no campo" },
      { src: ffGalpao, alt: "Galpão de armazenagem com abacaxis empilhados", caption: "Galpão de armazenagem e expedição" },
    ],
    quote: "FRUTAFORTE. Cultivando qualidade.",
    contact: {
      whatsapp: "5562998583078",
      whatsappDisplay: "(62) 99858-3078",
      phone: null,
      phoneE164: null,
      message: "Olá! Vim pelo site da JR Frutas e gostaria de falar com a FRUTAFORTE.",
      source: "WhatsApp comercial confirmado em 28/09/2026 (projeto FRUTAFORTE, .env.local)",
    },
    // Instagram informado diretamente pelo proprietário (15/10/2026) — não havia registro nos arquivos locais
    instagram: { handle: "frutaforte", href: "https://www.instagram.com/frutaforte/" },
    address: {
      lines: ["Rodovia BR-153, Km 5,5", "GP04, Box 06 · Fazenda Retiro, CEASA", "Goiânia - GO"],
      mapsUrl: "https://maps.app.goo.gl/65GD5dzdYD3PcdFv6",
      note: "Mesmo endereço da Unidade Goiânia da JR Frutas (confirmado pelo cliente).",
    },
    pending: ["E-mail", "Região exata da lavoura do produtor parceiro"],
  },
  // -------------------------------------------------------------------------
  {
    slug: "abacaxi-com",
    name: "Abacaxi.com",
    shortName: "Abacaxi.com",
    article: "a",
    skin: "abacaxi",
    heroLayout: "lean",
    concept: null,
    signature: null,
    summary: "Uma das operações da JR Frutas.",
    h1: "Abacaxi.com, uma operação da JR Frutas",
    description: "A Abacaxi.com faz parte das operações da JR Frutas.",
    metaDescription: "Abacaxi.com, uma das operações da JR Frutas Atacadista.",
    logo: logo("abacaxi-com", 1200, 757, 1200, 162),
    media: null,
    products: [],
    differentials: [],
    steps: [],
    people: [],
    gallery: [],
    quote: null,
    contact: null,
    instagram: null,
    address: null,
    pending: [
      "Descrição e posicionamento da operação",
      "Produtos",
      "Contato próprio (WhatsApp/telefone/e-mail)",
      "Instagram",
      "Fotos e vídeos da operação",
    ],
  },
];

export const companyBySlug = (slug: string) => companies.find((c) => c.slug === slug) ?? null;
export const companyHref = (c: Pick<Company, "slug">) => `/empresas/${c.slug}`;
export const companyCta = (c: Pick<Company, "article" | "shortName">) => `Conheça ${c.article} ${c.shortName}`;
