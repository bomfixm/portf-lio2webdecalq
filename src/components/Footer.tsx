"use client";
import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useContato } from "@/lib/contact";
import { registrarEvento } from "@/lib/metricas";
import { Brand, footerLinks } from "./Header";
import { CursorCta } from "./CursorCta";
import { Lines, Reveal } from "./Motion";

/** "Vamos construir algo juntos?": o único CTA principal da seção. */
export function CtaSection() {
  return (
    <section className="cta container" aria-labelledby="cta-title">
      <Reveal variant="scale" className="cta-reveal">
        <div className="cta-panel">
          <span className="cta-glow" aria-hidden="true" />
          <span className="cta-ring r1" aria-hidden="true" />
          <span className="cta-ring r2" aria-hidden="true" />
          <span className="cta-ring r3" aria-hidden="true" />
          <div className="cta-content">
            <div className="eyebrow">Seu próximo projeto começa aqui</div>
            <Lines
              as="h2"
              id="cta-title"
              className="h-1 cta-title"
              delay={0.1}
              lines={[
                "Vamos construir",
                <span className="grad-text" key="g">
                  algo juntos?
                </span>,
              ]}
            />
            <p className="lead">
              Se você tem uma ideia, um processo ou um problema que a tecnologia
              pode resolver, queremos conhecê-lo.
            </p>
            <p className="cta-hint" aria-hidden="true">
              O botão acompanha o seu cursor.
            </p>
          </div>
          <CursorCta />
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  const contato = useContato();
  const canais = [
    contato.whatsapp
      ? { texto: "WhatsApp", href: contato.whatsapp, externo: true }
      : null,
    contato.email
      ? { texto: contato.email, href: `mailto:${contato.email}`, externo: false }
      : null,
    siteConfig.instagram
      ? { texto: "Instagram", href: siteConfig.instagram, externo: true }
      : null,
    siteConfig.linkedin
      ? { texto: "LinkedIn", href: siteConfig.linkedin, externo: true }
      : null,
    siteConfig.github
      ? { texto: "GitHub", href: siteConfig.github, externo: true }
      : null,
  ].filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand />
            <p>{siteConfig.slogan}</p>
          </div>
          <nav className="footer-col" aria-label="Navegação do rodapé">
            <h2>Navegação</h2>
            {footerLinks.map(({ label, href }) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="footer-col">
            <h2>Contato</h2>
            {canais.length > 0 ? (
              canais.map((c) => (
                <a
                  key={c.texto}
                  href={c.href}
                  {...(c.externo
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  onClick={
                    c.texto === "WhatsApp"
                      ? () => registrarEvento("whatsapp_clique", { onde: "rodape" })
                      : undefined
                  }
                >
                  {c.texto}
                  {c.externo && <ArrowUpRight size={14} aria-hidden="true" />}
                </a>
              ))
            ) : (
              <Link href="/contato/">Falar com a Decalq</Link>
            )}
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          {siteConfig.brand}
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {siteConfig.brand}. Todos os direitos
            reservados.
          </span>
          <Link href="/metricas/" className="footer-small">
            Métricas
          </Link>
          <button
            type="button"
            className="totop"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                  .matches
                  ? "auto"
                  : "smooth",
              })
            }
          >
            Voltar ao topo <ArrowUp size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
