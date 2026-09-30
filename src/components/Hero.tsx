"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { registrarEvento } from "@/lib/metricas";
import { useContato } from "@/lib/contact";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { Button } from "./Button";
import { useReducedMotion } from "./Motion";

/**
 * Cápsulas de serviço: cada uma leva à sua seção em /servicos. Uma delas fica
 * "acesa" (gradiente) e o destaque passa de uma para outra, com desfoque no
 * apagar/acender, como na referência das cápsulas que se transformam. Hover ou
 * foco pausam a rotação; com movimento reduzido ela nem começa.
 */
function ServiceChips() {
  const reduced = useReducedMotion();
  const [ativo, setAtivo] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (reduced || pausado) return;
    const t = window.setInterval(
      () => setAtivo((n) => (n + 1) % services.length),
      2200,
    );
    return () => window.clearInterval(t);
  }, [reduced, pausado]);

  return (
    <ul
      className="hero-chips"
      aria-label="Serviços"
      onPointerEnter={() => setPausado(true)}
      onPointerLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      {services.map((s, i) => (
        <li key={s.id} style={{ "--k": i } as CSSProperties}>
          <Link
            href={`/servicos/#${s.id}`}
            className="hero-chip"
            data-on={!reduced && ativo === i ? "true" : undefined}
          >
            {s.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Pilha de capturas reais dos cases (mesma linguagem dos painéis: moldura
 * arredondada, luz e profundidade). Decorativa: cada case tem o seu link mais
 * abaixo, então a pilha é `aria-hidden` e fora da ordem de tabulação.
 */
const PILHA = ["nativa-arquitetura", "vai-de-smash", "the-one-bistro"];

function HeroStack() {
  const itens = PILHA.map((slug) => projects.find((p) => p.slug === slug)).filter(
    (p): p is (typeof projects)[number] => !!p,
  );
  return (
    <div className="hero-stack" aria-hidden="true">
      {itens.map((p, i) => (
        <figure key={p.slug} className={`hs hs-${i + 1}`}>
          <Image
            src={p.desktop.src}
            alt=""
            width={p.desktop.width}
            height={p.desktop.height}
            sizes="(max-width: 900px) 0px, 30vw"
            /* a primeira é a maior imagem da primeira dobra no desktop (LCP) */
            priority={i === 0}
          />
        </figure>
      ))}
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const contato = useContato();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Passagem para a próxima composição: o hero recua, desfoca e some.
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const filter = useTransform(scrollYProgress, [0, 0.8], ["blur(0px)", "blur(12px)"]);

  return (
    <section ref={ref} className="hero" aria-labelledby="hero-title">
      <motion.div
        className="hero-inner container"
        style={reduced ? undefined : { opacity, y, filter }}
      >
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow" data-hero style={{ "--h": 0 } as CSSProperties}>
              {projects.length} cases no ar · sites, sistemas e dados
            </p>
            <h1 id="hero-title" className="h-hero hero-title">
              <span className="hl" data-hero style={{ "--h": 1 } as CSSProperties}>
                Ideias viram
              </span>
              <span className="hl" data-hero style={{ "--h": 2 } as CSSProperties}>
                <span className="grad-text">soluções</span>
              </span>
              <span className="hl" data-hero style={{ "--h": 3 } as CSSProperties}>
                digitais.
              </span>
            </h1>
          </div>
          <div
            className="hero-side"
            data-hero
            style={{ "--h": 4 } as CSSProperties}
          >
            <HeroStack />
            <ServiceChips />
          </div>
        </div>

        <div className="hero-foot">
          <p
            className="lead hero-lead"
            data-hero
            style={{ "--h": 5 } as CSSProperties}
          >
            A Decalq desenvolve sites, landing pages, sistemas, automações,
            projetos Python, dashboards e conteúdo para social media. Do
            problema à entrega.
          </p>
          <div
            className="hero-actions"
            data-hero
            style={{ "--h": 6 } as CSSProperties}
          >
            <Button
              {...(contato.whatsapp
                ? {
                    href: contato.whatsapp,
                    external: true,
                    onClick: () =>
                      registrarEvento("whatsapp_clique", { onde: "hero" }),
                  }
                : { href: "/contato/" })}
              size="lg"
            >
              {contato.label}
            </Button>
            <Button href="/projetos" variant="vidro" size="lg" icon={false}>
              Ver projetos
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
