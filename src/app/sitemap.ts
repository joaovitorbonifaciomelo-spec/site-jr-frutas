import type { MetadataRoute } from "next";
import { companies, companyHref } from "@/data/companies";
import { site } from "@/data/site";

/** Rotas públicas indexáveis (a política de privacidade é noindex e fica fora). */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...companies.map((c) => ({
      url: `${site.url}${companyHref(c)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: c.heroLayout === "lean" ? 0.4 : 0.7,
    })),
    { url: `${site.url}/links`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
}
