"use client";
import { useCallback, useSyncExternalStore } from "react";

/**
 * Preferência de movimento do site. Fonte única, lida pelo React E pelo CSS.
 *
 * Como funciona:
 *  - por padrão vale o sistema (`prefers-reduced-motion`);
 *  - se o visitante escolher, a escolha dele vence e fica guardada neste
 *    navegador (`localStorage`);
 *  - o modo efetivo é publicado em `<html data-motion="completo|calmo">`,
 *    definido antes da primeira pintura pelo script em `app/layout.tsx`.
 *
 * Todo o CSS de animação condiciona a `html[data-motion="completo"]`, e todo
 * componente pergunta por `useReducedMotion()`. Assim não existe um segundo
 * lugar decidindo a mesma coisa — foi uma regra `@media` duplicada em outro
 * arquivo que já produziu um botão de pausa sobre uma faixa parada.
 */
export type Movimento = "completo" | "calmo";

const CHAVE = "decalq:movimento";
const EVENTO = "decalq:movimento-mudou";
const CONSULTA = "(prefers-reduced-motion: reduce)";

function escolhaSalva(): Movimento | null {
  try {
    const v = localStorage.getItem(CHAVE);
    return v === "completo" || v === "calmo" ? v : null;
  } catch {
    return null; // localStorage bloqueado: vale a preferência do sistema
  }
}

export function sistemaPedeCalmo(): boolean {
  try {
    return window.matchMedia(CONSULTA).matches;
  } catch {
    return false;
  }
}

/** Modo em vigor: a escolha do visitante, ou o que o sistema pede. */
function modoAtual(): Movimento {
  return (escolhaSalva() ?? (sistemaPedeCalmo() ? "calmo" : "completo")) as Movimento;
}

function publicar(modo: Movimento) {
  try {
    document.documentElement.dataset.motion = modo;
  } catch {
    /* sem DOM: nada a publicar */
  }
}

/** Define o modo (ou volta a seguir o sistema, com `null`). */
export function definirMovimento(modo: Movimento | null) {
  try {
    if (modo) localStorage.setItem(CHAVE, modo);
    else localStorage.removeItem(CHAVE);
  } catch {
    /* sem persistência: vale só nesta página */
  }
  publicar(modo ?? (sistemaPedeCalmo() ? "calmo" : "completo"));
  window.dispatchEvent(new Event(EVENTO));
}

function assinar(cb: () => void) {
  window.addEventListener(EVENTO, cb);
  const mq = window.matchMedia(CONSULTA);
  // se o visitante não escolheu nada, mudar a preferência do sistema reflete na hora
  const aoMudar = () => {
    if (!escolhaSalva()) publicar(mq.matches ? "calmo" : "completo");
    cb();
  };
  mq.addEventListener("change", aoMudar);
  return () => {
    window.removeEventListener(EVENTO, cb);
    mq.removeEventListener("change", aoMudar);
  };
}

export interface EstadoMovimento {
  modo: Movimento;
  calmo: boolean;
  /** o sistema pede movimento reduzido? (para explicar o padrão ao visitante) */
  sistemaCalmo: boolean;
  /** o visitante já escolheu manualmente? */
  escolheu: boolean;
}

/**
 * O snapshot do servidor (e da primeira renderização do cliente) é "completo",
 * igual ao antigo `useMediaQuery(..., false)`: mantém a hidratação sem
 * divergência, e o valor real entra logo depois. Quem evita piscada visual é
 * o `data-motion` escrito antes da pintura.
 */
export function useMovimento(): EstadoMovimento & {
  alternar: () => void;
  seguirSistema: () => void;
} {
  const modo = useSyncExternalStore(
    assinar,
    modoAtual,
    () => "completo" as Movimento,
  );
  const sistemaCalmo = useSyncExternalStore(
    assinar,
    sistemaPedeCalmo,
    () => false,
  );
  const escolheu = useSyncExternalStore(
    assinar,
    () => escolhaSalva() !== null,
    () => false,
  );

  const alternar = useCallback(() => {
    definirMovimento(modoAtual() === "calmo" ? "completo" : "calmo");
  }, []);
  const seguirSistema = useCallback(() => definirMovimento(null), []);

  return {
    modo,
    calmo: modo === "calmo",
    sistemaCalmo,
    escolheu,
    alternar,
    seguirSistema,
  };
}
