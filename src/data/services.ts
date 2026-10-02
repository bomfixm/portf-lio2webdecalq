import type { ProcessStep, Service, SocialFormat } from "@/types/content";

export const services = [
  {
    id: "web",
    title: "Sites e landing pages",
    description: "Presença digital que apresenta a marca e leva ao contato.",
    details:
      "Da estrutura da página à interface final: sites institucionais, cardápios, portfólios e landing pages responsivas, acessíveis e fáceis de manter.",
    items: [
      "Sites institucionais",
      "Landing pages",
      "Páginas mobile-first",
      "Publicação e ajustes",
    ],
    tone: "light",
  },
  {
    id: "sistemas",
    title: "Sistemas",
    description: "Ferramentas web que seguem a forma como a operação funciona.",
    details:
      "Transformamos regras de negócio em telas, fluxos e dados organizados, com foco no que a equipe realmente usa no dia a dia.",
    items: [
      "Aplicações web",
      "Painéis internos",
      "Fluxos por etapas",
      "Exportação de dados",
    ],
    tone: "blue",
  },
  {
    id: "automacao",
    title: "Automações",
    description: "Menos tarefa repetitiva, mais tempo para o que importa.",
    details:
      "Mapeamos rotinas, tratamos informações e conectamos ferramentas com fluxos claros e rastreáveis.",
    items: [
      "Rotinas automáticas",
      "Integração entre ferramentas",
      "Tratamento de planilhas",
      "Alertas",
    ],
    tone: "violet",
  },
  {
    id: "dados",
    title: "Dashboards e dados",
    description:
      "Números organizados para enxergar melhor e decidir com contexto.",
    details:
      "Consolidamos fontes, padronizamos bases e desenhamos painéis em torno das perguntas que precisam de resposta.",
    items: [
      "Dashboards",
      "Bases padronizadas",
      "Excel e Power Query",
      "Relatórios",
    ],
    tone: "cyan",
  },
  {
    id: "python",
    title: "Projetos Python",
    description:
      "Scripts, ferramentas e serviços quando o problema pede código.",
    details:
      "Python para automatizar, coletar, tratar e servir informação: de scripts de linha de comando a pequenas aplicações web.",
    items: [
      "Scripts e ferramentas",
      "APIs com Flask",
      "Análise com Pandas",
      "Bancos SQLite e PostgreSQL",
    ],
    tone: "sky",
  },
  {
    id: "social",
    title: "Social media",
    description: "Posts e edição de vídeos com a mesma identidade da marca.",
    details:
      "Criação de posts e carrosséis, edição de vídeos curtos e adaptação de formatos para cada rede, com consistência visual entre as peças.",
    items: [
      "Posts e carrosséis",
      "Edição de vídeos",
      "Reels, TikTok e Shorts",
      "Adaptação de formatos",
    ],
    tone: "indigo",
  },
] as const satisfies readonly Service[];

/** Formatos exibidos na composição de social media (ilustrativos). */
export const socialFormats: SocialFormat[] = [
  {
    id: "reels",
    label: "Reels, TikTok e Shorts",
    ratio: "9:16",
    description:
      "Edição de vídeos curtos: cortes, legendas, ritmo e finalização.",
  },
  {
    id: "carrossel",
    label: "Carrossel",
    ratio: "4:5",
    description: "Sequências que explicam uma ideia por partes.",
  },
  {
    id: "post",
    label: "Post único",
    ratio: "1:1",
    description:
      "Peças diretas para avisos, lançamentos e comunicação institucional.",
  },
];

export const socialDisclaimer =
  "Composições ilustrativas dos formatos. Não representam clientes, campanhas ou resultados.";

export const processSteps = [
  {
    title: "Entendimento",
    description: "Entendemos o problema, o objetivo e o contexto.",
  },
  {
    title: "Planejamento",
    description: "Definimos arquitetura, tecnologias e experiência.",
  },
  {
    title: "Desenvolvimento",
    description: "Transformamos o planejamento em uma solução funcional.",
  },
  {
    title: "Entrega",
    description: "Testamos, otimizamos e disponibilizamos o produto.",
  },
] satisfies ProcessStep[];
