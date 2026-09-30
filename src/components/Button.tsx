"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties, MouseEventHandler, ReactNode } from "react";
import { usePointerVars } from "@/lib/pointer";

/**
 * Botões em cápsula com luz.
 *
 *  - `luz`   CTA principal: corpo claro em degradê, texto em gradiente, halo azul
 *  - `azul`  CTA sólido: azul com filete de luz na borda superior
 *  - `vidro` secundário: cápsula translúcida com borda
 *  - `texto` ação discreta
 *
 * Quatro estados distintos em todos: repouso, hover (halo cresce e a luz segue
 * o ponteiro), foco por teclado (anel ciano) e pressionado (afunda e escurece).
 * A luz do ponteiro só existe com mouse; no toque fica só o `:active`.
 */
type Variant = "luz" | "azul" | "vidro" | "texto";

interface Common {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  icon?: boolean;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
  /** quando o botão é o acesso à rota atual (ex.: o contato no cabeçalho) */
  "aria-current"?: "page";
}

type Props =
  | (Common & {
      href: string;
      external?: boolean;
      onClick?: MouseEventHandler<HTMLAnchorElement>;
      type?: never;
      disabled?: never;
    })
  | (Common & {
      href?: never;
      external?: never;
      onClick?: MouseEventHandler<HTMLButtonElement>;
      type?: "button" | "submit";
      disabled?: boolean;
    });

export function Button(props: Props) {
  const {
    variant = "luz",
    size = "md",
    icon = true,
    className = "",
    children,
    style,
  } = props;
  const onPointerMove = usePointerVars<HTMLElement>();
  const cls = `btn btn-${variant} btn-${size} ${className}`.trim();
  const atual = props["aria-current"];
  const inner = (
    <>
      <span className="btn-label">{children}</span>
      {icon && variant !== "texto" && (
        <ArrowUpRight className="btn-arrow" size={18} aria-hidden="true" />
      )}
      {icon && variant === "texto" && (
        <ArrowUpRight size={16} aria-hidden="true" />
      )}
    </>
  );

  if (props.href !== undefined) {
    const { href, external, onClick } = props;
    if (external) {
      return (
        <a
          className={cls}
          style={style}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          onPointerMove={onPointerMove}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link
        className={cls}
        style={style}
        href={href}
        aria-current={atual}
        onClick={onClick}
        onPointerMove={onPointerMove}
      >
        {inner}
      </Link>
    );
  }
  return (
    <button
      className={cls}
      style={style}
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={props.onClick}
      onPointerMove={onPointerMove}
    >
      {inner}
    </button>
  );
}
