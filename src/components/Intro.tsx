"use client";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { EASE, useMounted, useReducedMotion } from "./Motion";
import { BrandSymbol } from "./BrandSymbol";

/**
 * Abertura da home: só o decalqzinho.
 *
 *   0,00s  símbolo totalmente fora da tela, à esquerda (CSS: .intro-logo)
 *   → 1,15s entra com desaceleração longa e para no centro
 *   1,55s  piscadinha de um olho (a mesma animação da logo do site)
 *   2,40s  fade-out do overlay; o portfólio se revela por baixo, com blur
 *   ≈3,1s  fim
 *
 * Ela toca SEMPRE que a home entra em cena: abrir, recarregar, voltar de
 * outra página (Link ou histórico) e retornar pelo bfcache. Não existe memória
 * de sessão, de visita ou de navegador. Trocar de âncora dentro da própria
 * home não muda o pathname, então não reinicia nada.
 *
 * Falhas: o site é liberado por três caminhos independentes — o temporizador
 * de HOLD, o botão "Pular intro" (também Esc, clique, toque e rolagem) e o
 * temporizador de segurança do script inline em layout.tsx, que não depende
 * do React.
 */
const T = { wink: 1.55, hold: 2.4, exit: 0.7, skipExit: 0.35 };
/* Movimento reduzido: sem travessia de tela. O símbolo já aparece no centro,
   pisca e some num fade. Aparece do mesmo jeito, só que calmo. */
const CALMO = { wink: 0.55, hold: 1.9, exit: 0.5 };

const normaliza = (p: string | null) => (p ? p.replace(/\/+$/, "") || "/" : p);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const pathname = normaliza(usePathname());
  const reduced = useReducedMotion();
  const montado = useMounted();
  const hold = reduced ? CALMO.hold : T.hold;

  const [tocando, setTocando] = useState(false);
  // `rodada` vira a key do overlay: cada entrada na home remonta tudo.
  const [rodada, setRodada] = useState(0);
  const [visto, setVisto] = useState<string | null>(null);
  const [pulou, setPulou] = useState(false);
  const inicio = useRef(0);

  /* Toda entrada na home abre uma exibição nova; sair dela fecha a que
     estiver em cena. Ajuste de estado durante a renderização: é o padrão do
     React para reagir a uma rota que mudou, sem efeito no meio. */
  const rota = montado ? pathname : null;
  if (rota !== visto) {
    setVisto(rota);
    setTocando(rota === "/");
    setPulou(false);
    if (rota === "/") setRodada((n) => n + 1);
  }

  const encerrar = useCallback(() => {
    if (inicio.current && performance.now() - inicio.current < hold * 1000)
      setPulou(true);
    setTocando(false);
  }, [hold]);

  useEffect(() => {
    if (!tocando) return;
    window.scrollTo(0, 0);
    inicio.current = performance.now();
    const timer = window.setTimeout(() => setTocando(false), hold * 1000);
    return () => window.clearTimeout(timer);
  }, [tocando, rodada, hold]);

  // Voltar do histórico pode devolver a página do bfcache, com o React vivo e
  // sem remontar nada: `persisted` é o sinal para tocar de novo.
  useEffect(() => {
    const aoVoltar = (e: PageTransitionEvent) => {
      if (!e.persisted || normaliza(window.location.pathname) !== "/") return;
      setPulou(false);
      setRodada((n) => n + 1);
      setTocando(true);
    };
    window.addEventListener("pageshow", aoVoltar);
    return () => window.removeEventListener("pageshow", aoVoltar);
  }, []);

  // O atributo controla o CSS do hero e da barra: escondidos enquanto toca.
  // Layout effect: o CSS já está certo antes da primeira pintura da rodada.
  useLayoutEffect(() => {
    document.documentElement.dataset.intro = tocando ? "play" : "done";
    document.documentElement.dataset.introSkip = pulou ? "true" : "false";
    if (!tocando) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [tocando, pulou]);

  // Clicar, tocar, rolar ou apertar Esc encerra a intro.
  useEffect(() => {
    if (!tocando) return;
    const porTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") encerrar();
    };
    const opts = { passive: true } as const;
    window.addEventListener("pointerdown", encerrar, opts);
    window.addEventListener("wheel", encerrar, opts);
    window.addEventListener("touchmove", encerrar, opts);
    window.addEventListener("keydown", porTecla);
    return () => {
      window.removeEventListener("pointerdown", encerrar);
      window.removeEventListener("wheel", encerrar);
      window.removeEventListener("touchmove", encerrar);
      window.removeEventListener("keydown", porTecla);
    };
  }, [tocando, encerrar]);

  return (
    <>
      <AnimatePresence>
        {tocando && (
          <IntroOverlay
            key={rodada}
            reduced={reduced}
            onSkip={encerrar}
            pulando={pulou}
          />
        )}
      </AnimatePresence>
      {children}
    </>
  );
}

function IntroOverlay({
  reduced,
  onSkip,
  pulando,
}: {
  reduced: boolean;
  onSkip: () => void;
  pulando: boolean;
}) {
  // Mesmo contador que a logo do cabeçalho usa: um incremento, uma piscadinha.
  const [wink, setWink] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(
      () => setWink(1),
      (reduced ? CALMO.wink : T.wink) * 1000,
    );
    return () => window.clearTimeout(t);
  }, [reduced]);

  const dur = pulando ? T.skipExit : reduced ? CALMO.exit : T.exit;

  return (
    <motion.div
      className="intro"
      role="presentation"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: dur, ease: EASE } }}
    >
      <motion.span
        className="intro-glow"
        aria-hidden="true"
        initial={{ opacity: reduced ? 0.7 : 0, scale: reduced ? 1 : 0.7 }}
        animate={{
          opacity: 0.85,
          scale: 1,
          transition: reduced ? { duration: 0 } : { duration: 1.6, ease: EASE },
        }}
      />
      {/* A entrada é CSS (.intro-logo): o deslocamento sai de
          calc(-50vw - 100%), então o símbolo começa inteiro fora da tela em
          qualquer largura, sem número mágico. Com movimento reduzido o CSS
          zera o deslize e ele já aparece no centro. */}
      <motion.div
        className="intro-stage"
        aria-hidden="true"
        exit={{
          opacity: 0,
          scale: 1.04,
          transition: { duration: dur * 0.8, ease: EASE },
        }}
      >
        <BrandSymbol
          className="intro-logo"
          wink={wink}
          width={239}
          height={160}
        />
      </motion.div>
      <motion.button
        type="button"
        className="intro-skip"
        onClick={(e) => {
          e.stopPropagation();
          onSkip();
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.4, delay: reduced ? 0.1 : 0.6 },
        }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        Pular intro
      </motion.button>
    </motion.div>
  );
}
