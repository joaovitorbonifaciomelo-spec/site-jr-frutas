import { site, units } from "@/data/site";

/**
 * Analytics mínimo: o projeto não tem solução de analytics instalada.
 * Este helper apenas empurra eventos para `window.dataLayer` (GTM/GA4) ou
 * `window.gtag` caso existam — sem eles, é um no-op silencioso.
 */
type Win = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

export type HubEvent =
  | "hub_open"
  | "hub_atendimento_unidades"
  | "hub_ligar_goiania"
  | "hub_ligar_brasilia"
  | "hub_whatsapp_goiania"
  | "hub_whatsapp_brasilia"
  | "hub_produtos"
  | "hub_localizacao"
  | "hub_site"
  | "hub_instagram"
  | "hub_share"
  | "hub_save_contact"
  | "hub_maps"
  | "hub_copy_address"
  | "hub_empresas"
  | "hub_empresa"
  | "hub_desenvolvedor";

export function track(event: HubEvent, params: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Win;
  try {
    if (typeof w.gtag === "function") w.gtag("event", event, params);
    else if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event, ...params });
  } catch {
    /* nunca quebrar o hub por causa de analytics */
  }
}

/** Preserva UTMs da URL atual ao navegar para o site principal. */
export function withUtm(href: string): string {
  if (typeof window === "undefined") return href;
  const current = new URLSearchParams(window.location.search);
  const utm = [...current.entries()].filter(([k]) => k.startsWith("utm_"));
  if (utm.length === 0) return href;
  const [pathAndQuery, hash] = href.split("#");
  const [path, query = ""] = pathAndQuery.split("?");
  const qs = new URLSearchParams(query);
  for (const [k, v] of utm) if (!qs.has(k)) qs.set(k, v);
  return `${path}?${qs.toString()}${hash ? `#${hash}` : ""}`;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* cai no fallback */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/**
 * vCard 3.0 só com dados confirmados.
 * - Não há telefone/WhatsApp geral: cada unidade entra como TEL;TYPE=WORK separado,
 *   identificado por rótulo (item1.X-ABLabel — lido pelo iOS; ignorado sem efeito no Android).
 * - Nenhum número é marcado como WhatsApp/CELL.
 * - URL só entra quando o domínio final estiver configurado (NEXT_PUBLIC_SITE_URL).
 */
export function buildVCard(): string {
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${site.name}`, `ORG:${site.name}`];
  if (site.urlConfigured) lines.push(`URL:${site.url}`);
  if (site.email) lines.push(`EMAIL:${site.email}`);
  units.forEach((u, i) => {
    const item = `item${i + 1}`;
    if (!u.phonePending) {
      lines.push(`${item}.TEL;TYPE=WORK,VOICE:${u.phoneE164}`);
      lines.push(`${item}.X-ABLabel:${u.name}`);
    }
    if (!u.addressPending) lines.push(`ADR;TYPE=WORK:;;${u.address};${u.city};${u.state};;Brasil`);
  });
  lines.push("END:VCARD");
  return lines.join("\r\n");
}

export function downloadVCard() {
  const blob = new Blob([buildVCard()], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "jr-frutas.vcf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
