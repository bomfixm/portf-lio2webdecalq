import type { Metadata } from "next";
import { ContactCta } from "@/components/ContactCta";
import { Lines, Reveal } from "@/components/Motion";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Conte sobre sua ideia ou problema. A conversa começa direto no WhatsApp, com a mensagem já escrita.",
};

export default function ContactPage() {
  return (
    <div className="container contact page-top">
      <span className="phead-glow" aria-hidden="true" />
      <section className="contact-intro">
        <Reveal variant="fade">
          <div className="eyebrow">Contato / O primeiro passo</div>
        </Reveal>
        <Lines
          as="h1"
          className="h-1"
          delay={0.05}
          lines={[
            "Tem uma ideia",
            "ou um problema",
            <span className="grad-text" key="g">
              para resolver?
            </span>,
          ]}
        />
        <Reveal variant="up" delay={0.3}>
          <p className="lead">
            Conte um pouco sobre o projeto e vamos conversar sobre como
            transformá-lo em solução. A conversa começa direto no WhatsApp.
          </p>
        </Reveal>
        <Reveal variant="up" delay={0.4}>
          <p className="contact-tip">
            <strong>Não precisa ter tudo definido.</strong> Compartilhe o
            contexto, as dificuldades e o que você gostaria de mudar. Uma boa
            conversa já é um começo.
          </p>
        </Reveal>
      </section>
      <Reveal variant="right" delay={0.2} className="contact-side">
        <ContactCta />
      </Reveal>
    </div>
  );
}
