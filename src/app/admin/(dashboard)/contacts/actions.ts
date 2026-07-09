"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ContactStatus = "unread" | "read" | "replied" | "archived";

export async function setContactStatusAction(id: string, status: ContactStatus) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.contact.update({ where: { id }, data: { status } });
  revalidatePath("/admin/contacts");
  return { success: true };
}

export async function softDeleteContactAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.contact.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath("/admin/contacts");
  return { success: true };
}

export async function restoreContactAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.contact.update({ where: { id }, data: { deletedAt: null } });
  revalidatePath("/admin/contacts");
  return { success: true };
}

export async function permanentlyDeleteContactAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.contact.delete({ where: { id } });
  revalidatePath("/admin/contacts");
  return { success: true };
}
