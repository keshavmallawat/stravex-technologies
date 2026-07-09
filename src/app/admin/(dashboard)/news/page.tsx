import { prisma } from "@/lib/prisma";
import { NewsTable } from "@/components/admin/news/news-table";

export const metadata = {
  title: "News Manager | Stravex CMS",
};

const PAGE_SIZE = 10;

export default async function AdminNewsPage({
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
    ...(q ? { OR: [{ title: { contains: q } }, { slug: { contains: q } }] } : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.newsPost.findMany({
      where,
      orderBy: trash ? { updatedAt: "desc" } : { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.newsPost.count({ where }),
  ]);

  return (
    <NewsTable
      posts={posts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        outlet: p.outlet,
        status: p.status,
        viewCount: p.viewCount,
        updatedAt: p.updatedAt.toISOString(),
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
