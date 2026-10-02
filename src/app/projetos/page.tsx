import type { Metadata } from "next";
import { ProjectCatalog } from "@/components/ProjectCatalog";
import { PageHeading } from "@/components/PageHeading";
import { CtaSection } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Sites e sistemas publicados pela Decalq. Pesquise por nome, segmento ou tecnologia e abra o case completo.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeading
        eyebrow="Portfólio / Ideias em prática"
        lines={[
          "Projetos que",
          <span className="grad-text" key="g">
            já estão no ar.
          </span>,
        ]}
        description="Explore o desafio, a solução e o funcionamento de cada trabalho. Pesquise ou filtre para chegar mais rápido."
      />
      <section className="container catalog" aria-label="Catálogo de projetos">
        <ProjectCatalog />
      </section>
      <CtaSection />
    </>
  );
}
