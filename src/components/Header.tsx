"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  ArrowUpRight,
  FolderKanban,
  House,
  Layers3,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import type { NavigationItem } from "@/types/content";
import { registrarEvento } from "@/lib/metricas";
import { useContato } from "@/lib/contact";
import { EASE, useReducedMotion } from "./Motion";
import { BrandSymbol } from "./BrandSymbol";
import { Button } from "./Button";

/**
 * Navegação. Contato NÃO entra aqui: o acesso ao contato é o botão luminoso
 * do fim da cápsula, um só, para não repetir o mesmo destino duas vezes na
 * mesma barra.
 */
export const navLinks: (NavigationItem & { icon: typeof House })[] = [
  { label: "Início", href: "/", icon: House },
  { label: "Projetos", href: "/projetos", icon: FolderKanban },
  { label: "Serviços", href: "/servicos", icon: Layers3 },
  { label: "Sobre", href: "/sobre", icon: UserRound },
];

/** Rodapé lista tudo, inclusive contato (lá não existe o botão da cápsula). */
export const footerLinks: NavigationItem[] = [
  ...navLinks.map(({ label, href }) => ({ label, href })),
  { label: "Contato", href: "/contato" },
];

const semBarra = (p: string) => p.replace(/\/+$/, "") || "/";

/**
 * A logo pisca um olho ao interagir: mouse (com intervalo mínimo entre
 * piscadas), foco por teclado e clique. É o mesmo `BrandSymbol` e a mesma
 * animação da intro. Movimento reduzido mantém só a resposta ao clique e ao
 * foco: a piscada por hover é involuntária e fica de fora.
 */
export function Brand({ className = "" }: { className?: string }) {
  const [wink, setWink] = useState(0);
  const ultima = useRef(-Infinity);
  const reduced = useReducedMotion();

  const piscar = () => {
    ultima.current = performance.now();
    setWink((n) => n + 1);
  };

  return (
    <Link
      href="/"
      className={`brand ${className}`.trim()}
      aria-label={`${siteConfig.brand}, página inicial`}
      onClick={piscar}
      onFocus={(e) => {
        if (e.currentTarget.matches(":focus-visible")) piscar();
      }}
      onPointerEnter={(e) => {
        if (reduced || e.pointerType !== "mouse") return;
        if (performance.now() - ultima.current < 1600) return;
        piscar();
      }}
    >
      <BrandSymbol className="brand-logo" wink={wink} width={54} height={36} />
      <span className="brand-name">{siteConfig.brand}</span>
    </Link>
  );
}

export function Header() {
  const pathname = semBarra(usePathname());
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const contato = useContato();

  const ativo =
    navLinks.find(({ href }) =>
      href === "/" ? pathname === "/" : pathname.startsWith(href),
    )?.href ?? "";

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  // Fecha o menu ao trocar de rota (ajuste de estado na renderização).
  const [rotaDoMenu, setRotaDoMenu] = useState(pathname);
  if (rotaDoMenu !== pathname) {
    setRotaDoMenu(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  /* Único acesso ao contato na barra. Sem número configurado ele leva à
     página de contato, e aí marca a rota como atual. */
  const naRotaDeContato = pathname.startsWith("/contato");
  const cta = (
    <Button
      {...(contato.whatsapp
        ? {
            href: contato.whatsapp,
            external: true,
            onClick: () =>
              registrarEvento("whatsapp_clique", { onde: "cabecalho" }),
          }
        : {
            href: "/contato/",
            "aria-current": naRotaDeContato ? "page" : undefined,
          })}
      size="sm"
      className={`hdr-cta ${naRotaDeContato ? "is-current" : ""}`}
    >
      {contato.whatsapp ? "Falar no WhatsApp" : "Contato"}
    </Button>
  );

  return (
    <header
      ref={root}
      className={`hdr ${scrolled || open ? "is-scrolled" : ""}`}
    >
      <div className="hdr-capsule">
        <Brand />
        <nav className="hdr-nav" aria-label="Navegação principal">
          <LayoutGroup id="nav">
            {navLinks.map(({ label, href }) => {
              const on = ativo === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="hdr-link"
                  aria-current={on ? "page" : undefined}
                >
                  {/* A pastilha desliza entre os itens (layoutId). Com
                      movimento reduzido ela não viaja: aparece no lugar com
                      um crossfade curto, que não é deslocamento na tela. */}
                  {on &&
                    (reduced ? (
                      <motion.span
                        className="hdr-pill"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    ) : (
                      <motion.span
                        className="hdr-pill"
                        layoutId="hdr-pill"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    ))}
                  <span className="hdr-link-label">{label}</span>
                </Link>
              );
            })}
          </LayoutGroup>
        </nav>
        <div className="hdr-cta-wrap">{cta}</div>
        <button
          ref={toggle}
          type="button"
          className="hdr-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-suspenso"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          <span className="hdr-toggle-icon">
            {open ? <X size={20} /> : <Menu size={20} />}
          </span>
          <span className="hdr-toggle-label">Menu</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-suspenso"
            className="drop"
            aria-label="Menu"
            initial={reduced ? false : { opacity: 0, y: -14, scale: 0.97, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <ul className="drop-grid">
              {navLinks.map(({ label, href, icon: Icon }, i) => {
                const on = ativo === href;
                return (
                  <motion.li
                    key={href}
                    className={i === 0 ? "drop-wide" : undefined}
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.05, duration: 0.45, ease: EASE }}
                  >
                    <Link
                      href={href}
                      className="drop-tile"
                      aria-current={on ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      <Icon size={20} aria-hidden="true" />
                      <span>{label}</span>
                      <ArrowUpRight className="drop-arrow" size={16} aria-hidden="true" />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            <div className="drop-cta">
              <Button
                {...(contato.whatsapp
                  ? {
                      href: contato.whatsapp,
                      external: true,
                      onClick: () =>
                        registrarEvento("whatsapp_clique", { onde: "menu" }),
                    }
                  : { href: "/contato/", onClick: () => setOpen(false) })}
                size="lg"
              >
                {contato.label}
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
