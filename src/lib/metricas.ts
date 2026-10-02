import { track } from "@vercel/analytics";

/**
 * Métricas do portfólio.
 *
 * Coleta: `@vercel/analytics` (Web Analytics da Vercel) — acessos e tempo
 * saem do próprio script; cliques e interesse saem dos eventos abaixo,
 * disparados por `registrarEvento`. A coleta só existe no deploy da Vercel
 * com o Web Analytics ativado no projeto.
 *
 * Leitura: nenhum número é inventado. Enquanto não houver fonte de dados
 * conectada, `carregarMetricas()` devolve `null` e o painel mostra o estado
 * de "aguardando dados". Contador guardado no navegador do visitante não
 * vira métrica: não mede audiência nenhuma.
 */

export interface Metrica {
  id: string;
  titulo: string;
  /** O que exatamente este número conta. */
  significado: string;
  /** O que ele NÃO prova, para não ler mais do que o dado permite. */
  limite?: string;
  /** de onde o dado vem quando a coleta estiver ativa */
  fonte: string;
}

/** Período coberto pelos números, quando houver fonte conectada. */
export const PERIODO = "últimos 30 dias";

export const metricas: Metrica[] = [
  {
    id: "acessos",
    titulo: "Acessos",
    significado: "Visitantes e visualizações de página no período.",
    fonte: "Web Analytics (automático)",
  },
  {
    id: "cliques",
    titulo: "Cliques em ações",
    significado: "Cliques em botões e links do site, separados por destino.",
    fonte: "Eventos personalizados",
  },
  {
    id: "tempo",
    titulo: "Tempo médio",
    significado: "Quanto tempo a aba ficou aberta e ativa, em média, por visita.",
    limite: "Aba aberta não significa leitura.",
    fonte: "Web Analytics",
  },
  {
    id: "interesse",
    titulo: "Interesse nos projetos",
    significado:
      "Aberturas de páginas de case e cliques em “Visitar o site”.",
    fonte: "Eventos: projeto_visitar",
  },
  {
    id: "whatsapp_clique",
    titulo: "Cliques de contato",
    significado: "Quantas vezes um botão de WhatsApp foi acionado.",
    limite:
      "É um clique. O site não confirma se a mensagem foi enviada, nem se virou contratação: isso acontece fora dele.",
    fonte: "Eventos: whatsapp_clique",
  },
];

export type ValoresMetricas = Record<string, string>;

/**
 * Fonte de dados do painel. Retorna `null` enquanto nenhuma integração de
 * leitura estiver configurada — é o que mantém o painel honesto.
 */
export async function carregarMetricas(): Promise<ValoresMetricas | null> {
  return null;
}

/** Único ponto de instrumentação do site. Inerte fora da Vercel. */
export function registrarEvento(id: string, dados?: Record<string, string>) {
  try {
    track(id, dados);
  } catch {
    /* coleta indisponível: o site segue funcionando */
  }
}
