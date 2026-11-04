/**
 * Serve SOMENTE a pasta out/ para testar o export estático localmente.
 * Imita o básico de um Apache: arquivo existente → 200; pasta sem barra → 301 para
 * a pasta com barra; pasta com barra → index.html; o resto → 404.html com status 404.
 * Sem fallback para a home e sem rotas do Next. Suporta Range (vídeo).
 *
 * Uso: npm run build && npm run preview   (porta padrão 4173)
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";

const ROOT = resolve("out");
const PORT = Number(process.argv[2] ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".otf": "font/otf",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
};

function send(req, res, file, status = 200) {
  const size = statSync(file).size;
  const headers = { "Content-Type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream", "Accept-Ranges": "bytes" };
  const range = status === 200 ? /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? "") : null;
  if (range && (range[1] || range[2])) {
    const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (start >= size || start > end) {
      res.writeHead(416, { "Content-Range": `bytes */${size}` }).end();
      return;
    }
    res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": end - start + 1 });
    if (req.method === "HEAD") return void res.end();
    createReadStream(file, { start, end }).pipe(res);
    return;
  }
  res.writeHead(status, { ...headers, "Content-Length": size });
  if (req.method === "HEAD") return void res.end();
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  let path;
  try {
    path = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }
  const file = normalize(join(ROOT, path));
  if (file !== ROOT && !file.startsWith(ROOT + sep)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file)) {
    if (statSync(file).isFile()) return send(req, res, file);
    if (!url.pathname.endsWith("/")) {
      res.writeHead(301, { Location: `${url.pathname}/${url.search}` }).end();
      return;
    }
    const index = join(file, "index.html");
    if (existsSync(index)) return send(req, res, index);
  }
  send(req, res, join(ROOT, "404.html"), 404);
}).listen(PORT, "127.0.0.1", () => console.log(`out/ em http://localhost:${PORT}`));
