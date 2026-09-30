"use client";
import { useCallback } from "react";

/**
 * Handler que grava a posição do ponteiro (relativa ao elemento) nas
 * variáveis CSS --mx/--my. Usado por botões, cards e superfícies com
 * iluminação local. Ignora toque: no mobile o efeito fica desativado.
 */
export function usePointerVars<T extends HTMLElement>() {
  return useCallback((event: React.PointerEvent<T>) => {
    if (event.pointerType !== "mouse") return;
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }, []);
}
