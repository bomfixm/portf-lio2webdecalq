import type { Principle } from "@/types/content";

export const content = {
  intro: {
    eyebrow: "Nossa essência",
    title: "Tecnologia com propósito.",
    subtitle: "Soluções que fazem sentido.",
    description:
      "Antes de escrever código, entendemos o problema. Conectamos estratégia, design e desenvolvimento para criar soluções úteis, intuitivas e preparadas para evoluir.",
  },
  about: {
    title: "Não desenvolvemos apenas software. Desenvolvemos soluções.",
    description:
      "A tecnologia começa a fazer sentido quando resolve algo que importa. Por isso, buscamos entender a necessidade antes de escolher as ferramentas.",
    paragraphs: [
      "Cada projeto começa com perguntas. Como o processo funciona hoje? Onde estão as dificuldades? O que uma boa solução precisa tornar mais simples?",
      "Nossa abordagem conecta clareza, cuidado com a experiência e uma estrutura técnica que possa evoluir. Trabalhamos com escolhas proporcionais ao problema, sem adicionar complexidade por hábito.",
      "Da primeira conversa à entrega, valorizamos comunicação direta, decisões documentadas e atenção aos detalhes. O objetivo é construir algo que as pessoas consigam usar e entender.",
    ],
  },
  principles: [
    {
      title: "Problema antes da ferramenta",
      description:
        "Escolhemos tecnologias a partir da necessidade e do contexto.",
    },
    {
      title: "Clareza em cada etapa",
      description:
        "Tornamos decisões, limites e próximos passos compreensíveis.",
    },
    {
      title: "Cuidado além da interface",
      description:
        "Organização, acessibilidade e manutenção fazem parte da entrega.",
    },
  ] satisfies Principle[],
};

/**
 * Quem está por trás da Decalq. Vazio de propósito: nome, função e minibio
 * reais devem vir do responsável — nada aqui é inventado.
 */
export interface TeamMember {
  name: string;
  role: string;
  description: string;
  photo?: string;
  linkedin?: string;
  github?: string;
}
export const team: TeamMember[] = [];
