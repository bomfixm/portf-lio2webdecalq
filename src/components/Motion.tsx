"use client";
import {
  createElement,
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";

/* ---------------------------------------------------------------------------
   Tokens de movimento compartilhados (CSS usa os mesmos em tokens.css).
   --------------------------------------------------------------------------- */
export const EASE = [0.16, 1, 0.3, 1] as const;
export const DUR = { micro: 0.2, base: 0.45, reveal: 0.8, slow: 1.1 } as const;

const noopSubscribe = () => () => {};

/**
 * useMediaQuery sem divergência de hidratação: servidor e primeira
 * renderização do cliente usam `fallback`; o valor real entra em seguida.
 */
export function useMediaQuery(query: string, fallback = false): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

/** `true` só depois da hidratação: para portais e APIs de DOM. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Mouse com hover de verdade (não toque). */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/* ---------------------------------------------------------------------------
   Reveal — entradas por scroll feitas em CSS.

   O estado padrão é VISÍVEL. O CSS só esconde (`html.js` + sem movimento
   reduzido) o que ainda não recebeu `data-in`, e o observador abaixo entrega
   esse atributo. Se o JS falhar, `html.js` nunca existe e nada some; se o
   observador falhar, o temporizador de segurança revela tudo.
   --------------------------------------------------------------------------- */
let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.in = "true";
          observer?.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
  }
  return observer;
}

export type RevealVariant =
  | "up"
  | "fade"
  | "scale"
  | "blur"
  | "left"
  | "right"
  | "mask";

export function useRevealRef<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = getObserver();
    if (!io) {
      el.dataset.in = "true";
      return;
    }
    io.observe(el);
    // Segurança: se algo impedir o gatilho, o conteúdo aparece mesmo assim.
    const timer = window.setTimeout(() => {
      el.dataset.in = "true";
    }, 6000);
    return () => {
      window.clearTimeout(timer);
      io.unobserve(el);
    };
  }, []);
  return ref;
}

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
  as = "div",
  style,
}: {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  as?: string;
  style?: CSSProperties;
}) {
  const ref = useRevealRef<HTMLElement>();
  return createElement(
    as,
    {
      ref,
      className: `reveal ${className}`.trim(),
      "data-reveal": variant,
      style: { ...style, "--d": `${delay}s` } as CSSProperties,
    },
    children,
  );
}

/**
 * Título em linhas: cada linha sobe de dentro de uma máscara. Cada item de
 * `lines` é uma linha; as quebras são decididas aqui, não pelo navegador.
 */
export function Lines({
  lines,
  as = "h2",
  className = "",
  delay = 0,
  id,
}: {
  lines: ReactNode[];
  as?: string;
  className?: string;
  delay?: number;
  id?: string;
}) {
  const ref = useRevealRef<HTMLElement>();
  return createElement(
    as,
    {
      ref,
      id,
      className: `lines ${className}`.trim(),
      "data-reveal": "lines",
      style: { "--d": `${delay}s` } as CSSProperties,
    },
    lines.map((line, i) => (
      <span className="line" key={i} style={{ "--i": i } as CSSProperties}>
        <span>{line}</span>
      </span>
    )),
  );
}
