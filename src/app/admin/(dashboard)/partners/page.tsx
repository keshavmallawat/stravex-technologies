import { prisma } from "@/lib/prisma";
import { PartnersTable } from "@/components/admin/partners/partners-table";

export const metadata = {
  title: "Partners | Stravex CMS",
};

export default async function AdminPartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ trash?: string }>;
}) {
  const { trash: trashParam } = await searchParams;
  const trash = trashParam === "1";

  const partners = await prisma.partner.findMany({
    where: { deletedAt: trash ? { not: null } : null },
    orderBy: trash ? { updatedAt: "desc" } : { sortOrder: "asc" },
  });

  return (
    <PartnersTable
      partners={partners.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        status: p.status,
      }))}
      total={partners.length}
      trash={trash}
    />
  );
}
