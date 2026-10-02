"use client";
import { useSyncExternalStore } from "react";

/**
 * De onde o visitante veio, quando o link carrega `?origem=`.
 *
 * O parâmetro fica guardado na aba para sobreviver à navegação interna: quem
 * abre `/?origem=whatsapp` e depois vai até Contato continua reconhecido.
 * É só isso — o site não descobre nada sozinho sobre quem está do outro lado.
 */
const CHAVE = "decalq:origem";
const EVENTO = "decalq:origem-mudou";

let cache: string | null = null;
let lido = false;

function daUrl(): string | null {
  try {
    return new URLSearchParams(window.location.search).get("origem");
  } catch {
    return null;
  }
}

function daSessao(): string | null {
  try {
    return sessionStorage.getItem(CHAVE);
  } catch {
    return null; // sessionStorage bloqueado: vale só a URL atual
  }
}

/** Leitura pura: pode rodar durante a renderização, não escreve nada. */
function atual(): string | null {
  if (!lido) {
    cache = daUrl() ?? daSessao();
    lido = true;
  }
  return cache;
}

/** Persiste a origem da URL atual. Chamado a cada troca de rota. */
export function guardarOrigem(): void {
  const antes = atual();
  const url = daUrl();
  if (url) {
    try {
      sessionStorage.setItem(CHAVE, url);
    } catch {
      /* sem sessionStorage: vale enquanto a página não recarregar */
    }
    cache = url;
  }
  if (cache !== antes) window.dispatchEvent(new Event(EVENTO));
}

const assinar = (cb: () => void) => {
  window.addEventListener(EVENTO, cb);
  return () => window.removeEventListener(EVENTO, cb);
};

export function useOrigem(): string | null {
  return useSyncExternalStore(assinar, atual, () => null);
}
