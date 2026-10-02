import type { TechnologyGroup } from "@/types/content";

export const technologyGroups = [
  {
    title: "Front-end",
    description: "Interfaces claras, rápidas e responsivas.",
    items: [
      "React",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
      "Tailwind",
    ],
  },
  {
    title: "Back-end",
    description: "A estrutura por baixo da interface.",
    items: ["Python", "Flask", "Node.js"],
  },
  {
    title: "Dados",
    description: "Informação organizada para decidir melhor.",
    items: ["SQLite", "PostgreSQL", "Excel", "Power Query", "Pandas"],
  },
  {
    title: "Ferramentas",
    description: "Versionamento, edição e publicação.",
    items: ["Git", "GitHub", "VS Code", "Vercel"],
  },
] satisfies TechnologyGroup[];
