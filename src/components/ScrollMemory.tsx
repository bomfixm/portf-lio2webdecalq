"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { markInternalNavigation } from "@/lib/history";
import { marcarSaida } from "@/lib/transicao";

/**
 * Memória de scroll por rota.
 *
 * Cobre os dois tipos de volta:
 *  - documento recriado (voltar de um site externo, recarregar) — detectado
 *    pelo tipo de navegação `back_forward`;
 *  - navegação client-side (voltar do visualizador de um projeto) — detectada
 *    pelo evento `popstate`.
 *
 * A posição é registrada no instante do clique (antes de a rota mudar) e ao
 * sair do documento; nunca depois, para não gravar o zero da transição.
 * A restauração só acontece com a página no topo, para não competir com a
 * restauração nativa do navegador ou do Next quando elas funcionam.
 */
const key = (path: string) => `decalq:scroll:${path}`;
let booted = false;
let cameFromHistory = false;

export function ScrollMemory() {
  const pathname = usePathname();

  useEffect(() => {
    const save = () => {
      try {
        sessionStorage.setItem(key(pathname), String(Math.round(scrollY)));
      } catch {
        /* sessionStorage indisponível: sem persistência, sem erro */
      }
    };
    // Captura: roda antes do handler do Next, com o scroll ainda no lugar.
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return; // abre em outra aba: a rota atual continua onde está
      const anchor = (event.target as Element | null)?.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      save();
      try {
        const url = new URL(anchor.href, location.href);
        if (
          url.origin === location.origin &&
          url.pathname !== location.pathname
        ) {
          markInternalNavigation();
          // Saída da transição de rota; o `template` da rota nova encerra.
          marcarSaida();
        }
      } catch {
        /* href inválido: nada a marcar */
      }
    };
    const onPop = () => {
      cameFromHistory = true;
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("pagehide", save);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pagehide", save);
      window.removeEventListener("popstate", onPop);
    };
  }, [pathname]);

  useEffect(() => {
    const firstLoad = !booted;
    booted = true;
    if (firstLoad) {
      const entry = performance.getEntriesByType("navigation")[0] as
        PerformanceNavigationTiming | undefined;
      if (entry?.type !== "back_forward") return;
    } else if (!cameFromHistory) {
      return; // navegação normal: o topo é o comportamento certo
    }
    cameFromHistory = false;

    let saved = 0;
    try {
      saved = Number(sessionStorage.getItem(key(pathname)) ?? 0);
    } catch {
      saved = 0;
    }
    if (saved <= 0) return;

    const apply = () => {
      if (scrollY < 2) scrollTo(0, saved);
    };
    const frame = requestAnimationFrame(() => requestAnimationFrame(apply));
    // segunda tentativa quando fontes/imagens terminam e a altura muda
    window.addEventListener("load", apply, { once: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", apply);
    };
  }, [pathname]);

  return null;
}
