import type { ReactNode } from "react";
import { Lines, Reveal } from "./Motion";

/** Cabeçalho das páginas internas: rótulo, título em linhas e descrição. */
export function PageHeading({
  eyebrow,
  lines,
  description,
  className = "",
}: {
  eyebrow: string;
  lines: ReactNode[];
  description?: string;
  className?: string;
}) {
  return (
    <header className={`container phead page-top ${className}`.trim()}>
      <span className="phead-glow" aria-hidden="true" />
      <Reveal variant="fade">
        <div className="eyebrow">{eyebrow}</div>
      </Reveal>
      <Lines as="h1" className="h-1 phead-title" lines={lines} delay={0.05} />
      {description && (
        <Reveal variant="up" delay={0.3}>
          <p className="lead">{description}</p>
        </Reveal>
      )}
    </header>
  );
}
