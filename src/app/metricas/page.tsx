import type { Metadata } from "next";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Motion";
import { carregarMetricas, metricas, PERIODO } from "@/lib/metricas";

export const metadata: Metadata = {
  title: "Métricas",
  description: "Painel de métricas do portfólio da Decalq.",
  robots: { index: false, follow: false },
};

export default async function MetricasPage() {
  const valores = await carregarMetricas();

  return (
    <>
      <PageHeading
        eyebrow="Painel / Métricas do portfólio"
        lines={[
          "O que dá",
          <span className="grad-text" key="g">
            para medir daqui.
          </span>,
        ]}
        description={`Cada número tem um significado exato. Período: ${PERIODO}. Só entram dados coletados ou fornecidos, nunca estimativas.`}
      />

      <div className="container metricas">
        {!valores && (
          <Reveal variant="up">
            <div className="metricas-aviso" role="status">
              <strong>Aguardando dados</strong>
              <p>
                A coleta está instrumentada, mas nenhuma fonte de leitura está
                conectada a este painel, então ele não exibe números. Preferimos
                a lacuna a um número inventado.
              </p>
              <p className="metricas-falta">
                Para ligar, faltam: (1) publicar no projeto da Vercel e ativar o
                Web Analytics nele; (2) esperar as primeiras visitas; (3) apontar{" "}
                <code>carregarMetricas()</code> em <code>src/lib/metricas.ts</code>{" "}
                para uma fonte de leitura (exportação ou API do Analytics).
                Eventos personalizados (cliques de contato e interesse nos
                projetos) exigem plano da Vercel que os inclua.
              </p>
            </div>
          </Reveal>
        )}

        <ul className="metricas-grade">
          {metricas.map((m, i) => (
            <Reveal key={m.id} variant="up" delay={i * 0.06} as="li">
              <article className="metrica">
                <h2>{m.titulo}</h2>
                <p className="metrica-valor" aria-label={valores ? undefined : "Sem dados"}>
                  {valores?.[m.id] ?? "—"}
                </p>
                <p className="metrica-sig">{m.significado}</p>
                {m.limite && <p className="metrica-lim">{m.limite}</p>}
                <p className="metrica-fonte">Fonte: {m.fonte}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </>
  );
}
