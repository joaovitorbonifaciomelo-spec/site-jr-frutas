/**
 * Pós-build do export estático: corrige os arquivos de prefetch gerados no Windows.
 *
 * O Next 16.3.5 troca "/" por "." para montar o nome (__next.empresas.$d$slug.__PAGE__.txt),
 * mas no Windows o caminho usa "\" e o arquivo acaba em subpastas
 * (__next.empresas/$d$slug/__PAGE__.txt). O navegador pede o nome com pontos e recebe 404.
 * Em Linux o nome já sai certo e este script não encontra nada para mover.
 */
import { readdirSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
let moved = 0;

function flatten(pageDir, dir, prefix) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) flatten(pageDir, path, `${prefix}.${entry.name}`);
    else {
      renameSync(path, join(pageDir, `${prefix}.${entry.name}`));
      moved += 1;
    }
  }
}

function visit(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(dir, entry.name);
    if (entry.name.startsWith("__next")) {
      flatten(dir, path, entry.name);
      rmSync(path, { recursive: true, force: true });
    } else if (entry.name !== "_next" && entry.name !== "img" && entry.name !== "video") {
      visit(path);
    }
  }
}

visit(OUT);
console.log(`out: ${moved} arquivos de prefetch corrigidos`);
