"use client";

/**
 * Transição entre rotas, parte de saída.
 *
 * `marcarSaida()` (no clique de um link interno) liga `data-leaving` no
 * <html>; o CSS escurece o que está saindo. `encerrarSaida()` (na montagem da
 * rota nova) desliga.
 *
 * A rota nova costuma montar em poucos milissegundos, porque o Next já
 * pré-carregou a página: sem um piso de duração o fade de saída existia no
 * código e não aparecia na tela. Daí o `MINIMO`.
 */
const MINIMO = 150;
const LIMITE = 1200;

let inicio = 0;
let timerSaida = 0;
let timerLimite = 0;

const raiz = () => document.documentElement;

export function marcarSaida(): void {
  inicio = performance.now();
  window.clearTimeout(timerSaida);
  window.clearTimeout(timerLimite);
  raiz().dataset.leaving = "true";
  /* Rede de segurança: se a navegação não acontecer (link cancelado, destino
     que não troca de rota), a página não fica escurecida para sempre. */
  timerLimite = window.setTimeout(() => {
    delete raiz().dataset.leaving;
  }, LIMITE);
}

export function encerrarSaida(): void {
  if (!raiz().dataset.leaving) return;
  const decorrido = performance.now() - inicio;
  const espera = Math.max(0, MINIMO - decorrido);
  window.clearTimeout(timerSaida);
  timerSaida = window.setTimeout(() => {
    window.clearTimeout(timerLimite);
    delete raiz().dataset.leaving;
  }, espera);
}
