/**
 * Única fonte de identidade e contatos. Nenhum componente guarda número,
 * e-mail ou link por conta própria: tudo sai daqui.
 *
 * Contatos vêm de variáveis de ambiente (NEXT_PUBLIC_*), definidas no build.
 * WhatsApp: país + DDD + número, só dígitos (ex.: 5511999999999).
 */
const soDigitos = (v?: string) => (v ?? "").replace(/\D/g, "");

const urlDoDeploy =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const siteConfig = {
  name: "Decalq",
  brand: "WEB DECALQ",
  slogan: "Tecnologia transformando ideias em soluções.",
  description:
    "A Decalq desenvolve sites, landing pages, sistemas, automações, projetos Python, dashboards e conteúdo para social media, do problema à entrega.",
  url: urlDoDeploy.replace(/\/$/, ""),
  logo: "/brand/logo.png",
  whatsapp: soDigitos(process.env.NEXT_PUBLIC_WHATSAPP),
  /** Opcional: número das prospecções (`?origem=whatsapp`). Vazio = usa `whatsapp`. */
  whatsappProspeccao: soDigitos(process.env.NEXT_PUBLIC_WHATSAPP_PROSPECCAO),
  email: (process.env.NEXT_PUBLIC_EMAIL ?? "").trim(),
  instagram: "",
  linkedin: "",
  github: "",
} as const;

/** Mensagens de abertura do WhatsApp. */
export const mensagens = {
  padrao:
    "Olá! Vi o portfólio da Decalq e gostaria de conversar sobre um projeto.",
  continuando:
    "Olá! Voltei pelo portfólio da Decalq para continuar nossa conversa sobre um projeto.",
} as const;

export const rotulosContato = {
  padrao: "Conversar sobre meu projeto",
  continuando: "Continuar nossa conversa no WhatsApp",
} as const;
