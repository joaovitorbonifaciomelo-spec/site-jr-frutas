# Pacote de produção e repositório de deploy

Fluxo: projeto fonte → build local → `out/` → repositório separado de deploy → Git → Plesk → `httpdocs`.

O build é feito na máquina local. Produção não usa Node.js.

**Status:** procedimento documentado, ainda não executado. Nada disto cria repositório, configura o Plesk ou publica o site.

## 1. Gerar o pacote

No PowerShell, na raiz do projeto fonte, com a árvore limpa (`git status`):

```powershell
npm ci
npm run lint
npm run typecheck

$env:NEXT_PUBLIC_SITE_URL = "https://www.jrfrutas.com.br"
npm run build
Remove-Item Env:NEXT_PUBLIC_SITE_URL

Copy-Item docs\redirects\.htaccess out\.htaccess
```

- Sem `NEXT_PUBLIC_SITE_URL`, o build sai como preview: `noindex`, robots bloqueando tudo e canonical em `localhost`. **Nunca publique um build sem essa variável.**
- `npm run build` já inclui o `next build`, a correção dos arquivos de prefetch e a geração das imagens em `out/img`.
- Não defina `NEXT_PUBLIC_GTM_ID` sem decisão específica: o GTM fica desligado por padrão.

## 2. Verificar o pacote

Todos os itens precisam passar:

```powershell
# Deve mostrar "Allow: /" e o sitemap com www
Get-Content out\robots.txt

# Deve listar 7 URLs, todas em https://www.jrfrutas.com.br
Select-String -Path out\sitemap.xml -Pattern "<loc>"

# Deve mostrar "index, follow" e o canonical com www
Select-String -Path out\index.html -Pattern 'name="robots" content="[^"]*"|rel="canonical" href="[^"]*"' -AllMatches |
  ForEach-Object { $_.Matches.Value }

# Deve voltar vazio. O texto "localhost:3000" em um arquivo .js é só um valor de reserva sem uso e não conta.
Get-ChildItem out -Recurse -Include *.html,*.xml,*.txt,*.webmanifest | Select-String -Pattern "localhost" -List | Select-Object Path

# Deve voltar vazio: nada de segredo, banco, código ou arquivo interno
Get-ChildItem out -Recurse -Force -File |
  Where-Object { $_.Name -match '^\.env|\.(sql|php|zip|gz|map|ts|tsx|mov|otf|pdf|log|bak)$|^package' } |
  Select-Object FullName

# Deve voltar vazio: os masters não entram (o maior derivado tem cerca de 7 MB)
Get-ChildItem out -Recurse -File -Filter *.mp4 | Where-Object { $_.Length -gt 10MB } | Select-Object FullName

# Deve voltar True
Test-Path out\.htaccess
```

Depois, confira no navegador, servindo só o pacote:

```powershell
npm run preview   # http://localhost:4173
```

As páginas `/`, `/links/`, as 4 empresas, `/politica-de-privacidade/`, `/termos-de-uso/` e uma rota inexistente precisam abrir direto e com F5, sem erro de console. Canonical e Open Graph apontam para o domínio final, então não siga esses links neste teste. O servidor de preview não lê o `.htaccess`: redirects e 410 só podem ser testados em Apache.

## 3. Sincronizar com o repositório de deploy

O repositório de deploy é separado e sua raiz equivale ao conteúdo de `out/`, com `.htaccess` ao lado de `index.html`. Exemplo com clone em `C:\Projetos\jr-frutas-deploy`:

```powershell
# /MIR espelha: apaga no destino o que não existe em out\. /XD .git preserva o repositório.
robocopy out C:\Projetos\jr-frutas-deploy /MIR /XD .git
# Códigos de saída 0 a 7 são sucesso no robocopy; 8 ou mais indica falha.

git -C C:\Projetos\jr-frutas-deploy status
git -C C:\Projetos\jr-frutas-deploy add -A
git -C C:\Projetos\jr-frutas-deploy commit -m "Publicação: <hash curto do projeto fonte>"
```

Confira `git status` antes do commit. Na primeira sincronização, use um clone vazio e confirme que o destino é o correto, porque `/MIR` apaga o que não está em `out\`.

O repositório de deploy **não** recebe: `src`, `node_modules`, `.env`, `package.json`, scripts, masters, legado, arquivos do Drive, banco ou documentação interna. Também não recebe README.

## 4. Antes de publicar

- Reescrever e testar as regras de HTTPS e `www` no `.htaccess`. As regras comentadas foram escritas para o domínio sem `www`.
- Testar o `.htaccess` em Apache real. Até aqui só houve simulação das regras.
- Fazer backup do `httpdocs` atual e tirar da pasta pública o Laravel, o `.env`, o `.git`, os SQLs e o CMS. O bloqueio do `.htaccess` é só uma segunda barreira.
- Decidir `/pagina-inicial`, `/uploads/*`, `/app`, `/app-raddar` e `/site-antigo`.
- Confirmar qual pasta o Plesk usa como destino do deploy e se o `.git` fica fora da raiz pública.
