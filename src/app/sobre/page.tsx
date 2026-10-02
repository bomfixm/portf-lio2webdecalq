import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { content, team } from "@/data/content";
import { services } from "@/data/services";
import { CtaSection } from "@/components/Footer";
import { Reveal } from "@/components/Motion";
import { PageHeading } from "@/components/PageHeading";
import { Process, Technologies } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "A forma de pensar da Decalq: entender a necessidade antes de escolher as ferramentas. Clareza, cuidado e tecnologia com propósito.",
};

export default function AboutPage() {
  const [primeira, ...resto] = content.about.title.split(". ");
  return (
    <>
      <PageHeading
        eyebrow="Sobre / Nossa maneira de pensar"
        lines={[
          `${primeira}.`,
          <span className="grad-text" key="g">
            {resto.join(". ")}
          </span>,
        ]}
        description={content.about.description}
      />

      <section className="container about-story">
        <Reveal variant="scale" className="about-motif-wrap">
          <div className="about-motif" aria-hidden="true">
            <span>problema</span>
            <i>↓</i>
            <strong>entendimento</strong>
            <i>↓</i>
            <span>solução</span>
            <small>O código é parte do caminho.</small>
          </div>
        </Reveal>
        <div className="about-text">
          {content.about.paragraphs.map((t, i) => (
            <Reveal key={t} variant="blur" delay={i * 0.08}>
              <p>{t}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container principles" aria-label="Princípios">
        {content.principles.map((p, i) => (
          <Reveal key={p.title} variant="up" delay={i * 0.08}>
            <article className="principle">
              <span className="eyebrow">0{i + 1}</span>
              <h2>{p.title}</h2>
              <p>{p.description}</p>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="container about-does">
        <Reveal variant="up">
          <div className="eyebrow">O que a Decalq desenvolve</div>
          <ul>
            {services.map((s) => (
              <li key={s.id} className="chip chip-static">
                {s.title}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {team.length > 0 && (
        <section className="container section team">
          <h2 className="h-2">Quem está por trás.</h2>
          <div className="team-grid">
            {team.map((m) => (
              <article key={m.name}>
                {m.photo && (
                  <Image src={m.photo} alt={m.name} width={480} height={480} />
                )}
                <h3>{m.name}</h3>
                <span className="eyebrow">{m.role}</span>
                <p>{m.description}</p>
                {m.linkedin && (
                  <a href={m.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                )}
                {m.github && (
                  <a href={m.github} target="_blank" rel="noopener noreferrer">
                    GitHub <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <Process />
      <Technologies />
      <CtaSection />
    </>
  );
}
