import { prisma } from "@/lib/prisma";

export interface PublicSolution {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  relatedProductSlugs: string[];
}

export async function getPublishedSolutions(): Promise<PublicSolution[]> {
  const rows = await prisma.solution.findMany({
    where: { status: "published", deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description,
    relatedProductSlugs: s.relatedProductSlugs as string[],
  }));
}
