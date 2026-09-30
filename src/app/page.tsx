import { Hero } from "@/components/Hero";
import { Ticker } from "@/components/Ticker";
import { Button } from "@/components/Button";
import { CtaSection } from "@/components/Footer";
import { DuasImagens } from "@/components/DuasImagens";
import { HorizontalGallery } from "@/components/HorizontalGallery";
import { ProjectPanels } from "@/components/ProjectPanels";
import { ServicesBento } from "@/components/ServicesBento";
import {
  Essence,
  Process,
  SectionHead,
  Technologies,
} from "@/components/Sections";
import { projects } from "@/data/projects";

export default function Home() {
  const painel = projects.filter((p) => p.panel).slice(0, 3);
  const outros = projects.filter((p) => !painel.includes(p));

  return (
    <>
      <Hero />
      <Ticker />
      <Essence />

      <section className="projetos container" id="projetos">
        <SectionHead
          eyebrow="Ideias em prática"
          lines={[
            "Projetos",
            <span className="grad-text" key="g">
              que já estão no ar.
            </span>,
          ]}
          description="Sites e sistemas publicados, cada um com o seu desafio. Abra o case para ver o problema, a solução e como funciona."
        >
          <Button href="/projetos/" variant="vidro" icon>
            Explorar todos os projetos
          </Button>
        </SectionHead>
        <ProjectPanels projects={painel} />
      </section>

      {outros.length > 0 && (
        <HorizontalGallery
          projects={outros}
          eyebrow={`04 — ${String(projects.length).padStart(2, "0")}`}
          title={
            <>
              Outros cases <span className="grad-text">em movimento.</span>
            </>
          }
          description="Mais sites publicados, de arquitetura a gastronomia e engenharia."
        />
      )}

      <DuasImagens />

      <section className="servicos-home container" id="servicos">
        <SectionHead
          eyebrow="O que fazemos"
          lines={[
            "Do site ao dado,",
            <span className="grad-text" key="g">
              do vídeo ao fluxo.
            </span>,
          ]}
          description="Desenvolvimento web, soluções digitais e social media, com posts e edição de vídeos."
        >
          <Button href="/servicos/" variant="vidro">
            Conhecer os serviços
          </Button>
        </SectionHead>
        <ServicesBento />
      </section>

      <Technologies />
      <Process />
      <CtaSection />
    </>
  );
}
