import Image from "next/image";
import type { Company } from "@/data/companies";

type Props = {
  company: Pick<Company, "name" | "logo">;
  /** cor da logo — branca sobre fundo escuro, preta sobre fundo claro */
  tone: "white" | "black";
  variant?: "lockup" | "wordmark" | "symbol";
  /** altura base em px (largura proporcional). Responsivo: classe `[--logo-h:NNpx]`. */
  height: number;
  /**
   * Tamanho ÓPTICO: compensa a proporção de cada marca para que logos largos
   * (ex.: "Abacaxi.com") não pareçam maiores que os demais na mesma altura.
   */
  optical?: boolean;
  className?: string;
  priority?: boolean;
  /** alt vazio quando o nome já está escrito ao lado */
  decorative?: boolean;
  /** se um container flex esticar a caixa, object-contain mantém a proporção e isto define o lado */
  align?: "start" | "center";
};

/** proporção de referência por variante (≈ média das 4 marcas) */
const REF = { lockup: 1.1, wordmark: 4.2, symbol: 1 } as const;

/** Logos oficiais das operações (arquivos do Grupo JR, sem redesenho). */
export function CompanyLogo({ company, tone, variant = "lockup", height, optical = false, className = "", priority, decorative, align = "start" }: Props) {
  const { logo } = company;
  const [src, w, h] =
    variant === "lockup"
      ? [tone === "white" ? logo.white : logo.black, logo.width, logo.height]
      : variant === "wordmark"
        ? [tone === "white" ? logo.wordmarkWhite : logo.wordmarkBlack, logo.wordmarkWidth, logo.wordmarkHeight]
        : [logo.symbol, 512, 512];
  const factor = optical ? Math.min(1.15, Math.max(0.72, Math.sqrt(REF[variant] / (w / h)))) : 1;
  return (
    <Image
      src={src}
      alt={decorative ? "" : company.name}
      width={w}
      height={h}
      priority={priority}
      sizes={`${Math.ceil((height * 1.4 * factor * w) / h) * 2}px`}
      className={`shrink-0 object-contain ${align === "center" ? "object-center" : "object-left"} ${variant === "symbol" && tone === "black" ? "invert" : ""} ${className}`}
      style={{ height: `calc(var(--logo-h, ${height}px) * ${factor.toFixed(3)})`, width: "auto" }}
    />
  );
}
