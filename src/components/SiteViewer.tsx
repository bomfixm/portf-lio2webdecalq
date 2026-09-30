"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { siteConfig } from "@/config/site";
import { canGoBackInternally } from "@/lib/history";
import { EASE, useMounted, useReducedMotion } from "./Motion";

/**
 * Visualizador: o site do cliente roda dentro do portfólio, com uma barra
 * nossa no topo. O visitante nunca perde o caminho de volta, e nada precisa
 * ser instalado no site do cliente.
 *
 * A barra do topo aparece na entrada (contexto: marca, nome do case, domínio)
 * e recolhe de vez, para o site ocupar a tela. O botão suspenso fica sempre.
 * Como o iframe é de outra origem, não dá para ouvir o scroll dentro dele: os
 * gatilhos do recolhimento são o tempo e o foco indo para o iframe.
 *
 * "Voltar" usa o histórico quando o visitante veio do case (volta à posição
 * exata do scroll); em acesso direto ao link, navega para o case.
 */
const RECOLHE_APOS = 3200;

export function SiteViewer({
  title,
  url,
  caseHref,
}: {
  title: string;
  url: string;
  caseHref: string;
}) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const mounted = useMounted();
  const [loaded, setLoaded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [barHover, setBarHover] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);

  // Avaliado no mount: depois disso o próprio clique já conta como navegação.
  const veioDoSite = useRef(false);
  useEffect(() => {
    veioDoSite.current = canGoBackInternally();
  }, []);

  const voltar = useCallback(
    (event?: { preventDefault: () => void }) => {
      if (!veioDoSite.current) return; // acesso direto: segue o href do Link
      event?.preventDefault();
      router.back();
    },
    [router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (veioDoSite.current) router.back();
      else router.push(caseHref);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [router, caseHref]);

  useEffect(() => {
    if (collapsed || barHover) return;
    const t = window.setTimeout(() => setCollapsed(true), RECOLHE_APOS);
    return () => window.clearTimeout(t);
  }, [collapsed, barHover]);

  useEffect(() => {
    const onBlur = () => {
      if (document.activeElement === frame.current) setCollapsed(true);
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  if (!mounted) return null;

  // Portal para o <body>: um ancestral com `transform` viraria o bloco de
  // contenção do `position: fixed`.
  return createPortal(
    <motion.div
      className="viewer"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <motion.div
        className="viewer-bar"
        animate={{ y: collapsed ? "-100%" : "0%" }}
        transition={reduced ? { duration: 0 } : { duration: 0.45, ease: EASE }}
        onPointerEnter={() => setBarHover(true)}
        onPointerLeave={() => setBarHover(false)}
        inert={collapsed}
      >
        <Link href={caseHref} className="viewer-back" onClick={voltar}>
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Voltar ao portfólio</span>
        </Link>
        <div className="viewer-id">
          <Image
            src={siteConfig.logo}
            alt=""
            width={36}
            height={24}
            className="viewer-logo"
          />
          <span className="viewer-title">{title}</span>
          <span className="viewer-host">{new URL(url).host}</span>
        </div>
        <a
          className="viewer-open"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Abrir em nova aba</span>
          <ExternalLink size={15} aria-hidden="true" />
        </a>
      </motion.div>

      <motion.div
        className="viewer-pills"
        initial={reduced ? false : { opacity: 0, y: 14, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 0.6, delay: 0.25, ease: EASE }}
      >
        <Link href={caseHref} className="viewer-pill" onClick={voltar}>
          <ArrowLeft size={15} aria-hidden="true" />
          <Image src={siteConfig.logo} alt="" width={27} height={18} />
          <span>Portfólio</span>
        </Link>
        <a
          className="viewer-pill viewer-pill-icon"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir o site em nova aba"
          title="Abrir em nova aba"
        >
          <ExternalLink size={15} aria-hidden="true" />
        </a>
      </motion.div>

      <div className="viewer-frame">
        {!loaded && (
          <div className="viewer-loading" role="status">
            <LoaderCircle className="spin" size={22} aria-hidden="true" />
            <span>Carregando {title}…</span>
          </div>
        )}
        <iframe
          ref={frame}
          src={url}
          title={`${title}: site publicado`}
          onLoad={() => setLoaded(true)}
          allow="clipboard-write; fullscreen"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </motion.div>,
    document.body,
  );
}
