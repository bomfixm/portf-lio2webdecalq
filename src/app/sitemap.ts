import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/projetos",
    "/servicos",
    "/sobre",
    "/contato",
    ...projects.map((p) => `/projetos/${p.slug}`),
  ].map((path) => ({
    url: `${siteConfig.url}${path}/`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
