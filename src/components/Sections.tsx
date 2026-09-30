import type { ReactNode } from "react";
import { content } from "@/data/content";
import { processSteps } from "@/data/services";
import { technologyGroups } from "@/data/technologies";
import { Lines, Reveal } from "./Motion";

/** Cabeçalho de seção: rótulo, título em linhas, descrição e ação opcional. */
export function SectionHead({
  eyebrow,
  lines,
  description,
  children,
  id,
}: {
  eyebrow: string;
  lines: ReactNode[];
  description?: string;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <header className="shead">
      <div className="shead-main">
        <Reveal variant="fade">
          <div className="eyebrow">{eyebrow}</div>
        </Reveal>
        <Lines as="h2" className="h-2" lines={lines} id={id} delay={0.05} />
      </div>
      {(description || children) && (
        <Reveal variant="up" delay={0.2} className="shead-side">
          {description && <p className="lead">{description}</p>}
          {children}
        </Reveal>
      )}
    </header>
  );
}

/** Essência: afirmação grande e o parágrafo de apoio. */
export function Essence() {
  const c = content.intro;
  return (
    <section className="essence container section">
      <Reveal variant="fade">
        <div className="eyebrow">{c.eyebrow}</div>
      </Reveal>
      <Lines
        as="h2"
        className="essence-title h-1"
        delay={0.05}
        lines={[c.title, <span className="muted" key="s">{c.subtitle}</span>]}
      />
      <Reveal variant="left" delay={0.25} className="essence-text">
        <p className="lead">{c.description}</p>
      </Reveal>
    </section>
  );
}

/** Como trabalhamos: painel claro para quebrar o ritmo escuro da página. */
export function Process() {
  return (
    <section className="container section process-wrap" aria-labelledby="processo-titulo">
      <Reveal variant="scale">
        <div className="process on-light">
          <header className="process-head">
            <div className="eyebrow">Como trabalhamos</div>
            <h2 id="processo-titulo" className="h-2">
              Do problema à entrega, em quatro passos.
            </h2>
          </header>
          <ol className="process-steps">
            {processSteps.map((s, i) => (
              <li key={s.title}>
                <span className="process-num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  );
}

/** Tecnologias reais, em grupos. */
export function Technologies() {
  return (
    <section className="container section tech" id="tecnologias">
      <SectionHead
        eyebrow="Tecnologias"
        lines={["Ferramentas", <span className="grad-text" key="g">de verdade.</span>]}
        description="O que usamos no dia a dia, escolhido a partir do problema e não do hábito."
      />
      <div className="tech-grid">
        {technologyGroups.map((g, i) => (
          <Reveal key={g.title} variant="up" delay={i * 0.08}>
            <div className="tech-card">
              <h3>{g.title}</h3>
              <p>{g.description}</p>
              <ul>
                {g.items.map((t) => (
                  <li key={t} className="chip chip-static">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
