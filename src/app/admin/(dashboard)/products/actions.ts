"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ProductFormValues, ProductWorkflowStatus } from "@/lib/product-types";

function toData(values: ProductFormValues) {
  return {
    name: values.name,
    slug: values.slug,
    category: values.category,
    status: values.status,
    displayStatus: values.displayStatus,
    featured: values.featured,
    heroImageAspect: values.heroImageAspect,
    tagline: values.tagline || null,
    positioning: values.positioning || null,
    purpose: values.purpose || null,
    problemStatement: values.problemStatement || null,
    missionProfile: values.missionProfile || null,
    designGoals: values.designGoals as object,
    workflow: values.workflow as object,
    coreCapabilities: values.coreCapabilities as object,
    keyFeatures: values.keyFeatures as object,
    technicalSpecs: values.technicalSpecs as object,
    applications: values.applications as object,
    relatedTechnologies: values.relatedTechnologies as object,
    extraFeatureLists: values.extraFeatureLists as object,
    heroPosterUrl: values.heroPosterUrl || null,
    galleryUrls: values.galleryUrls as object,
    datasheetUrl: values.datasheetUrl || null,
    heroTitle: values.heroTitle || null,
    ctaLabel: values.ctaLabel || null,
    ctaHref: values.ctaHref || null,
    relatedProductSlugs: values.relatedProductSlugs as object,
    seoTitle: values.seoTitle || null,
    seoDescription: values.seoDescription || null,
    ogImageUrl: values.ogImageUrl || null,
  };
}

export async function createProductAction(values: ProductFormValues) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const existing = await prisma.product.findUnique({ where: { slug: values.slug } });
  if (existing) return { error: "A product with this slug already exists." };

  const maxOrder = await prisma.product.aggregate({ _max: { sortOrder: true } });

  const product = await prisma.product.create({
    data: {
      ...toData(values),
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      authorId: session.user.id ?? null,
    },
  });

  revalidatePath("/admin/products");
  redirect(`/admin/products/${product.id}`);
}

export async function updateProductAction(id: string, values: ProductFormValues) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const existing = await prisma.product.findUnique({ where: { slug: values.slug } });
  if (existing && existing.id !== id) {
    return { error: "A product with this slug already exists." };
  }

  await prisma.product.update({ where: { id }, data: toData(values) });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  return { success: true };
}

export async function setProductStatusAction(id: string, status: ProductWorkflowStatus) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.product.update({ where: { id }, data: { status } });
  revalidatePath("/admin/products");
  return { success: true };
}

export async function toggleProductFeaturedAction(id: string, featured: boolean) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.product.update({ where: { id }, data: { featured } });
  revalidatePath("/admin/products");
  return { success: true };
}

export async function softDeleteProductAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.product.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath("/admin/products");
  return { success: true };
}

export async function restoreProductAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.product.update({ where: { id }, data: { deletedAt: null } });
  revalidatePath("/admin/products");
  return { success: true };
}

export async function permanentlyDeleteProductAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  return { success: true };
}

export async function duplicateProductAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const source = await prisma.product.findUnique({ where: { id } });
  if (!source) return { error: "Product not found." };

  const maxOrder = await prisma.product.aggregate({ _max: { sortOrder: true } });

  let slug = `${source.slug}-copy`;
  let suffix = 2;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${source.slug}-copy-${suffix}`;
    suffix += 1;
  }

  const copy = await prisma.product.create({
    data: {
      name: `${source.name} (Copy)`,
      slug,
      category: source.category,
      status: "draft",
      displayStatus: source.displayStatus,
      featured: false,
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      heroImageAspect: source.heroImageAspect,
      tagline: source.tagline,
      positioning: source.positioning,
      purpose: source.purpose,
      problemStatement: source.problemStatement,
      missionProfile: source.missionProfile,
      designGoals: source.designGoals as object,
      workflow: source.workflow as object,
      coreCapabilities: source.coreCapabilities as object,
      keyFeatures: source.keyFeatures as object,
      technicalSpecs: source.technicalSpecs as object,
      applications: source.applications as object,
      relatedTechnologies: source.relatedTechnologies as object,
      extraFeatureLists: source.extraFeatureLists as object,
      heroPosterUrl: source.heroPosterUrl,
      galleryUrls: source.galleryUrls as object,
      datasheetUrl: source.datasheetUrl,
      heroTitle: source.heroTitle,
      ctaLabel: source.ctaLabel,
      ctaHref: source.ctaHref,
      relatedProductSlugs: source.relatedProductSlugs as object,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      ogImageUrl: source.ogImageUrl,
      authorId: session.user.id ?? null,
    },
  });

  revalidatePath("/admin/products");
  return { success: true, id: copy.id };
}

export async function reorderProductAction(
  id: string,
  direction: "up" | "down",
  category?: string
) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const products = await prisma.product.findMany({
    where: { deletedAt: null, ...(category ? { category } : {}) },
    orderBy: { sortOrder: "asc" },
  });

  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return { error: "Product not found." };

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= products.length) return { success: true };

  const current = products[index];
  const swap = products[swapIndex];

  await prisma.$transaction([
    prisma.product.update({ where: { id: current.id }, data: { sortOrder: swap.sortOrder } }),
    prisma.product.update({ where: { id: swap.id }, data: { sortOrder: current.sortOrder } }),
  ]);

  revalidatePath("/admin/products");
  return { success: true };
}
