"use client";
import { Github } from "lucide-react";
import type { Project } from "@/types/project";
import { registrarEvento } from "@/lib/metricas";
import { Button } from "./Button";

/** Marca a origem para o botão "Voltar ao portfólio" do site visitado. */
function urlDeVisita(url: string) {
  const u = new URL(url);
  u.searchParams.set("from", "decalq");
  return u.toString();
}

/**
 * Links reais do case. "Visitar o site" abre dentro do portfólio (com barra
 * de retorno) quando o site permite ser embutido; senão abre em nova aba, para
 * o portfólio continuar aberto. GitHub e demonstração só aparecem se existirem.
 */
export function ProjectLinks({ project: p }: { project: Project }) {
  const visita = () =>
    registrarEvento("projeto_visitar", { projeto: p.slug });
  return (
    <div className="plinks">
      {p.liveUrl &&
        (p.iframe ? (
          <>
            <Button
              href={`/projetos/${p.slug}/visitar/`}
              size="lg"
              onClick={visita}
            >
              Visitar o site
            </Button>
            <Button
              href={urlDeVisita(p.liveUrl)}
              external
              variant="vidro"
              size="lg"
              onClick={visita}
            >
              Abrir em nova aba
            </Button>
          </>
        ) : (
          <Button
            href={urlDeVisita(p.liveUrl)}
            external
            size="lg"
            onClick={visita}
          >
            Visitar o site
          </Button>
        ))}
      {p.demoUrl && (
        <Button href={p.demoUrl} external variant="vidro" size="lg">
          Demonstração
        </Button>
      )}
      {p.github && (
        <Button href={p.github} external variant="vidro" size="lg" icon={false}>
          <Github size={18} aria-hidden="true" /> GitHub
        </Button>
      )}
    </div>
  );
}
