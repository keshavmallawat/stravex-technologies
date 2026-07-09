import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/products/product-form";

export const metadata = {
  title: "New Product | Stravex CMS",
};

export default async function NewProductPage() {
  const otherProducts = await prisma.product.findMany({
    where: { deletedAt: null },
    select: { slug: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <span className="font-mono-label text-[10px] uppercase text-ink/40">
        [ Products / New ]
      </span>
      <h2 className="mt-2 text-2xl font-semibold text-ink">New Product</h2>

      <div className="mt-6">
        <ProductForm otherProducts={otherProducts} />
      </div>
    </div>
  );
}
