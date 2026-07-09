import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllProductSlugs,
  getPublishedProductBySlug,
  getPublishedProducts,
  getRelatedProducts,
  getProductContentBlocks,
} from "@/lib/products-data";
import { getPublishedTechnologies } from "@/lib/technologies-data";
import { ProductDetailView } from "@/components/product/product-detail-view";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seoTitle || `${product.name} | Stravex Technologies`,
    description: product.seoDescription || product.positioning || undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);
  if (!product) notFound();

  const allProducts = await getPublishedProducts();
  const index = allProducts.findIndex((p) => p.slug === slug);
  const next = allProducts[(index + 1) % allProducts.length];
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
      next={next}
      contentBlocks={contentBlocks}
    />
  );
}
