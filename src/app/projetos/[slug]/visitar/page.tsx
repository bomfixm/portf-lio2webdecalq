import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, projectBySlug } from "@/data/projects";
import { SiteViewer } from "@/components/SiteViewer";

export const dynamicParams = false;

/** Só os cases que permitem ser embutidos (campo `iframe`). */
export function generateStaticParams() {
  return projects.filter((p) => p.iframe).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return { title: "Projeto não encontrado" };
  return {
    title: `${p.title}: site publicado`,
    description: p.shortDescription,
    robots: { index: false, follow: true },
  };
}

export default async function ViewerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p?.iframe) notFound();
  return (
    <SiteViewer title={p.title} url={p.iframe} caseHref={`/projetos/${p.slug}/`} />
  );
}
