"use client";
import Lenis from "lenis";
import { useEffect } from "react";
import { useReducedMotion } from "./Motion";

/**
 * Scroll suave global (uma única instância). O Lenis rola a janela nativa,
 * então `useScroll` do Framer e os IntersectionObservers continuam lendo o
 * scroll real, inclusive na faixa horizontal presa. Desativado com
 * `prefers-reduced-motion`; no toque o scroll permanece nativo.
 *
 * Âncoras dentro da mesma página rolam suavemente, compensando o menu fixo.
 * Trocar de âncora não muda o pathname, então a intro não reinicia.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    const lenis = reduced
      ? null
      : new Lenis({
          lerp: 0.1,
          smoothWheel: true,
          syncTouch: false,
          autoRaf: true,
          stopInertiaOnNavigate: true,
        });

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const anchor = (event.target as Element | null)?.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.classList.contains("skip-link")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.getElementById(
        decodeURIComponent(url.hash.slice(1)),
      );
      if (!target) return;
      event.preventDefault();
      if (lenis) {
        // A compensação sai do mesmo token do CSS, então cabeçalho e âncora
        // não saem de sincronia quando a altura da cápsula muda.
        const h = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-h",
          ),
        );
        lenis.scrollTo(target, { offset: -(h || 78) - 16, duration: 1.2 });
      } else {
        // Sem Lenis (movimento reduzido): salto direto, mas `scroll-padding-top`
        // no <html> garante que a âncora pare abaixo do cabeçalho.
        target.scrollIntoView({ block: "start" });
      }
      window.history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis?.destroy();
    };
  }, [reduced]);

  return null;
}
