"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import type { TechnologyFormValues, TechSolutionStatus } from "@/lib/technology-types";

function toData(values: TechnologyFormValues) {
  return {
    name: values.name,
    slug: values.slug,
    description: values.description || null,
    appliedInProductSlugs: values.relatedSlugs as object,
    status: values.status,
  };
}

export async function createTechnologyAction(values: TechnologyFormValues) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const slug = values.slug || slugify(values.name);
  const existing = await prisma.technology.findUnique({ where: { slug } });
  if (existing) return { error: "A technology with this slug already exists." };

  await prisma.technology.create({
    data: { ...toData(values), slug, authorId: session.user.id ?? null },
  });

  revalidatePath("/admin/technologies");
  return { success: true };
}

export async function updateTechnologyAction(id: string, values: TechnologyFormValues) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.technology.update({ where: { id }, data: toData(values) });
  revalidatePath("/admin/technologies");
  return { success: true };
}

export async function setTechnologyStatusAction(id: string, status: TechSolutionStatus) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.technology.update({ where: { id }, data: { status } });
  revalidatePath("/admin/technologies");
  return { success: true };
}

export async function softDeleteTechnologyAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.technology.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath("/admin/technologies");
  return { success: true };
}

export async function restoreTechnologyAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.technology.update({ where: { id }, data: { deletedAt: null } });
  revalidatePath("/admin/technologies");
  return { success: true };
}

export async function permanentlyDeleteTechnologyAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.technology.delete({ where: { id } });
  revalidatePath("/admin/technologies");
  return { success: true };
}
