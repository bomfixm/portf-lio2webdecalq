import { useId } from "react";
import type { ServiceIcon as Name } from "@/types/content";

/**
 * Família de ícones dos serviços. Referência: os seis ícones luminosos do
 * moodboard. Todos partem da mesma regra de desenho: grade de 64px, traço de
 * 3,5px com pontas arredondadas, contorno em degradê e preenchimento que
 * clareia de cima para baixo. A luz é `drop-shadow` na cor do próprio ícone.
 */
const tones: Record<Name, [string, string]> = {
  web: ["#8ec0ff", "#3f74f2"],
  sistemas: ["#c3a8ff", "#7a4dff"],
  automacao: ["#8beeff", "#2fb3f2"],
  python: ["#b5dcff", "#4f9cff"],
  dados: ["#7ff5dc", "#1fb2e6"],
  social: ["#b9a5ff", "#5b4bff"],
};

export function ServiceIcon({
  name,
  size = 64,
  className = "",
}: {
  name: Name;
  size?: number;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const [a, b] = tones[name];
  const stroke = `si-s-${uid}`;
  const fill = `si-f-${uid}`;

  return (
    <svg
      className={`svc-icon ${className}`.trim()}
      style={{ "--ic": b } as React.CSSProperties}
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill={`url(#${fill})`}
      stroke={`url(#${stroke})`}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={stroke} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <linearGradient id={fill} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={b} stopOpacity="0.04" />
          <stop offset="1" stopColor={b} stopOpacity="0.42" />
        </linearGradient>
      </defs>
      {name === "web" && (
        <>
          <rect x="7" y="11" width="50" height="42" rx="11" />
          <path d="M7 24h50" fill="none" />
          <circle cx="17" cy="17.5" r="2" fill={a} stroke="none" />
          <circle cx="24.5" cy="17.5" r="2" fill={a} stroke="none" />
          <path d="M17 34h16M17 42h26" fill="none" />
        </>
      )}
      {name === "sistemas" && (
        <>
          <circle cx="40" cy="24" r="15" />
          <rect x="9" y="26" width="30" height="30" rx="9" />
        </>
      )}
      {name === "automacao" && (
        <>
          <rect x="8" y="8" width="18" height="18" rx="6" />
          <rect x="38" y="38" width="18" height="18" rx="6" />
          <path d="M17 26v6a12 12 0 0 0 12 12h9" fill="none" />
          <path d="M33 39.5l5.5 4.5-5.5 4.5" fill="none" />
        </>
      )}
      {name === "python" && (
        <>
          <rect x="7" y="11" width="50" height="42" rx="11" />
          <path d="M23 26l-8 6 8 6M41 26l8 6-8 6M35 23l-6 18" fill="none" />
        </>
      )}
      {name === "dados" && (
        <>
          <rect x="11" y="33" width="10" height="17" rx="4" />
          <rect x="27" y="22" width="10" height="28" rx="4" />
          <rect x="43" y="10" width="10" height="40" rx="4" />
          <path d="M8 56h48" fill="none" />
        </>
      )}
      {name === "social" && (
        <>
          <rect x="17" y="5" width="30" height="54" rx="9" />
          <path d="M28 12h8" fill="none" />
          <path d="M28 24.5v15l13-7.5z" />
        </>
      )}
    </svg>
  );
}
