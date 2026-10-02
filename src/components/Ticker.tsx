"use client";
import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { services } from "@/data/services";
import { technologyGroups } from "@/data/technologies";
import { useReducedMotion } from "./Motion";
import { MotionToggle } from "./MotionToggle";

/**
 * Duas faixas contínuas de serviços e tecnologias reais, em velocidades e
 * sentidos diferentes. Cada trilho contém o mesmo grupo duas vezes e anima de
 * translateX(0) a translateX(-50%): como -50% da própria largura equivale
 * exatamente a uma cópia, o reinício cai em cima do estado inicial e não há
 * salto, vão nem corte.
 *
 * O movimento é AUTOMÁTICO e não depende de scroll, hover ou de o visitante
 * fazer nada. Quem manda é `data-run` neste elemento (e não uma regra
 * `@media` solta, que já foi sobrescrita por ordem de import uma vez).
 *
 * Com movimento reduzido a faixa fica parada e, no lugar do botão de pausa,
 * aparece o interruptor do site — é aqui que o visitante costuma notar que
 * algo está estático, então é aqui que ele pode ligar o movimento.
 */
function Row({
  items,
  reverse = false,
  speed,
}: {
  items: string[];
  reverse?: boolean;
  speed: number;
}) {
  return (
    <div
      className={`ticker-row ${reverse ? "is-reverse" : ""}`}
      style={{ "--speed": `${speed}s` } as React.CSSProperties}
    >
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="ticker-group"
            /* a segunda cópia existe só para o loop: some para leitores de tela */
            aria-hidden={copy === 1 ? "true" : undefined}
          >
            {items.map((item) => (
              <li className="ticker-item" key={item}>
                <i aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function Ticker() {
  const reduced = useReducedMotion();
  const [pausado, setPausado] = useState(false);
  const rodando = !reduced && !pausado;

  const servicos = services.map((s) => s.title);
  const tecnologias = technologyGroups.flatMap((g) => g.items);

  return (
    <section
      className="ticker"
      data-run={rodando ? "true" : "false"}
      aria-label="Serviços e tecnologias"
    >
      <Row items={[...servicos, ...tecnologias]} speed={52} />
      <Row items={[...tecnologias, ...servicos]} reverse speed={74} />
      <div className="ticker-foot">
        {reduced ? (
          <>
            <p className="ticker-nota">
              Movimento reduzido: a faixa está parada.
            </p>
            <MotionToggle compacto />
          </>
        ) : (
          <button
            type="button"
            className="ticker-toggle"
            onClick={() => setPausado((v) => !v)}
          >
            {pausado ? (
              <Play size={14} aria-hidden="true" />
            ) : (
              <Pause size={14} aria-hidden="true" />
            )}
            <span>{pausado ? "Retomar movimento" : "Pausar movimento"}</span>
          </button>
        )}
      </div>
    </section>
  );
}
