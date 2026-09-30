import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { projects, projectBySlug } from "@/data/projects";
import { Gallery } from "@/components/Gallery";
import { Button } from "@/components/Button";
import { CtaSection } from "@/components/Footer";
import { Lines, Reveal } from "@/components/Motion";
import { ProjectLinks } from "@/components/ProjectLinks";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return { title: "Projeto não encontrado" };
  return {
    title: p.title,
    description: p.shortDescription,
    alternates: { canonical: `/projetos/${slug}/` },
    openGraph: {
      title: p.title,
      description: p.shortDescription,
      type: "article",
      images: [{ url: p.cover, width: p.desktop.width, height: p.desktop.height }],
    },
  };
}

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="csec" aria-labelledby={`c-${num}`}>
      <Reveal variant="fade" className="csec-label">
        <span className="csec-num">{num}</span>
        <h2 id={`c-${num}`} className="csec-title">
          {title}
        </h2>
      </Reveal>
      <Reveal variant="up" delay={0.1} className="csec-body">
        {children}
      </Reveal>
    </section>
  );
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  const p = projects[index];
  const anterior = projects[(index - 1 + projects.length) % projects.length];
  const proximo = projects[(index + 1) % projects.length];

  return (
    <article className="case">
      <header className="container case-hero page-top">
        <span className="phead-glow" aria-hidden="true" />
        <div className="case-hero-copy">
        <Reveal variant="fade">
          <Link href="/projetos/" className="case-back">
            <ArrowLeft size={16} aria-hidden="true" /> Todos os projetos
          </Link>
        </Reveal>
        <Reveal variant="fade" delay={0.05}>
          <div className="eyebrow">
            Case {p.id} · {p.label} · {p.category}
          </div>
        </Reveal>
        <Lines
          as="h1"
          className="case-title"
          lines={[p.title]}
          delay={0.05}
        />
        <Reveal variant="up" delay={0.25}>
          <p className="lead">{p.shortDescription}</p>
        </Reveal>
        <Reveal variant="up" delay={0.35} className="case-actions">
          <ProjectLinks project={p} />
        </Reveal>
        <Reveal variant="up" delay={0.45}>
          <dl className="case-facts">
            <div>
              <dt>Categoria</dt>
              <dd>{p.category}</dd>
            </div>
            <div>
              <dt>Ano</dt>
              <dd>{p.year}</dd>
            </div>
            <div>
              <dt>Tecnologias</dt>
              <dd>{p.technologies.join(" · ")}</dd>
            </div>
          </dl>
        </Reveal>
        </div>
        <Reveal variant="scale" delay={0.2} className="case-hero-media">
          <div className="phone case-phone">
            <Image
              src={p.mobile.src}
              alt={p.mobile.alt}
              width={p.mobile.width}
              height={p.mobile.height}
              priority
              sizes="(max-width: 900px) 60vw, 320px"
            />
          </div>
        </Reveal>
      </header>

      {/* desktop + celular, em escala reconhecível */}
      <div className="container">
        <Reveal variant="scale" className="case-stage">
          <div className="case-stage-frame">
            <Image
              className="case-desktop"
              src={p.desktop.src}
              alt={p.desktop.alt}
              width={p.desktop.width}
              height={p.desktop.height}
              priority
              sizes="(max-width: 900px) 92vw, 1100px"
            />
          </div>
        </Reveal>
      </div>

      <div className="container case-body">
        <Section num="01" title="Contexto e problema">
          <p className="lead">{p.fullDescription}</p>
          <p className="case-quote">{p.challenge}</p>
        </Section>

        <Section num="02" title="Objetivo">
          <p className="case-big">{p.objective}</p>
        </Section>

        <Section num="03" title="Solução">
          <p className="lead">{p.solution}</p>
        </Section>

        <Section num="04" title="Funcionamento">
          <p className="lead">{p.analysis}</p>
          <ol className="workflow">
            {p.workflow.map((s, i) => (
              <li key={s.title}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </li>
            ))}
          </ol>
          <ul className="features">
            {p.features.map((f) => (
              <li key={f}>
                <Check size={17} aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </Section>

        <Section num="05" title="Tecnologias">
          <ul className="techlist">
            {p.technologies.map((t) => (
              <li key={t} className="chip chip-static">
                {t}
              </li>
            ))}
          </ul>
        </Section>

        <Section num="06" title="Resultado conhecido">
          {p.results?.length ? (
            <ul className="results">
              {p.results.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          ) : (
            <div className="results-empty">
              <p>
                Ainda não há métricas medidas e comprovadas para este case, e
                aqui só entra resultado que dá para provar. O que existe é o
                trabalho publicado
                {p.liveUrl ? ", que você pode visitar." : "."}
              </p>
            </div>
          )}
        </Section>
      </div>

      <section className="container cgal" aria-labelledby="cgal-title">
        <Reveal variant="up">
          <div className="eyebrow">Mais de perto</div>
          <h2 id="cgal-title" className="h-2">
            Desktop e celular.
          </h2>
        </Reveal>
        <Reveal variant="scale" delay={0.1}>
          <Gallery images={p.gallery} />
        </Reveal>
      </section>

      {(p.video || p.gif) && (
        <section className="container cmedia" aria-label="Demonstração">
          {p.video && (
            <video
              controls
              preload="metadata"
              poster={p.cover}
              aria-label={`Vídeo de demonstração de ${p.title}`}
            >
              <source src={p.video} />
            </video>
          )}
          {p.gif && (
            <Image
              src={p.gif}
              alt={`Demonstração animada de ${p.title}`}
              width={1200}
              height={780}
              unoptimized
            />
          )}
        </section>
      )}

      <div className="container cend">
        <Button href="/projetos/" variant="vidro" icon={false} className="cend-back">
          <ArrowLeft size={18} aria-hidden="true" /> Voltar ao portfólio
        </Button>
      </div>

      <nav className="container cnav" aria-label="Outros projetos">
        <Reveal variant="left">
          <Link href={`/projetos/${anterior.slug}/`} className="cnav-card">
            <span>
              <ArrowLeft size={16} aria-hidden="true" /> Projeto anterior
            </span>
            <strong>{anterior.title}</strong>
          </Link>
        </Reveal>
        <Reveal variant="right">
          <Link href={`/projetos/${proximo.slug}/`} className="cnav-card is-next">
            <span>
              Próximo projeto <ArrowRight size={16} aria-hidden="true" />
            </span>
            <strong>{proximo.title}</strong>
          </Link>
        </Reveal>
      </nav>

      <CtaSection />
    </article>
  );
}
