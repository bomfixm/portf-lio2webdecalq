import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/project";

/**
 * Card de projeto: imagem, nome, categoria e acesso ao case. O card inteiro é
 * um único link (o "Ver case" é só o rótulo do alvo), sem links aninhados.
 */
export function ProjectCard({
  project: p,
  counter,
  priority = false,
}: {
  project: Project;
  counter?: string;
  priority?: boolean;
}) {
  return (
    <Link href={`/projetos/${p.slug}/`} className="pcard">
      <div className="pcard-media">
        <Image
          src={p.cover}
          alt={`Site de ${p.title}`}
          width={p.desktop.width}
          height={p.desktop.height}
          sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 30vw"
          priority={priority}
        />
        <span className="pcard-cat chip chip-static">{p.category}</span>
        {counter && <span className="pcard-count">{counter}</span>}
      </div>
      <div className="pcard-info">
        <div>
          <h3>{p.title}</h3>
          <p>{p.label}</p>
        </div>
        <span className="pcard-go" aria-hidden="true">
          <ArrowUpRight size={20} />
        </span>
      </div>
      <span className="visually-hidden">Ver case de {p.title}</span>
    </Link>
  );
}
