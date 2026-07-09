import { prisma } from "@/lib/prisma";
import type { WorkflowStage, TechnicalSpec, FeatureListSection } from "@/lib/product-types";
import type { ProductContentBlockValues, BlockContent } from "@/lib/product-block-types";

export interface PublicProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  displayStatus: string;
  featured: boolean;
  tagline: string | null;
  positioning: string | null;
  purpose: string | null;
  problemStatement: string | null;
  missionProfile: string | null;
  heroImageAspect: string;
  designGoals: string[];
  workflow: WorkflowStage[];
  coreCapabilities: string[];
  keyFeatures: string[];
  technicalSpecs: TechnicalSpec[];
  applications: string[];
  relatedTechnologies: string[];
  extraFeatureLists: FeatureListSection[];
  heroPosterUrl: string | null;
  galleryUrls: string[];
  datasheetUrl: string | null;
  heroTitle: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  relatedProductSlugs: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
}

function toPublicProduct(product: {
  id: string;
  name: string;
  slug: string;
  category: string;
  displayStatus: string;
  featured: boolean;
  tagline: string | null;
  positioning: string | null;
  purpose: string | null;
  problemStatement: string | null;
  missionProfile: string | null;
  heroImageAspect: string;
  designGoals: unknown;
  workflow: unknown;
  coreCapabilities: unknown;
  keyFeatures: unknown;
  technicalSpecs: unknown;
  applications: unknown;
  relatedTechnologies: unknown;
  extraFeatureLists: unknown;
  heroPosterUrl: string | null;
  galleryUrls: unknown;
  datasheetUrl: string | null;
  heroTitle: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  relatedProductSlugs: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
}): PublicProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    displayStatus: product.displayStatus,
    featured: product.featured,
    tagline: product.tagline,
    positioning: product.positioning,
    purpose: product.purpose,
    problemStatement: product.problemStatement,
    missionProfile: product.missionProfile,
    heroImageAspect: product.heroImageAspect,
    designGoals: product.designGoals as string[],
    workflow: product.workflow as unknown as WorkflowStage[],
    coreCapabilities: product.coreCapabilities as string[],
    keyFeatures: product.keyFeatures as string[],
    technicalSpecs: product.technicalSpecs as unknown as TechnicalSpec[],
    applications: product.applications as string[],
    relatedTechnologies: product.relatedTechnologies as string[],
    extraFeatureLists: product.extraFeatureLists as unknown as FeatureListSection[],
    heroPosterUrl: product.heroPosterUrl,
    galleryUrls: product.galleryUrls as string[],
    datasheetUrl: product.datasheetUrl,
    heroTitle: product.heroTitle,
    ctaLabel: product.ctaLabel,
    ctaHref: product.ctaHref,
    relatedProductSlugs: product.relatedProductSlugs as string[],
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    ogImageUrl: product.ogImageUrl,
  };
}

export async function getPublishedProducts(): Promise<PublicProduct[]> {
  const products = await prisma.product.findMany({
    where: { status: "published", deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
  return products.map(toPublicProduct);
}

export async function getPublishedProductBySlug(
  slug: string
): Promise<PublicProduct | null> {
  const product = await prisma.product.findFirst({
    where: { slug, status: "published", deletedAt: null },
  });
  return product ? toPublicProduct(product) : null;
}

/** Admin-preview only: fetches by id regardless of status (draft/archived included). */
export async function getProductByIdForPreview(id: string): Promise<PublicProduct | null> {
  const product = await prisma.product.findFirst({ where: { id, deletedAt: null } });
  return product ? toPublicProduct(product) : null;
}

export async function getRelatedProducts(slugs: string[]): Promise<PublicProduct[]> {
  if (slugs.length === 0) return [];
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs }, status: "published", deletedAt: null },
  });
  return products.map(toPublicProduct);
}

export async function getProductContentBlocks(
  productId: string
): Promise<ProductContentBlockValues[]> {
  const blocks = await prisma.productContentBlock.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  });
  return blocks.map((b) => ({
    id: b.id,
    type: b.type as ProductContentBlockValues["type"],
    sortOrder: b.sortOrder,
    content: b.content as unknown as BlockContent,
  }));
}

export async function getAllProductSlugs(): Promise<string[]> {
  const products = await prisma.product.findMany({
    where: { status: "published", deletedAt: null },
    select: { slug: true },
  });
  return products.map((p) => p.slug);
}
