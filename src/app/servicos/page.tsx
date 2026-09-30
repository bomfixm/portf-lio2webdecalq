import type { Metadata } from "next";
import { Check } from "lucide-react";
import { services } from "@/data/services";
import { CtaSection } from "@/components/Footer";
import { Lines, Reveal } from "@/components/Motion";
import { PageHeading } from "@/components/PageHeading";
import { Process, Technologies } from "@/components/Sections";
import { ServiceIcon } from "@/components/ServiceIcon";
import { ServicesBento } from "@/components/ServicesBento";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Sites e landing pages, sistemas, automações, projetos Python, dashboards e dados, social media com posts e edição de vídeos.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeading
        eyebrow="Serviços / O que a Decalq desenvolve"
        lines={[
          "Soluções digitais",
          <span className="grad-text" key="g">
            de ponta a ponta.
          </span>,
        ]}
        description="Sites, sistemas, automações, projetos Python, dashboards e social media. Cada serviço começa entendendo o problema, antes de escolher a ferramenta."
      />

      <section className="container svc-overview">
        <ServicesBento compact />
      </section>

      {/* Índice: âncoras da MESMA página. A rolagem é suave (Lenis) e para
          abaixo do cabeçalho fixo; com movimento reduzido o salto é direto,
          com a mesma compensação, via `scroll-padding-top`. */}
      <nav className="container svc-index" aria-label="Ir para um serviço">
        <span className="svc-index-rotulo">Ir para</span>
        <ul>
          {services.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="chip">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section className="container svc-details" aria-label="Serviços em detalhe">
        {services.map((s, i) => (
          <section key={s.id} id={s.id} className="svc-row">
            <Reveal variant="fade" className="svc-row-icon">
              <ServiceIcon name={s.id} size={84} />
              <span className="bento-idx">{String(i + 1).padStart(2, "0")}</span>
            </Reveal>
            <div className="svc-row-main">
              <Lines as="h2" className="h-2" lines={[s.title]} />
              <Reveal variant="up" delay={0.1}>
                <p className="lead">{s.details}</p>
              </Reveal>
            </div>
            <Reveal variant="right" delay={0.15} className="svc-row-items">
              <ul>
                {s.items.map((it) => (
                  <li key={it}>
                    <Check size={17} aria-hidden="true" />
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          </section>
        ))}
      </section>

      <Technologies />
      <Process />
      <CtaSection />
    </>
  );
}
