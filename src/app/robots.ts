import type { MetadataRoute } from "next";
import { site } from "@/data/site";

// Gerado no build: o site é publicado como export estático (output: "export").
export const dynamic = "force-static";

/**
 * Indexação liberada SOMENTE com o domínio final (NEXT_PUBLIC_SITE_URL).
 * Sem ele (localhost/preview), bloqueia tudo — nunca indexar canonical errado.
 */
export default function robots(): MetadataRoute.Robots {
  if (!site.urlConfigured) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
