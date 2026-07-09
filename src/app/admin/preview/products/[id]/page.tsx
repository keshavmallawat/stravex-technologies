import { notFound } from "next/navigation";
import {
  getProductByIdForPreview,
  getRelatedProducts,
  getProductContentBlocks,
} from "@/lib/products-data";
import { getPublishedTechnologies } from "@/lib/technologies-data";
import { ProductDetailView } from "@/components/product/product-detail-view";

export default async function ProductPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductByIdForPreview(id);
  if (!product) notFound();

  const [relatedProducts, allTechnologies, contentBlocks] = await Promise.all([
    getRelatedProducts(product.relatedProductSlugs),
    getPublishedTechnologies(),
    getProductContentBlocks(product.id),
  ]);

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
      allTechnologies={allTechnologies}
      contentBlocks={contentBlocks}
      isPreview
    />
  );
}
