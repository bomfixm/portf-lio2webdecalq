"use client";
import { useId } from "react";

/**
 * O "decalqzinho" em SVG, redesenhado a partir de public/brand/logo.png para
 * que um olho possa ser animado separadamente. A geometria foi medida no
 * arquivo original (janela girada -9°, olhos em arco de ~164°, contorno do
 * cursor traçado do PNG) e as duas cores do degradê são as do próprio PNG.
 * O desenho não recebe brilho, contorno nem efeito: a luz fica no ambiente,
 * ao redor dele.
 *
 * O recorte entre a janela e o cursor é uma máscara, como no original: o vão
 * é transparente, não pintado com a cor do fundo.
 *
 * A piscadinha é a mesma na intro e na logo do site: `wink` é um contador e
 * cada incremento dispara uma piscada do olho direito. Os keyframes vivem em
 * `.decalq-olho.piscadinha` (base.css).
 */
const CURSOR =
  "M151 76 L217 109 L215 117 L198 124 L211 141 L211 150 L200 157 L182 139 L171 158 L162 158 L148 90 L147 80 L150 77 Z";
const GIRO = "translate(86 77) rotate(-9)";

export function BrandSymbol({
  className = "",
  wink = 0,
  width = 54,
  height = 36,
}: {
  className?: string;
  /** contador: cada incremento dispara uma piscadinha (um olho só) */
  wink?: number;
  width?: number;
  height?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const grad = `decalq-grad-${uid}`;
  const mask = `decalq-mask-${uid}`;

  return (
    <svg
      className={`decalq ${className}`.trim()}
      viewBox="0 0 239 160"
      width={width}
      height={height}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8cbaff" />
          <stop offset="1" stopColor="#5697f8" />
        </linearGradient>
        {/* buracos da janela (corpo + três bolinhas) e o vão do cursor */}
        <mask
          id={mask}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="239"
          height="160"
        >
          <rect width="239" height="160" fill="#fff" />
          <g transform={GIRO} fill="#000">
            <rect x="-64.84" y="-31" width="138.61" height="84" rx="9" />
            <circle cx="-50.8" cy="-49.75" r="6.5" />
            <circle cx="-28.45" cy="-49.75" r="6.5" />
            <circle cx="-6.5" cy="-49.75" r="6.5" />
          </g>
          <path
            d={CURSOR}
            fill="#000"
            stroke="#000"
            strokeWidth="18"
            strokeLinejoin="round"
          />
        </mask>
      </defs>

      <g fill={`url(#${grad})`}>
        <g mask={`url(#${mask})`}>
          <g transform={GIRO}>
            <rect x="-79.65" y="-68.51" width="165.28" height="137.3" rx="16" />
          </g>
        </g>

        <g
          transform={GIRO}
          fill="none"
          stroke={`url(#${grad})`}
          strokeWidth="11"
          strokeLinecap="round"
        >
          <path
            className="decalq-olho"
            d="M-38.4 10.75 A 14 14 0 0 1 -10.68 10.75"
          />
          {/* Só este olho pisca. A `key` muda a cada incremento para a
              animação recomeçar do zero mesmo que a anterior ainda esteja
              rodando: remontar o path é o jeito mais simples de reiniciá-la. */}
          <path
            key={wink}
            className={`decalq-olho ${wink > 0 ? "piscadinha" : ""}`}
            d="M17.6 9.95 A 14 14 0 0 1 45.32 9.95"
          />
        </g>

        <g>
          <path
            d={CURSOR}
            stroke={`url(#${grad})`}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <g
            stroke={`url(#${grad})`}
            strokeWidth="13.5"
            strokeLinecap="round"
          >
            <path d="M200.25 40.75 L192.75 62.25" />
            <path d="M211.75 78.25 L231.25 65.75" />
          </g>
        </g>
      </g>
    </svg>
  );
}
