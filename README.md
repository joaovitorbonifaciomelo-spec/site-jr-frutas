# JR Frutas Atacadista — Site institucional

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4. Sem dependências extras.

## Rodar localmente

O projeto fica em disco local (`C:\Projetos\jr-frutas`) e o backup/histórico no GitHub
(`joaovitorbonifaciomelo-spec/JRFRUTAS`). **Não desenvolver de dentro do Google Drive** — o Drive
não suporta as gravações do `npm install` (erro `EBADF`); foi por isso que existiu o antigo
"runner" (`run.ps1`), removido em 22/10/2026.

```powershell
npm install          # instala dependências (uma vez, ou ao clonar do GitHub)
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm run build
npm run start
```

## Estrutura

```
src/app/                 layout (fonte, SEO, JSON-LD), página inicial, política de privacidade
src/components/layout/   Header (sticky + menu mobile), Footer
src/components/sections/ Hero, Products, Process, Logistics, Clients, Operation, Quote, About, Faq, MobileCta
src/components/ui/       Button, Logo, Icons, Reveal, Accordion, BrazilMap
src/data/site.ts         TODO o conteúdo e dados (produtos, unidades, FAQ, contatos) — ver placeholders
src/assets/images/       fotos reais otimizadas (WebP)
public/brand/            logo oficial (símbolo, wordmark, lockup), ícones
```

## Dados pendentes (placeholders)

Tudo que está marcado com `PENDING_` / `pending: true` em `src/data/site.ts` precisa ser
substituído. Em `npm run dev` esses elementos aparecem com contorno tracejado amarelo.
Na build de produção o contorno não aparece.

- WhatsApp: NÃO existe número geral (atendimento por unidade). Confirmar se os fixos das unidades atendem por WhatsApp → preencher `units[].whatsapp` em `site.ts`
- Números de autoridade (anos de mercado, clientes atendidos)
- Logos de clientes (`clients` → arquivos em `public/clients/`)
- Facebook / e-mail
- Domínio final: ainda não existe. Definir `NEXT_PUBLIC_SITE_URL` (ver `.env.example`) e **revalidar Open Graph absoluto** (og:url/og:image) depois
- Links oficiais do Google Maps (Place ID) — hoje abre por busca do endereço completo
- Texto da Política de Privacidade (revisar com o cliente)

## Tipografia

Marine Rounded não está nos assets. O site usa **Nunito** (Google Fonts) como alternativa
arredondada. Para trocar: `src/app/layout.tsx` → substituir `Nunito` por `next/font/local`
apontando para os arquivos da Marine Rounded, mantendo a variável `--font-nunito`.

## Rota `/links` (hub para a bio do Instagram)

Hub de direcionamento: logo → assinatura → WhatsApp → Produtos (`/#produtos`) → Localização
(bottom sheet com as unidades) → Nosso site → Instagram/compartilhar/salvar contato.
Regra: **hub direciona · site explica · WhatsApp atende** — não adicionar conteúdo institucional aqui.

- Componentes em `src/components/links/` (não usa Header/Footer nem seções do site)
- Vídeo: `public/video/links-loop.mp4` (720×1280, ~2 MB, loop 17,5 s) + `links-poster.webp`.
  Para trocar, mantenha o mesmo enquadramento vertical e regenere o poster do 1º frame.
- Vídeo não carrega com `prefers-reduced-motion`, `Save-Data` ou conexão 2G; se falhar, fica o poster.
- Analytics: `track()` em `hub-utils.ts` envia para `gtag`/`dataLayer` se existirem (nada instalado hoje).
- OG específico: `public/og-links.jpg`.
