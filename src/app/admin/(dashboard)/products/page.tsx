import { prisma } from "@/lib/prisma";
import { ProductsTable } from "@/components/admin/products/products-table";

export const metadata = {
  title: "Products | Stravex CMS",
};

const PAGE_SIZE = 10;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    category?: string;
    page?: string;
    trash?: string;
  }>;
}) {
  const {
    q = "",
    status = "",
    category = "",
    page: pageParam,
    trash: trashParam,
  } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const trash = trashParam === "1";

  const where = {
    deletedAt: trash ? { not: null } : null,
    ...(status && status !== "all" ? { status } : {}),
    ...(category ? { category } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { slug: { contains: q } },
            { category: { contains: q } },
          ],
        }
      : {}),
  };

  const [products, total, allCategories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: trash ? { updatedAt: "desc" } : { sortOrder: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where: { deletedAt: null },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  return (
    <ProductsTable
      products={products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        status: p.status,
        featured: p.featured,
        updatedAt: p.updatedAt.toISOString(),
      }))}
      total={total}
      page={page}
      pageSize={PAGE_SIZE}
      q={q}
      status={status}
      category={category}
      categories={allCategories.map((c) => c.category)}
      trash={trash}
    />
  );
}
