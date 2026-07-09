"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import type { SolutionFormValues, TechSolutionStatus } from "@/lib/technology-types";

function toData(values: SolutionFormValues) {
  return {
    name: values.name,
    slug: values.slug,
    description: values.description || null,
    relatedProductSlugs: values.relatedSlugs as object,
    status: values.status,
  };
}

export async function createSolutionAction(values: SolutionFormValues) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const slug = values.slug || slugify(values.name);
  const existing = await prisma.solution.findUnique({ where: { slug } });
  if (existing) return { error: "A solution with this slug already exists." };

  await prisma.solution.create({
    data: { ...toData(values), slug, authorId: session.user.id ?? null },
  });

  revalidatePath("/admin/technologies");
  return { success: true };
}

export async function updateSolutionAction(id: string, values: SolutionFormValues) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.solution.update({ where: { id }, data: toData(values) });
  revalidatePath("/admin/technologies");
  return { success: true };
}

export async function setSolutionStatusAction(id: string, status: TechSolutionStatus) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.solution.update({ where: { id }, data: { status } });
  revalidatePath("/admin/technologies");
  return { success: true };
}

export async function softDeleteSolutionAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.solution.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath("/admin/technologies");
  return { success: true };
}

export async function restoreSolutionAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.solution.update({ where: { id }, data: { deletedAt: null } });
  revalidatePath("/admin/technologies");
  return { success: true };
}

export async function permanentlyDeleteSolutionAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.solution.delete({ where: { id } });
  revalidatePath("/admin/technologies");
  return { success: true };
}
