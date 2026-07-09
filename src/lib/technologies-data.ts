import { prisma } from "@/lib/prisma";

export interface PublicTechnology {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  appliedInProductSlugs: string[];
}

export async function getTechnologyByName(name: string): Promise<PublicTechnology | null> {
  const tech = await prisma.technology.findFirst({
    where: { name, status: "published", deletedAt: null },
  });
  if (!tech) return null;
  return {
    id: tech.id,
    name: tech.name,
    slug: tech.slug,
    description: tech.description,
    appliedInProductSlugs: tech.appliedInProductSlugs as string[],
  };
}

export async function getPublishedTechnologies(): Promise<PublicTechnology[]> {
  const rows = await prisma.technology.findMany({
    where: { status: "published", deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description,
    appliedInProductSlugs: t.appliedInProductSlugs as string[],
  }));
}
