import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { services, socialDisclaimer, socialFormats } from "@/data/services";
import type { Service } from "@/types/content";
import { Reveal } from "./Motion";
import { ServiceIcon } from "./ServiceIcon";

/**
 * Grade bento dos serviços. Referência: os módulos de proporções variadas do
 * moodboard, cada um com volume próprio (miolo saturado, borda iluminada) e
 * um elemento gráfico do que o serviço entrega. Os gráficos são decorativos
 * (`aria-hidden`) e não representam clientes nem números reais.
 */
function Graphic({ id }: { id: Service["id"] }) {
  switch (id) {
    case "web":
      return (
        <div className="g g-browser" aria-hidden="true">
          <div className="g-bar">
            <i />
            <i />
            <i />
            <b />
          </div>
          <div className="g-page">
            <span className="g-h" />
            <span className="g-h short" />
            <span className="g-cta" />
            <div className="g-cards">
              <s />
              <s />
              <s />
            </div>
          </div>
        </div>
      );
    case "sistemas":
      return (
        <div className="g g-table" aria-hidden="true">
          {[0, 1, 2, 3].map((r) => (
            <div className="g-row" key={r} style={{ "--r": r } as React.CSSProperties}>
              <i />
              <span />
              <span className="s" />
              <em className={r === 1 ? "warn" : ""} />
            </div>
          ))}
        </div>
      );
    case "automacao":
      return (
        <svg className="g g-flow" viewBox="0 0 320 150" aria-hidden="true" focusable="false">
          <path className="flow-line" d="M52 40 C120 40 120 110 190 110" />
          <path className="flow-line l2" d="M52 110 C120 110 140 40 250 40" />
          <rect x="14" y="18" width="52" height="44" rx="14" />
          <rect x="14" y="88" width="52" height="44" rx="14" />
          <rect x="170" y="88" width="52" height="44" rx="14" />
          <rect x="240" y="18" width="52" height="44" rx="14" />
          <circle className="pulse" cx="196" cy="110" r="5" />
          <circle className="pulse p2" cx="266" cy="40" r="5" />
        </svg>
      );
    case "python":
      return (
        <div className="g g-code" aria-hidden="true">
          <div className="g-code-bar">
            <i />
            <i />
            <i />
            <span>tratar.py</span>
          </div>
          <pre>
            <span className="k">def</span> <span className="f">tratar</span>(planilha):{"\n"}
            {"    "}dados = <span className="f">ler</span>(planilha){"\n"}
            {"    "}<span className="k">return</span> <span className="f">limpar</span>(dados)
          </pre>
        </div>
      );
    case "dados":
      return (
        <div className="g g-chart" aria-hidden="true">
          <span className="bits">
            {"0101110100101011101010111010010010111010001110111010100111101110111101001"}
          </span>
          <div className="bars">
            {[38, 62, 46, 78, 58, 92, 70].map((h, i) => (
              <b key={i} style={{ "--h": `${h}%`, "--k": i } as React.CSSProperties} />
            ))}
          </div>
          <svg viewBox="0 0 200 60" preserveAspectRatio="none" focusable="false">
            <path d="M0 48 L30 40 L60 44 L95 26 L130 32 L165 12 L200 6" />
          </svg>
        </div>
      );
    case "social":
      return (
        <div className="g g-social" aria-hidden="true">
          {socialFormats.map((f) => (
            <figure key={f.id} className={`frame r-${f.id}`}>
              <span className="ratio">{f.ratio}</span>
              {f.id === "reels" && (
                <span className="play">
                  <Play size={14} fill="currentColor" strokeWidth={0} />
                </span>
              )}
              <i />
              <i className="s" />
            </figure>
          ))}
        </div>
      );
  }
}

export function ServicesBento({ compact = false }: { compact?: boolean }) {
  return (
    <div className="bento">
      {services.map((s, i) => (
        <Reveal
          key={s.id}
          variant="up"
          delay={(i % 3) * 0.08}
          className={`bento-slot b-${s.id}`}
        >
          <article className={`bento-tile tone-${s.tone}`}>
            <div className="bento-top">
              <ServiceIcon name={s.id} size={compact ? 52 : 60} />
              <span className="bento-idx">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="bento-copy">
              <h3 className="bento-title">{s.title}</h3>
              <p>{s.description}</p>
              {!compact && (
                <Link href={`/servicos/#${s.id}`} className="bento-link">
                  Ver detalhes <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              )}
            </div>
            <Graphic id={s.id} />
            {s.id === "social" && (
              <p className="bento-note">{socialDisclaimer}</p>
            )}
          </article>
        </Reveal>
      ))}
    </div>
  );
}
