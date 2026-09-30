"use client";
import { RotateCcw, Sparkles, Waves } from "lucide-react";
import { useMovimento } from "@/lib/movimento";

/**
 * Interruptor de movimento do site.
 *
 * O padrão respeita `prefers-reduced-motion`. Este controle deixa o visitante
 * decidir o contrário — em qualquer direção — e a escolha fica guardada neste
 * navegador. Vale para intro, faixa, cases horizontais, CTA que segue o
 * cursor, revelações e transições de rota, porque todos leem o mesmo estado.
 *
 * `compacto` é a versão usada no rodapé; a outra, com explicação, aparece
 * onde o visitante provavelmente notou algo parado.
 */
export function MotionToggle({
  compacto = false,
  className = "",
}: {
  compacto?: boolean;
  className?: string;
}) {
  const { calmo, sistemaCalmo, escolheu, alternar, seguirSistema } =
    useMovimento();

  const rotulo = calmo ? "Ativar movimento" : "Reduzir movimento";

  if (compacto) {
    return (
      <button
        type="button"
        className={`mov-btn ${className}`.trim()}
        onClick={alternar}
        aria-pressed={!calmo}
      >
        {calmo ? (
          <Sparkles size={15} aria-hidden="true" />
        ) : (
          <Waves size={15} aria-hidden="true" />
        )}
        <span>{rotulo}</span>
      </button>
    );
  }

  return (
    <div className={`mov ${className}`.trim()}>
      <p className="mov-texto">
        {calmo ? (
          <>
            <strong>O movimento está reduzido.</strong>{" "}
            {sistemaCalmo && !escolheu
              ? "Seu sistema pede animações desligadas, então a intro, a faixa, os cases em movimento e o botão que segue o cursor estão calmos."
              : "Você escolheu a versão calma neste navegador."}
          </>
        ) : (
          <>
            <strong>Movimento completo ligado.</strong>{" "}
            {sistemaCalmo
              ? "Vale só neste navegador, acima da preferência do seu sistema."
              : "É o padrão para quem não pede animações reduzidas."}
          </>
        )}
      </p>
      <div className="mov-acoes">
        <button
          type="button"
          className="mov-btn mov-btn-forte"
          onClick={alternar}
          aria-pressed={!calmo}
        >
          {calmo ? (
            <Sparkles size={15} aria-hidden="true" />
          ) : (
            <Waves size={15} aria-hidden="true" />
          )}
          <span>{rotulo}</span>
        </button>
        {escolheu && (
          <button type="button" className="mov-btn" onClick={seguirSistema}>
            <RotateCcw size={14} aria-hidden="true" />
            <span>Voltar a seguir o sistema</span>
          </button>
        )}
      </div>
    </div>
  );
}
