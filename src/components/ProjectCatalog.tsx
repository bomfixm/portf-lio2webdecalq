"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { projects } from "@/data/projects";
import { categoryOrder } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { Button } from "./Button";
import { EASE, useReducedMotion } from "./Motion";

const normaliza = (v: string) =>
  v
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/* Filtros derivados dos dados reais: só aparece categoria/tecnologia que tem
   projeto. Trocar o catálogo não exige mexer aqui. */
const categorias = categoryOrder.filter((c) =>
  projects.some((p) => p.category === c),
);
const tecnologias = [...new Set(projects.flatMap((p) => p.technologies))].sort(
  (a, b) => a.localeCompare(b),
);

export function ProjectCatalog() {
  const [categoria, setCategoria] = useState<string>("Todos");
  const [tecnologia, setTecnologia] = useState<string>("");
  const [busca, setBusca] = useState("");
  const reduced = useReducedMotion();

  const filtrados = useMemo(() => {
    const q = normaliza(busca.trim());
    return projects.filter(
      (p) =>
        (categoria === "Todos" || p.category === categoria) &&
        (!tecnologia || p.technologies.includes(tecnologia)) &&
        (!q ||
          normaliza(
            [p.title, p.label, p.category, ...p.technologies].join(" "),
          ).includes(q)),
    );
  }, [categoria, tecnologia, busca]);

  const limpar = () => {
    setCategoria("Todos");
    setTecnologia("");
    setBusca("");
  };
  const filtrando = categoria !== "Todos" || !!tecnologia || !!busca;
  const contar = (c: string) =>
    c === "Todos"
      ? projects.length
      : projects.filter((p) => p.category === c).length;

  return (
    <>
      <div className="cat-controls">
        <label className="field cat-search">
          <Search size={18} aria-hidden="true" />
          <span className="visually-hidden">
            Pesquisar projetos por nome, segmento ou tecnologia
          </span>
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Pesquisar por nome, segmento ou tecnologia"
            autoComplete="off"
          />
          {busca && (
            <button
              type="button"
              onClick={() => setBusca("")}
              aria-label="Limpar pesquisa"
            >
              <X size={16} />
            </button>
          )}
        </label>

        <div className="cat-group" role="group" aria-label="Filtrar por categoria">
          {["Todos", ...categorias].map((c) => (
            <button
              key={c}
              type="button"
              className="chip"
              aria-pressed={c === categoria}
              onClick={() => setCategoria(c)}
            >
              {c} <span className="chip-count">{contar(c)}</span>
            </button>
          ))}
        </div>

        <div className="cat-group" role="group" aria-label="Filtrar por tecnologia">
          <span className="cat-label" aria-hidden="true">
            Tecnologia
          </span>
          {tecnologias.map((t) => (
            <button
              key={t}
              type="button"
              className="chip"
              aria-pressed={t === tecnologia}
              onClick={() => setTecnologia(t === tecnologia ? "" : t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="cat-status" role="status" aria-live="polite">
        <span>
          {filtrados.length}{" "}
          {filtrados.length === 1 ? "projeto encontrado" : "projetos encontrados"}
        </span>
        {filtrando && (
          <button type="button" className="cat-clear" onClick={limpar}>
            Limpar filtros
          </button>
        )}
      </div>

      {filtrados.length ? (
        <motion.ul className="cat-grid" layout={!reduced}>
          <AnimatePresence mode="popLayout" initial={false}>
            {/* Trocar de filtro faz um cruzamento, não um corte: os cards que
                saem somem e os que entram aparecem. Com movimento reduzido o
                cruzamento é só de opacidade, sem deslocar nem escalar — e
                `animate` tem sempre alvo definido, para nada ficar preso
                invisível. */}
            {filtrados.map((p, i) => (
              <motion.li
                key={p.id}
                layout={!reduced}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.96, transition: { duration: 0.2 } }}
                transition={
                  reduced
                    ? { duration: 0.28, ease: EASE }
                    : { duration: 0.55, ease: EASE, delay: i * 0.04 }
                }
              >
                <ProjectCard project={p} priority={i < 3} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <motion.div
          className="cat-empty"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.28 : 0.5, ease: EASE }}
        >
          <span className="cat-empty-icon" aria-hidden="true">
            <Search size={30} />
          </span>
          <h2>Nenhum projeto por aqui.</h2>
          <p>
            Nada corresponde a
            {busca ? ` “${busca}”` : " essa combinação de filtros"}. Tente
            outro termo ou volte a ver todos os trabalhos.
          </p>
          <Button variant="vidro" icon={false} onClick={limpar}>
            Limpar filtros
          </Button>
        </motion.div>
      )}
    </>
  );
}
