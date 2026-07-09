import { prisma } from "@/lib/prisma";

export interface PublicPartner {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  category: string;
}

export async function getActivePartners(category?: "incubator" | "partner"): Promise<PublicPartner[]> {
  const partners = await prisma.partner.findMany({
    where: {
      status: "active",
      deletedAt: null,
      ...(category ? { category } : {}),
    },
    orderBy: { sortOrder: "asc" },
  });

  return partners.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    logoUrl: p.logoUrl,
    websiteUrl: p.websiteUrl,
    category: p.category,
  }));
}
