"use client";
import { useEffect } from "react";
import { encerrarSaida } from "@/lib/transicao";

/**
 * Transição entre rotas. O `template` remonta a cada navegação, então serve
 * de gancho para a entrada.
 *
 * A animação é CSS (`.route`, em base.css), e não `style` inline do Framer:
 * um `transform` inline que sobra no fim viraria bloco de contenção e
 * quebraria `position: fixed` de qualquer descendente. Com `animation-fill-mode:
 * both` o estado final é `transform: none`, sem resíduo.
 *
 * A saída é o par disto: `ScrollMemory` marca a saída no clique de um link
 * interno e o CSS escurece a página; aqui, na montagem da rota nova, a marca
 * é retirada — respeitando o piso de duração de `lib/transicao`, senão o fade
 * de saída terminaria antes de aparecer.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    encerrarSaida();
  });
  return <div className="route">{children}</div>;
}
