import { prisma } from "@/lib/prisma";
import { ContactsTable } from "@/components/admin/contacts/contacts-table";

export const metadata = {
  title: "Contact Manager | Stravex CMS",
};

const PAGE_SIZE = 15;

export default async function AdminContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string; trash?: string }>;
}) {
  const { q = "", status = "", page: pageParam, trash: trashParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const trash = trashParam === "1";

  const where = {
    deletedAt: trash ? { not: null } : null,
    ...(status && status !== "all" ? { status } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { company: { contains: q } },
          ],
        }
      : {}),
  };

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.contact.count({ where }),
  ]);

  return (
    <ContactsTable
      contacts={contacts.map((c) => ({
        id: c.id,
        name: c.name,
        company: c.company,
        email: c.email,
        phone: c.phone,
        message: c.message,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
      }))}
      total={total}
      page={page}
      pageSize={PAGE_SIZE}
      q={q}
      status={status}
      trash={trash}
    />
  );
}
