import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="container notfound page-top">
      <span className="phead-glow" aria-hidden="true" />
      <div className="eyebrow">404 / Caminho não encontrado</div>
      <h1 className="h-1">
        Essa rota <span className="grad-text">ainda não existe.</span>
      </h1>
      <p className="lead">Vamos voltar para um lugar conhecido?</p>
      <Button href="/">Voltar para o início</Button>
    </div>
  );
}
