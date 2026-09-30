"use client";
import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { services } from "@/data/services";
import { technologyGroups } from "@/data/technologies";
import { useReducedMotion } from "./Motion";

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
 * `prefers-reduced-motion` é preservado: nesse caso a faixa NÃO começa a
 * andar sozinha e o botão passa a ser um convite ("Ativar movimento"). Se o
 * visitante ativar, ela anda mais devagar (`data-calm`) em vez de não existir.
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
  /* null = ninguém escolheu ainda, então vale a preferência do sistema.
     Ajuste automático depois da hidratação, sem efeito no meio. */
  const [escolha, setEscolha] = useState<boolean | null>(null);
  const rodando = escolha ?? !reduced;

  const servicos = services.map((s) => s.title);
  const tecnologias = technologyGroups.flatMap((g) => g.items);

  const rotulo = rodando
    ? "Pausar movimento"
    : reduced
      ? "Ativar movimento"
      : "Retomar movimento";

  return (
    <section
      className="ticker"
      data-run={rodando ? "true" : "false"}
      data-calm={reduced ? "true" : undefined}
      aria-label="Serviços e tecnologias"
    >
      <Row items={[...servicos, ...tecnologias]} speed={52} />
      <Row items={[...tecnologias, ...servicos]} reverse speed={74} />
      <div className="ticker-foot">
        {reduced && !rodando && (
          <p className="ticker-nota">
            Seu sistema pede movimento reduzido, então a faixa está parada.
          </p>
        )}
        <button
          type="button"
          className="ticker-toggle"
          onClick={() => setEscolha(!rodando)}
        >
          {rodando ? (
            <Pause size={14} aria-hidden="true" />
          ) : (
            <Play size={14} aria-hidden="true" />
          )}
          <span>{rotulo}</span>
        </button>
      </div>
    </section>
  );
}
