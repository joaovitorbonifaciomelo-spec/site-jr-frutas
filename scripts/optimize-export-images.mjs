/**
 * Pós-build do export estático: gera em out/img/ as versões WebP pedidas pelo next/image
 * (ver src/lib/image-loader.mjs). Substitui o otimizador do servidor Next, que não existe
 * em hospedagem estática, sem serviço externo e sem Node em produção.
 *
 * Nunca há upscale: se a largura pedida passa da original, o arquivo fica na largura original.
 * A qualidade 85 só é gerada para as imagens que a usam (lista abaixo).
 * As versões ficam em cache em node_modules/.cache, então o próximo build só gera as novas.
 * Rodar pelo `npm run build`: o script apaga os originais de _next/static/media no final.
 */
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { cpus } from "node:os";
import { join, relative, sep } from "node:path";
import sharp from "sharp";
import { DEFAULT_QUALITY, IMAGE_WIDTHS, imagePath, imageSlug } from "../src/lib/image-loader.mjs";

const OUT = "out";
const CACHE = join("node_modules", ".cache", "jr-frutas-img");
const SOURCES = ["_next/static/media", "brand", "partners", "images"];
const IMAGE = /\.(png|jpe?g|webp)$/i;
/** Artes da cotação (quality={85} em Quote.tsx). */
const HIGH_QUALITY = /^melancia-cotacao[.]/;

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

rmSync(join(OUT, "img"), { recursive: true, force: true });
mkdirSync(join(OUT, "img"));
mkdirSync(CACHE, { recursive: true });

const files = SOURCES.flatMap((dir) => walk(join(OUT, dir))).filter((f) => IMAGE.test(f));
const seen = new Map();
const jobs = [];

for (const file of files) {
  const src = `/${relative(OUT, file).split(sep).join("/")}`;
  const slug = imageSlug(src);
  if (seen.has(slug)) throw new Error(`Nome repetido em out/img: ${src} e ${seen.get(slug)}`);
  seen.set(slug, src);
  const hash = createHash("sha1").update(readFileSync(file)).digest("hex").slice(0, 16);
  const qualities = HIGH_QUALITY.test(slug) ? [DEFAULT_QUALITY, 85] : [DEFAULT_QUALITY];
  for (const quality of qualities) {
    for (const width of IMAGE_WIDTHS) {
      jobs.push({ file, dest: join(OUT, imagePath(src, width, quality)), width, quality, cached: join(CACHE, `${hash}.w${width}.q${quality}.webp`) });
    }
  }
}

let next = 0;
let generated = 0;
sharp.concurrency(1);
await Promise.all(
  Array.from({ length: Math.max(2, cpus().length - 1) }, async () => {
    while (next < jobs.length) {
      const job = jobs[next++];
      if (!existsSync(job.cached)) {
        const image = sharp(job.file);
        const { width: natural } = await image.metadata();
        await image
          .rotate()
          .resize({ width: Math.min(job.width, natural), withoutEnlargement: true })
          .webp({ quality: job.quality, effort: 4 })
          .toFile(job.cached);
        generated += 1;
      }
      copyFileSync(job.cached, job.dest);
    }
  }),
);

// Os originais importados pelo código não são pedidos por ninguém: o next/image sempre aponta para out/img.
for (const file of walk(join(OUT, SOURCES[0])).filter((f) => IMAGE.test(f))) rmSync(file);

const bytes = jobs.reduce((total, job) => total + statSync(job.dest).size, 0);
console.log(`out/img: ${jobs.length} versões de ${files.length} imagens (${generated} novas), ${(bytes / 1048576).toFixed(1)} MB`);
