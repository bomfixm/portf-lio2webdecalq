export const serviceIcons = [
  "web",
  "sistemas",
  "automacao",
  "python",
  "dados",
  "social",
] as const;
export type ServiceIcon = (typeof serviceIcons)[number];

export interface Service {
  id: ServiceIcon;
  title: string;
  description: string;
  details: string;
  items: string[];
  tone: "light" | "blue" | "violet" | "cyan" | "indigo" | "sky";
}

export interface SocialFormat {
  id: string;
  label: string;
  ratio: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface TechnologyGroup {
  title: string;
  description: string;
  items: string[];
}

export interface Principle {
  title: string;
  description: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}
