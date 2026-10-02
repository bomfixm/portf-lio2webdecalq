"use client";
import { mensagens, rotulosContato, siteConfig } from "@/config/site";
import { useOrigem } from "./origem";

/**
 * Único lugar que monta o contato. O número e as mensagens vêm de
 * `src/config/site.ts`; nenhum componente escreve `wa.me` por conta própria.
 *
 * O clique só ABRE a conversa no WhatsApp com a mensagem escrita: quem envia
 * é o visitante, e o site não sabe se isso aconteceu.
 */

/**
 * Devolve `null` quando não há número utilizável — a interface nunca publica
 * um botão que leva a lugar nenhum.
 */
export function linkWhatsApp(numero: string, mensagem: string): string | null {
  const digitos = numero.replace(/\D/g, "");
  // país (2) + DDD (2) + número (8 ou 9)
  if (digitos.length < 12 || digitos.length > 15) return null;
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensagem)}`;
}

/** Número da vez: o da prospecção quando o visitante veio por ela. */
export function numeroDaVez(continuando: boolean): string {
  return (
    (continuando && siteConfig.whatsappProspeccao) || siteConfig.whatsapp || ""
  );
}

export interface Contato {
  /** `?origem=whatsapp` reconhecido */
  continuando: boolean;
  /** link wa.me pronto, ou null se não há número configurado */
  whatsapp: string | null;
  /** o que fazer quando não há número: levar à página de contato */
  href: string;
  label: string;
  mensagem: string;
  email: string;
}

/** Contato coerente com a origem do visitante (client). */
export function useContato(): Contato {
  const continuando = useOrigem() === "whatsapp";
  const mensagem = continuando ? mensagens.continuando : mensagens.padrao;
  const whatsapp = linkWhatsApp(numeroDaVez(continuando), mensagem);
  return {
    continuando,
    whatsapp,
    href: whatsapp ?? "/contato/",
    label: continuando ? rotulosContato.continuando : rotulosContato.padrao,
    mensagem,
    email: siteConfig.email,
  };
}
