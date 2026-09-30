"use client";

/**
 * Sinaliza se existe, no histórico, uma entrada nossa para onde voltar.
 *
 * `document.referrer` não serve para isso: em navegação client-side ele
 * continua sendo o do documento inicial. Aqui contamos as navegações internas
 * de fato realizadas na sessão (marcadas por `ScrollMemory` ao interceptar os
 * cliques em links do próprio site).
 */
let internalNavigations = 0;

export function markInternalNavigation() {
  internalNavigations += 1;
}

export function canGoBackInternally() {
  return internalNavigations > 0 && window.history.length > 1;
}
