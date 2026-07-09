import { prisma } from "@/lib/prisma";
import { BlogTable } from "@/components/admin/blog/blog-table";

export const metadata = {
  title: "Blog Manager | Stravex CMS",
};

const PAGE_SIZE = 10;

export default async function AdminBlogPage({
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
    prisma.blogPost.findMany({
      where,
      orderBy: trash ? { updatedAt: "desc" } : { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return (
    <BlogTable
      posts={posts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        status: p.status,
        viewCount: p.viewCount,
        publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
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
