import Image from "next/image";
import { developerCredit } from "@/data/site";

type Props = {
  /** "footer" = rodapé do site · "hub" = /links (texto menor, caixa alta) */
  variant?: "footer" | "hub";
  className?: string;
  onClick?: () => void;
};

/**
 * Crédito do desenvolvedor — logo oficial da Bonifácio (SVG branco) como link
 * para o site da agência. Dados em `developerCredit` (site.ts).
 */
export function DeveloperCredit({ variant = "footer", className = "", onClick }: Props) {
  const { name, url, logo, logoWidth, logoHeight } = developerCredit;
  const hub = variant === "hub";
  const content = logo ? (
    <Image
      src={logo}
      alt={name}
      width={logoWidth}
      height={logoHeight}
      unoptimized
      className={`w-auto opacity-90 transition-opacity duration-300 group-hover:opacity-100 ${hub ? "h-[22px]" : "h-6 sm:h-[26px]"}`}
    />
  ) : (
    <span className="font-display text-[0.78rem] font-bold tracking-[0.02em] text-white/80">{name}</span>
  );
  const text = hub ? "text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/65 [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]" : "text-[0.72rem] text-white/65";
  const inner = (
    <>
      <span>Desenvolvido por</span>
      {content}
    </>
  );
  // "Desenvolvido por Bonifácio Marketing Digital" inteiro é o link (texto + logo)
  return url ? (
    <a
      href={url}
      target="_blank"
      rel="noopener"
      onClick={onClick}
      aria-label={`Desenvolvido por ${name} (abre o site em nova aba)`}
      className={`group inline-flex items-center gap-3 rounded-sm py-1 transition-colors hover:text-white ${text} ${hub ? "[&_img]:drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]" : ""} ${className}`}
    >
      {inner}
    </a>
  ) : (
    <p className={`inline-flex items-center gap-3 ${text} ${className}`}>{inner}</p>
  );
}
