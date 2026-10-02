export type Category =
  | "Sites"
  | "Sistemas"
  | "Automações"
  | "Dashboards"
  | "Social media";

/** Ordem de exibição dos filtros; só as categorias com projeto aparecem. */
export const categoryOrder: Category[] = [
  "Sites",
  "Sistemas",
  "Automações",
  "Dashboards",
  "Social media",
];

export type PanelTone = "blue" | "light" | "violet" | "cyan";

export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  /** rótulo curto (segmento do cliente) */
  label: string;
  /** frase de impacto para os painéis da home */
  headline: string;
  shortDescription: string;
  fullDescription: string;
  category: Category;
  year: number;
  /** aparece nos três painéis grandes da home */
  panel: boolean;
  panelTone: PanelTone;
  technologies: string[];
  cover: string;
  /** captura desktop e mobile, para composições */
  desktop: GalleryImage;
  mobile: GalleryImage;
  gallery: GalleryImage[];
  /** 1. contexto e problema */
  challenge: string;
  /** 2. objetivo */
  objective: string;
  /** 3. solução */
  solution: string;
  /** 4. funcionamento */
  analysis: string;
  workflow: { title: string; description: string }[];
  features: string[];
  /** 6. só resultados comprovados; ausente = "sem métricas publicadas" */
  results?: string[];
  github?: string;
  liveUrl?: string;
  video?: string;
  gif?: string;
  /** cases cujo site aceita ser exibido dentro do portfólio */
  iframe?: string;
  demoUrl?: string;
}
