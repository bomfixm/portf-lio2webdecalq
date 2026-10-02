"use client";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/Button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container notfound page-top">
      <span className="phead-glow" aria-hidden="true" />
      <div className="eyebrow">Algo saiu do esperado</div>
      <h1 className="h-1">Não conseguimos carregar este conteúdo.</h1>
      <p className="lead">Tente novamente para continuar explorando.</p>
      <Button variant="vidro" icon={false} onClick={reset}>
        <RotateCcw size={16} aria-hidden="true" /> Tentar novamente
      </Button>
    </div>
  );
}
