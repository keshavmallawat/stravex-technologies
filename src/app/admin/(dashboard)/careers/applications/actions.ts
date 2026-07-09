"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "interview_scheduled"
  | "selected"
  | "rejected";

export async function setApplicationStatusAction(id: string, status: ApplicationStatus) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.careerApplication.update({ where: { id }, data: { status } });
  revalidatePath("/admin/careers");
  return { success: true };
}

export async function toggleApplicationArchivedAction(id: string, archived: boolean) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.careerApplication.update({ where: { id }, data: { archived } });
  revalidatePath("/admin/careers");
  return { success: true };
}

export async function softDeleteApplicationAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.careerApplication.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath("/admin/careers");
  return { success: true };
}

export async function restoreApplicationAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.careerApplication.update({ where: { id }, data: { deletedAt: null } });
  revalidatePath("/admin/careers");
  return { success: true };
}

export async function permanentlyDeleteApplicationAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.careerApplication.delete({ where: { id } });
  revalidatePath("/admin/careers");
  return { success: true };
}
