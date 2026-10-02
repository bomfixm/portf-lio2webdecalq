import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import { Reveal } from "./Motion";

/**
 * Banner com duas imagens reais lado a lado. O desfoque fica só na junção:
 * cada imagem é enquadrada (zoom ancorado na borda externa) para que o que
 * importa fique longe da costura, e a costura é uma faixa de vidro fosco com
 * máscara em degradê, então o blur conecta as duas sem apagar conteúdo.
 * No celular as imagens empilham e a costura fica horizontal.
 */
const ESQUERDA = "nativa-arquitetura";
const DIREITA = "vai-de-smash";

export function DuasImagens() {
  const a = projects.find((p) => p.slug === ESQUERDA);
  const b = projects.find((p) => p.slug === DIREITA);
  if (!a || !b) return null;

  return (
    <section className="duo container" aria-label="Dois trabalhos em destaque">
      <Reveal variant="scale" className="duo-reveal">
        <div className="duo-frame">
          {[
            { p: a, lado: "a" },
            { p: b, lado: "b" },
          ].map(({ p, lado }) => (
            <figure className={`duo-side duo-${lado}`} key={p.slug}>
              <Image
                src={p.cover}
                alt={`Site de ${p.title}`}
                width={p.desktop.width}
                height={p.desktop.height}
                sizes="(max-width: 800px) 100vw, 60vw"
              />
              <figcaption>
                <Link href={`/projetos/${p.slug}/`} className="duo-cap">
                  <strong>{p.title}</strong>
                  <span>{p.label}</span>
                </Link>
              </figcaption>
            </figure>
          ))}
          {/* a costura: desfoca o que passa por baixo dela, e nada além disso */}
          <span className="duo-seam" aria-hidden="true" />
        </div>
      </Reveal>
    </section>
  );
}
