import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "./Icons";

type Variant = "white" | "black" | "outline-white" | "outline-black" | "ghost" | "skin" | "skin-outline";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  white:
    "bg-white text-black border border-white hover:bg-neutral-200 hover:border-neutral-200",
  black: "bg-black text-white border border-black hover:bg-neutral-800 hover:border-neutral-800",
  "outline-white": "bg-transparent text-white border border-white/70 hover:bg-white hover:text-black",
  "outline-black": "bg-transparent text-black border border-black/30 hover:border-black hover:bg-black hover:text-white",
  ghost: "bg-transparent text-current border border-transparent hover:opacity-70",
  /* seguem a skin da página/seção ([data-skin] em globals.css) */
  skin: "bg-sk-fg text-sk-bg border border-sk-fg hover:opacity-85",
  "skin-outline": "bg-transparent text-sk-fg border border-sk-fg/45 hover:bg-sk-fg hover:text-sk-bg hover:border-sk-fg",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-5 text-[0.78rem]",
  lg: "h-[54px] px-6 text-[0.8rem]",
};

type Common = {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode | false;
  full?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonProps = Common & Omit<ComponentProps<"button">, "className" | "children">;
type LinkProps = Common & { href: string } & Omit<ComponentProps<typeof Link>, "className" | "children" | "href">;

const cls = ({ variant = "white", size = "md", full, className = "" }: Common) =>
  [
    "inline-flex items-center justify-center gap-3 rounded-[var(--radius-btn)] font-display font-bold uppercase tracking-[0.1em] whitespace-nowrap",
    "transition-[background-color,border-color,color,transform] duration-300 ease-[var(--ease-out-soft)] active:scale-[0.98] select-none",
    variants[variant],
    sizes[size],
    full ? "w-full" : "",
    className,
  ].join(" ");

export function Button({ icon, children, variant, size, full, className, ...rest }: ButtonProps) {
  return (
    <button className={cls({ variant, size, full, className, children })} {...rest}>
      <span>{children}</span>
      {icon === false ? null : (icon ?? <ArrowRight size={16} />)}
    </button>
  );
}

export function ButtonLink({ icon, children, variant, size, full, className, href, ...rest }: LinkProps) {
  return (
    <Link href={href} className={cls({ variant, size, full, className, children })} {...rest}>
      <span>{children}</span>
      {icon === false ? null : (icon ?? <ArrowRight size={16} />)}
    </Link>
  );
}

/** Link textual pequeno com seta — "Saiba mais →" */
export function TextLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 font-display text-[0.72rem] font-bold uppercase tracking-[0.14em] ${className}`}
    >
      <span>{children}</span>
      <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}
