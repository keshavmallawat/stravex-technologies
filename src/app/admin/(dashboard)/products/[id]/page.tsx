import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/products/product-form";
import type {
  ProductFormValues,
  WorkflowStage,
  TechnicalSpec,
  FeatureListSection,
} from "@/lib/product-types";
import type { ProductContentBlockValues, BlockContent } from "@/lib/product-block-types";

export const metadata = {
  title: "Edit Product | Stravex CMS",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, otherProducts, blocks] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.product.findMany({
      where: { deletedAt: null, id: { not: id } },
      select: { slug: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.productContentBlock.findMany({
      where: { productId: id },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  if (!product) notFound();

  const initialBlocks: ProductContentBlockValues[] = blocks.map((b) => ({
    id: b.id,
    type: b.type as ProductContentBlockValues["type"],
    sortOrder: b.sortOrder,
    content: b.content as unknown as BlockContent,
  }));

  const initialValues: ProductFormValues = {
    name: product.name,
    slug: product.slug,
    category: product.category,
    status: product.status as ProductFormValues["status"],
    displayStatus: product.displayStatus,
    featured: product.featured,
    heroImageAspect: product.heroImageAspect,
    tagline: product.tagline ?? "",
    positioning: product.positioning ?? "",
    purpose: product.purpose ?? "",
    problemStatement: product.problemStatement ?? "",
    missionProfile: product.missionProfile ?? "",
    designGoals: product.designGoals as string[],
    workflow: product.workflow as unknown as WorkflowStage[],
    coreCapabilities: product.coreCapabilities as string[],
    keyFeatures: product.keyFeatures as string[],
    technicalSpecs: product.technicalSpecs as unknown as TechnicalSpec[],
    applications: product.applications as string[],
    relatedTechnologies: product.relatedTechnologies as string[],
    extraFeatureLists: product.extraFeatureLists as unknown as FeatureListSection[],
    heroPosterUrl: product.heroPosterUrl ?? "",
    galleryUrls: product.galleryUrls as string[],
    datasheetUrl: product.datasheetUrl ?? "",
    heroTitle: product.heroTitle ?? "",
    ctaLabel: product.ctaLabel ?? "",
    ctaHref: product.ctaHref ?? "",
    relatedProductSlugs: product.relatedProductSlugs as string[],
    seoTitle: product.seoTitle ?? "",
    seoDescription: product.seoDescription ?? "",
    ogImageUrl: product.ogImageUrl ?? "",
  };

  return (
    <div>
      <span className="font-mono-label text-[10px] uppercase text-ink/40">
        [ Products / Edit ]
      </span>
      <h2 className="mt-2 text-2xl font-semibold text-ink">{product.name}</h2>

      <div className="mt-6">
        <ProductForm
          productId={product.id}
          initialValues={initialValues}
          otherProducts={otherProducts}
          initialBlocks={initialBlocks}
        />
      </div>
    </div>
  );
}
