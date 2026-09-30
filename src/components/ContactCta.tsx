"use client";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { useContato } from "@/lib/contact";
import { registrarEvento } from "@/lib/metricas";
import { Button } from "./Button";

/**
 * Convite direto à conversa, sem formulário e sem backend: o visitante sai
 * daqui com o WhatsApp aberto e a primeira mensagem já escrita.
 *
 * O clique ABRE a conversa. Quem envia é o visitante, e o site não sabe se a
 * mensagem foi enviada nem se virou contratação.
 */
export function ContactCta() {
  const c = useContato();

  return (
    <aside className="ccard" aria-labelledby="contato-conversa">
      <span className="ccard-icon" aria-hidden="true">
        <MessageCircle size={26} />
      </span>
      <h2 id="contato-conversa" className="h-3">
        Sem formulário. <span className="grad-text">Só conversa.</span>
      </h2>
      <p className="lead">
        {c.continuando
          ? "Seguimos por onde paramos: a mensagem já vai escrita, é só enviar."
          : "A mensagem já aparece escrita no seu WhatsApp. Você revisa, ajusta se quiser e envia."}
      </p>

      {c.whatsapp ? (
        <>
          <Button
            href={c.whatsapp}
            external
            size="lg"
            className="ccard-cta"
            onClick={() => registrarEvento("whatsapp_clique", { onde: "contato" })}
          >
            {c.label}
          </Button>
          <figure className="ccard-preview">
            <figcaption>Mensagem que será preenchida</figcaption>
            <blockquote>{c.mensagem}</blockquote>
            <small>
              Clicar abre o WhatsApp com o texto pronto. A mensagem só é enviada
              quando você toca em enviar.
            </small>
          </figure>
        </>
      ) : (
        /* Sem número configurado não existe botão: melhor faltar do que levar
           a lugar nenhum. Defina NEXT_PUBLIC_WHATSAPP (ver .env.example). */
        <p className="ccard-vazio" role="status">
          O WhatsApp ainda não está configurado neste site.
        </p>
      )}

      {c.email && (
        <a className="ccard-alt" href={`mailto:${c.email}`}>
          <Mail size={17} aria-hidden="true" />
          <span>Prefere e-mail? {c.email}</span>
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      )}
    </aside>
  );
}
