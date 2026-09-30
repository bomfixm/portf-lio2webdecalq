"use client";
import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Project } from "@/types/project";
import { Button } from "./Button";
import { Reveal, useReducedMotion } from "./Motion";

/**
 * Três painéis grandes, lado a lado no desktop. Referência: as telas de loja
 * do moodboard: moldura clara arredondada, painel saturado por dentro, título
 * enorme no topo e a captura real "sangrando" pela borda de baixo, em escala
 * em que a interface ainda é reconhecível. Cada painel tem enquadramento
 * próprio (tom, altura e posição das capturas).
 *
 * As capturas andam em velocidades diferentes com o scroll (parallax); com
 * movimento reduzido ficam paradas.
 */
function Panel({ project: p, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yDesk = useTransform(scrollYProgress, [0, 1], [46, -46]);
  const yPhone = useTransform(scrollYProgress, [0, 1], [-30, 60]);
  const claro = p.panelTone === "light";
  const num = String(index + 1).padStart(2, "0");

  return (
    <Reveal
      variant="up"
      delay={index * 0.12}
      className={`panel-slot slot-${index + 1}`}
    >
      <article
        ref={ref}
        className={`panel tone-${p.panelTone} ${claro ? "on-light" : ""}`}
        style={{ "--i": index } as CSSProperties}
      >
        <div className="panel-body">
          <header className="panel-head">
            <div className="panel-tags">
              <span className="panel-num">{num}</span>
              <span className="chip chip-static">{p.label}</span>
            </div>
            <h3 className="panel-title">{p.headline}</h3>
          </header>

          <div className="panel-meta">
            <div>
              <h4>{p.title}</h4>
              <p>{p.shortDescription}</p>
            </div>
            <Button
              href={`/projetos/${p.slug}/`}
              variant={claro ? "azul" : "luz"}
              size="md"
            >
              Conhecer o case
            </Button>
          </div>

          <div className="panel-stage" aria-hidden="false">
            <motion.div
              className="shot shot-desktop"
              style={reduced ? undefined : { y: yDesk }}
            >
              <Image
                src={p.desktop.src}
                alt={p.desktop.alt}
                width={p.desktop.width}
                height={p.desktop.height}
                sizes="(max-width: 900px) 92vw, 34vw"
              />
            </motion.div>
            <motion.div
              className="shot shot-phone"
              style={reduced ? undefined : { y: yPhone }}
            >
              <div className="phone">
                <Image
                  src={p.mobile.src}
                  alt={p.mobile.alt}
                  width={p.mobile.width}
                  height={p.mobile.height}
                  sizes="(max-width: 900px) 46vw, 15vw"
                />
              </div>
            </motion.div>
            <ul className="panel-techs" aria-label="Tecnologias">
              {p.technologies.slice(0, 3).map((t, i) => (
                <li
                  key={t}
                  className="chip chip-static float"
                  style={{ "--k": i } as CSSProperties}
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function ProjectPanels({ projects }: { projects: Project[] }) {
  return (
    <div className="panels">
      {projects.map((p, i) => (
        <Panel key={p.slug} project={p} index={i} />
      ))}
    </div>
  );
}
