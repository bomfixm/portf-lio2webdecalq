"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { guardarOrigem } from "@/lib/origem";

/**
 * Guarda `?origem=` a cada troca de rota, para o parametro sobreviver a
 * navegacao interna ate a pagina de contato. Nao renderiza nada.
 */
export function CapturaOrigem() {
  const pathname = usePathname();
  useEffect(() => {
    guardarOrigem();
  }, [pathname]);
  return null;
}
