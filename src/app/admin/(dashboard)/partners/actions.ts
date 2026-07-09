"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { PartnerFormValues, PartnerStatus } from "@/lib/partner-types";

function toData(values: PartnerFormValues) {
  return {
    name: values.name,
    description: values.description || null,
    logoUrl: values.logoUrl || null,
    websiteUrl: values.websiteUrl || null,
    category: values.category,
    status: values.status,
  };
}

export async function createPartnerAction(values: PartnerFormValues) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const maxOrder = await prisma.partner.aggregate({ _max: { sortOrder: true } });

  const partner = await prisma.partner.create({
    data: {
      ...toData(values),
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      authorId: session.user.id ?? null,
    },
  });

  revalidatePath("/admin/partners");
  redirect(`/admin/partners/${partner.id}`);
}

export async function updatePartnerAction(id: string, values: PartnerFormValues) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.partner.update({ where: { id }, data: toData(values) });

  revalidatePath("/admin/partners");
  revalidatePath(`/admin/partners/${id}`);
  return { success: true };
}

export async function setPartnerStatusAction(id: string, status: PartnerStatus) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.partner.update({ where: { id }, data: { status } });
  revalidatePath("/admin/partners");
  return { success: true };
}

export async function softDeletePartnerAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.partner.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath("/admin/partners");
  return { success: true };
}

export async function restorePartnerAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.partner.update({ where: { id }, data: { deletedAt: null } });
  revalidatePath("/admin/partners");
  return { success: true };
}

export async function permanentlyDeletePartnerAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.partner.delete({ where: { id } });
  revalidatePath("/admin/partners");
  return { success: true };
}

export async function reorderPartnerAction(id: string, direction: "up" | "down") {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const partners = await prisma.partner.findMany({
    where: { deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });

  const index = partners.findIndex((p) => p.id === id);
  if (index === -1) return { error: "Partner not found." };

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= partners.length) return { success: true };

  const current = partners[index];
  const swap = partners[swapIndex];

  await prisma.$transaction([
    prisma.partner.update({ where: { id: current.id }, data: { sortOrder: swap.sortOrder } }),
    prisma.partner.update({ where: { id: swap.id }, data: { sortOrder: current.sortOrder } }),
  ]);

  revalidatePath("/admin/partners");
  return { success: true };
}
