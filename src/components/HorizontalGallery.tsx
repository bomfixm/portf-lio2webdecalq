"use client";
import Link from "next/link";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { useMediaQuery, useReducedMotion } from "./Motion";

/**
 * "Outros cases em movimento".
 *
 * Desktop (≥ 900px, sem movimento reduzido): a seção ganha altura extra
 * (100vh + distância) e o viewport fica sticky; o progresso vertical da seção
 * vira translateX do trilho. A distância é MEDIDA no conteúdo real
 * (scrollWidth − clientWidth) e recalculada em resize, então o último card
 * termina totalmente visível antes de a página voltar ao fluxo normal. Nada
 * de preventDefault no wheel: o scroll continua sendo o do navegador.
 *
 * Celular, tablet e movimento reduzido: carrossel nativo com swipe,
 * scroll-snap e botões anterior/próximo.
 */
export function HorizontalGallery({
  projects,
  eyebrow,
  title,
  description,
}: {
  projects: Project[];
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
}) {
  const outer = useRef<HTMLElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const largo = useMediaQuery("(min-width: 900px)");
  const reduced = useReducedMotion();
  const pinned = largo && !reduced;
  const [distance, setDistance] = useState(0);
  const [pos, setPos] = useState({ inicio: true, fim: false });

  useEffect(() => {
    if (!pinned) return;
    const trackEl = track.current;
    const stickyEl = sticky.current;
    if (!trackEl || !stickyEl) return;
    const measure = () =>
      setDistance(Math.max(0, trackEl.scrollWidth - stickyEl.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackEl);
    ro.observe(stickyEl);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned, projects.length]);

  const { scrollYProgress } = useScroll({
    target: outer,
    offset: ["start start", "end end"],
  });
  const eased = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.3,
  });
  const x = useTransform(eased, (p) => (pinned ? -p * distance : 0));

  // carrossel: estado dos botões conforme a posição
  const atualizar = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setPos({
      inicio: el.scrollLeft < 8,
      fim: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    });
  }, []);
  useEffect(() => {
    if (pinned) return;
    atualizar();
  }, [pinned, atualizar]);

  const passo = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".hgal-item");
    const largura = (card?.offsetWidth ?? el.clientWidth * 0.8) + 20;
    el.scrollBy({ left: dir * largura, behavior: reduced ? "auto" : "smooth" });
  };

  const intro = (
    <div className="hgal-intro">
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="h-2">{title}</h2>
      {description && <p className="lead">{description}</p>}
      {pinned ? (
        <span className="hgal-hint" aria-hidden="true">
          Continue rolando <ArrowRight size={15} />
        </span>
      ) : (
        <div className="hgal-controls">
          <button
            type="button"
            className="hgal-btn"
            onClick={() => passo(-1)}
            disabled={pos.inicio}
            aria-label="Cases anteriores"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            type="button"
            className="hgal-btn"
            onClick={() => passo(1)}
            disabled={pos.fim}
            aria-label="Próximos cases"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );

  const items = projects.map((p, i) => (
    <div key={p.id} className="hgal-item">
      <ProjectCard
        project={p}
        counter={`${String(i + 4).padStart(2, "0")} / ${String(projects.length + 3).padStart(2, "0")}`}
      />
    </div>
  ));

  const fim = (
    <div className="hgal-end">
      <Link href="/projetos/" className="hgal-all">
        <span>Ver todos os projetos</span>
        <ArrowUpRight size={24} />
      </Link>
    </div>
  );

  return (
    <section
      ref={outer}
      className={`hgal ${pinned ? "is-pinned" : ""}`}
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
      aria-label="Mais projetos"
    >
      <div className="hgal-sticky" ref={sticky}>
        {pinned ? (
          <motion.div ref={track} className="hgal-track" style={{ x }}>
            {intro}
            {items}
            {fim}
          </motion.div>
        ) : (
          <div
            ref={scroller}
            className="hgal-scroller"
            tabIndex={0}
            role="region"
            aria-label="Carrossel de cases"
            onScroll={atualizar}
          >
            <div className="hgal-track">
              {intro}
              {items}
              {fim}
            </div>
          </div>
        )}
        {pinned && (
          <div className="hgal-progress" aria-hidden="true">
            <motion.div
              className="hgal-progress-fill"
              style={{ scaleX: eased }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
