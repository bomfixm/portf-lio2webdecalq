"use client";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { registrarEvento } from "@/lib/metricas";
import { useContato } from "@/lib/contact";
import { Button } from "./Button";
import { useFinePointer, useReducedMotion } from "./Motion";

/**
 * CTA única da seção final.
 *
 * Desktop com mouse (hover + pointer fino): uma cápsula luminosa, que é um
 * link real para o WhatsApp, acompanha o cursor com inércia (MotionValues e
 * spring, sem estado React por mousemove) e fica SEMPRE dentro da seção: a
 * posição é limitada pelas bordas, descontando a metade do tamanho da cápsula.
 * Nasce onde o cursor entrou e some ao sair.
 *
 * Toque, tablet, teclado ou movimento reduzido: um único botão estático,
 * centralizado. Nos casos de mouse ele continua no DOM para o teclado e só
 * aparece ao receber foco (CSS: .cta-static).
 *
 * Só existe um CTA principal por vez: o seguidor é `aria-hidden` e sai da
 * ordem de tabulação, então o leitor de tela e o teclado veem um botão só.
 */
export function CursorCta() {
  const layer = useRef<HTMLDivElement>(null);
  const follow = useRef<HTMLDivElement>(null);
  const contato = useContato();
  const fino = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fino && !reduced;
  const [active, setActive] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 110, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 110, damping: 18, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    const area = layer.current?.parentElement;
    if (!area) return;
    /**
     * Centro da cápsula, limitado em duas frentes:
     *  - horizontal: as bordas da seção, descontando metade da largura;
     *  - vertical: a faixa livre ABAIXO do texto, para a cápsula nunca cobrir
     *    o título nem o parágrafo. Se por algum motivo não houver faixa (tela
     *    muito baixa), cai para os limites da seção inteira.
     */
    const alvo = (e: PointerEvent) => {
      const r = area.getBoundingClientRect();
      const w = follow.current?.offsetWidth ?? 240;
      const h = follow.current?.offsetHeight ?? 64;
      const margem = 10;
      const cx = Math.min(
        Math.max(e.clientX - r.left, w / 2 + margem),
        r.width - w / 2 - margem,
      );

      const texto = area.querySelector(".cta-content")?.getBoundingClientRect();
      let topo = h / 2 + margem;
      const base = r.height - h / 2 - margem;
      if (texto) {
        const abaixoDoTexto = texto.bottom - r.top + h / 2 + margem;
        if (abaixoDoTexto <= base) topo = abaixoDoTexto;
      }
      const cy = Math.min(Math.max(e.clientY - r.top, topo), Math.max(topo, base));
      return [cx, cy] as const;
    };
    /* Nasce onde o cursor está, sem "voar" desde o canto. */
    const acender = (e: PointerEvent) => {
      const [cx, cy] = alvo(e);
      x.jump(cx);
      y.jump(cy);
      sx.jump(cx);
      sy.jump(cy);
      setActive(true);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      /* `pointermove` também acende: se o visitante rolar a página com o
         cursor parado exatamente onde esta seção vai chegar, o navegador não
         dispara `pointerenter` e a cápsula nunca apareceria. */
      if (!active) {
        acender(e);
        return;
      }
      const [cx, cy] = alvo(e);
      x.set(cx);
      y.set(cy);
    };
    const enter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      acender(e);
    };
    const leave = () => setActive(false);
    area.addEventListener("pointerenter", enter);
    area.addEventListener("pointermove", move);
    area.addEventListener("pointerleave", leave);
    return () => {
      area.removeEventListener("pointerenter", enter);
      area.removeEventListener("pointermove", move);
      area.removeEventListener("pointerleave", leave);
    };
  }, [enabled, active, x, y, sx, sy]);

  const externo = !!contato.whatsapp;
  const aoClicar = () => registrarEvento("whatsapp_clique", { onde: "cta-final" });

  return (
    <>
      <div ref={layer} className="cta-layer">
        {enabled && (
          <motion.div
            ref={follow}
            className="cta-follow"
            style={{ x: sx, y: sy }}
            initial={false}
            animate={{
              opacity: active ? 1 : 0,
              scale: active ? 1 : 0.6,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={contato.href}
              className="btn btn-luz btn-lg cta-pill"
              tabIndex={-1}
              aria-hidden="true"
              onClick={aoClicar}
              {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className="btn-label">{contato.label}</span>
              <ArrowUpRight className="btn-arrow" size={20} />
            </Link>
          </motion.div>
        )}
      </div>
      <div className="cta-static">
        <Button
          {...(externo
            ? { href: contato.href, external: true, onClick: aoClicar }
            : { href: contato.href })}
          size="lg"
        >
          {contato.label}
        </Button>
      </div>
    </>
  );
}
