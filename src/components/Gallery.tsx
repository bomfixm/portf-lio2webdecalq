"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { GalleryImage } from "@/types/project";

/**
 * Galeria com lightbox em <dialog> nativo: foco preso no diálogo, Esc fecha,
 * setas navegam, o foco volta ao botão que abriu, e imagens verticais
 * (celular) mantêm a proporção.
 */
export function Gallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const el = dialog.current;
    const aoFechar = () => trigger.current?.focus();
    el?.addEventListener("close", aoFechar);
    return () => el?.removeEventListener("close", aoFechar);
  }, []);

  // Trava a rolagem da página enquanto o diálogo está aberto.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const mo = new MutationObserver(() => {
      document.documentElement.style.overflow = el.open ? "hidden" : "";
    });
    mo.observe(el, { attributes: true, attributeFilter: ["open"] });
    return () => {
      mo.disconnect();
      document.documentElement.style.overflow = "";
    };
  }, []);

  const abrir = (i: number, button: HTMLButtonElement) => {
    setActive(i);
    trigger.current = button;
    dialog.current?.showModal();
  };
  const ir = (delta: number) =>
    setActive((a) => (a + delta + images.length) % images.length);
  const atual = images[active];

  return (
    <>
      <ul className="gal-grid">
        {images.map((img, i) => (
          <li key={img.src} className={img.height > img.width ? "is-phone" : ""}>
            <button
              type="button"
              className="gal-item"
              onClick={(e) => abrir(i, e.currentTarget)}
              aria-label={`Ampliar: ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes="(max-width: 800px) 92vw, 46vw"
              />
              <span className="gal-zoom" aria-hidden="true">
                <Expand size={18} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Galeria ampliada"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") ir(1);
          if (e.key === "ArrowLeft") ir(-1);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="lightbox-inner">
          <button
            type="button"
            className="lightbox-close"
            aria-label="Fechar imagem"
            onClick={() => dialog.current?.close()}
          >
            <X size={22} />
          </button>
          {atual && (
            <Image
              className="lightbox-img"
              src={atual.src}
              alt={atual.alt}
              width={atual.width}
              height={atual.height}
              sizes="95vw"
            />
          )}
          <div className="lightbox-bar">
            <button type="button" aria-label="Imagem anterior" onClick={() => ir(-1)}>
              <ChevronLeft size={22} />
            </button>
            <p aria-live="polite">
              {active + 1} / {images.length} · {atual?.alt}
            </p>
            <button type="button" aria-label="Próxima imagem" onClick={() => ir(1)}>
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
