"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { TeamMemberFormValues, TeamMemberStatus } from "@/lib/team-types";

function toData(values: TeamMemberFormValues) {
  return {
    name: values.name,
    role: values.role,
    department: values.department || null,
    bio: values.bio || null,
    photoUrl: values.photoUrl || null,
    expertiseTags: values.expertiseTags as object,
    socialLinks: {
      linkedin: values.socialLinkedin || undefined,
      twitter: values.socialTwitter || undefined,
      email: values.socialEmail || undefined,
    } as object,
    status: values.status,
    featured: values.featured,
  };
}

export async function createTeamMemberAction(values: TeamMemberFormValues) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const maxOrder = await prisma.teamMember.aggregate({ _max: { sortOrder: true } });

  const member = await prisma.teamMember.create({
    data: {
      ...toData(values),
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      authorId: session.user.id ?? null,
    },
  });

  revalidatePath("/admin/team");
  redirect(`/admin/team/${member.id}`);
}

export async function updateTeamMemberAction(id: string, values: TeamMemberFormValues) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.teamMember.update({ where: { id }, data: toData(values) });

  revalidatePath("/admin/team");
  revalidatePath(`/admin/team/${id}`);
  return { success: true };
}

export async function setTeamMemberStatusAction(id: string, status: TeamMemberStatus) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.teamMember.update({ where: { id }, data: { status } });
  revalidatePath("/admin/team");
  return { success: true };
}

export async function toggleTeamMemberFeaturedAction(id: string, featured: boolean) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.teamMember.update({ where: { id }, data: { featured } });
  revalidatePath("/admin/team");
  return { success: true };
}

export async function softDeleteTeamMemberAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.teamMember.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath("/admin/team");
  return { success: true };
}

export async function restoreTeamMemberAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.teamMember.update({ where: { id }, data: { deletedAt: null } });
  revalidatePath("/admin/team");
  return { success: true };
}

export async function permanentlyDeleteTeamMemberAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.teamMember.delete({ where: { id } });
  revalidatePath("/admin/team");
  return { success: true };
}

export async function reorderTeamMemberAction(id: string, direction: "up" | "down") {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const members = await prisma.teamMember.findMany({
    where: { deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });

  const index = members.findIndex((m) => m.id === id);
  if (index === -1) return { error: "Team member not found." };

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= members.length) return { success: true };

  const current = members[index];
  const swap = members[swapIndex];

  await prisma.$transaction([
    prisma.teamMember.update({ where: { id: current.id }, data: { sortOrder: swap.sortOrder } }),
    prisma.teamMember.update({ where: { id: swap.id }, data: { sortOrder: current.sortOrder } }),
  ]);

  revalidatePath("/admin/team");
  return { success: true };
}
