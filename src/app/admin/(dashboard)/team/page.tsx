import { prisma } from "@/lib/prisma";
import { TeamTable } from "@/components/admin/team/team-table";

export const metadata = {
  title: "Team | Stravex CMS",
};

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: Promise<{ trash?: string }>;
}) {
  const { trash: trashParam } = await searchParams;
  const trash = trashParam === "1";

  const members = await prisma.teamMember.findMany({
    where: { deletedAt: trash ? { not: null } : null },
    orderBy: trash ? { updatedAt: "desc" } : { sortOrder: "asc" },
  });

  return (
    <TeamTable
      members={members.map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        department: m.department,
        status: m.status,
        featured: m.featured,
      }))}
      total={members.length}
      trash={trash}
    />
  );
}
