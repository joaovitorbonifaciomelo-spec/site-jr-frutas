import Image from "next/image";
import Link from "next/link";

/**
 * Logo oficial JR Frutas.
 * - "horizontal": símbolo + wordmark oficiais lado a lado (peças recortadas do
 *   arquivo oficial, sem alteração de desenho) — usado no header, como na referência.
 * - "stacked": lockup oficial vertical completo — usado no footer.
 */
type Props = {
  variant?: "horizontal" | "stacked";
  tone?: "white" | "black";
  height?: number;
  className?: string;
  href?: string | null;
  priority?: boolean;
};

export function Logo({ variant = "horizontal", tone = "white", height = 44, className = "", href = "/", priority }: Props) {
  const inner =
    variant === "horizontal" ? (
      <span className={`inline-flex items-center gap-[0.55em] ${className}`} style={{ fontSize: height }}>
        <Image
          src="/brand/symbol-white.png"
          alt=""
          width={512}
          height={512}
          priority={priority}
          className={tone === "black" ? "invert" : ""}
          style={{ height: "1em", width: "1em" }}
        />
        <Image
          src="/brand/wordmark-white.png"
          alt="JR Frutas Atacadista"
          width={1200}
          height={357}
          priority={priority}
          className={tone === "black" ? "invert" : ""}
          style={{ height: "0.62em", width: "auto" }}
        />
      </span>
    ) : (
      <Image
        src={tone === "black" ? "/brand/logo-jr-frutas-black.png" : "/brand/logo-jr-frutas-white.png"}
        alt="JR Frutas Atacadista"
        width={1186}
        height={1200}
        priority={priority}
        className={className}
        style={{ height, width: "auto" }}
      />
    );

  if (!href) return inner;
  return (
    <Link href={href} aria-label="JR Frutas — início" className="inline-flex shrink-0 rounded-md">
      {inner}
    </Link>
  );
}
