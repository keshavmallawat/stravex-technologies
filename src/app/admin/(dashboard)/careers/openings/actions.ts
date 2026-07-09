"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { JobOpeningFormValues, JobOpeningStatus } from "@/lib/job-opening-types";

function toData(values: JobOpeningFormValues) {
  return {
    title: values.title,
    slug: values.slug,
    status: values.status,
    featured: values.featured,
    department: values.department,
    employmentType: values.employmentType,
    experience: values.experience || null,
    location: values.location,
    workMode: values.workMode,
    responsibilities: values.responsibilities as object,
    requirements: values.requirements as object,
    skills: values.skills as object,
    salary: values.salary || null,
    expiryDate: values.expiryDate ? new Date(values.expiryDate) : null,
  };
}

export async function createJobOpeningAction(values: JobOpeningFormValues) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const existing = await prisma.jobOpening.findUnique({ where: { slug: values.slug } });
  if (existing) return { error: "A job opening with this slug already exists." };

  const maxOrder = await prisma.jobOpening.aggregate({ _max: { sortOrder: true } });

  const job = await prisma.jobOpening.create({
    data: {
      ...toData(values),
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      authorId: session.user.id ?? null,
    },
  });

  revalidatePath("/admin/careers");
  redirect(`/admin/careers/openings/${job.id}`);
}

export async function updateJobOpeningAction(id: string, values: JobOpeningFormValues) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const existing = await prisma.jobOpening.findUnique({ where: { slug: values.slug } });
  if (existing && existing.id !== id) {
    return { error: "A job opening with this slug already exists." };
  }

  await prisma.jobOpening.update({ where: { id }, data: toData(values) });

  revalidatePath("/admin/careers");
  revalidatePath(`/admin/careers/openings/${id}`);
  return { success: true };
}

export async function setJobOpeningStatusAction(id: string, status: JobOpeningStatus) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.jobOpening.update({ where: { id }, data: { status } });
  revalidatePath("/admin/careers");
  return { success: true };
}

export async function toggleJobOpeningFeaturedAction(id: string, featured: boolean) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.jobOpening.update({ where: { id }, data: { featured } });
  revalidatePath("/admin/careers");
  return { success: true };
}

export async function softDeleteJobOpeningAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.jobOpening.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath("/admin/careers");
  return { success: true };
}

export async function restoreJobOpeningAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.jobOpening.update({ where: { id }, data: { deletedAt: null } });
  revalidatePath("/admin/careers");
  return { success: true };
}

export async function permanentlyDeleteJobOpeningAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.jobOpening.delete({ where: { id } });
  revalidatePath("/admin/careers");
  return { success: true };
}

export async function duplicateJobOpeningAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const source = await prisma.jobOpening.findUnique({ where: { id } });
  if (!source) return { error: "Job opening not found." };

  const maxOrder = await prisma.jobOpening.aggregate({ _max: { sortOrder: true } });

  let slug = `${source.slug}-copy`;
  let suffix = 2;
  while (await prisma.jobOpening.findUnique({ where: { slug } })) {
    slug = `${source.slug}-copy-${suffix}`;
    suffix += 1;
  }

  const copy = await prisma.jobOpening.create({
    data: {
      title: `${source.title} (Copy)`,
      slug,
      status: "draft",
      featured: false,
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      department: source.department,
      employmentType: source.employmentType,
      experience: source.experience,
      location: source.location,
      workMode: source.workMode,
      responsibilities: source.responsibilities as object,
      requirements: source.requirements as object,
      skills: source.skills as object,
      salary: source.salary,
      expiryDate: source.expiryDate,
      authorId: session.user.id ?? null,
    },
  });

  revalidatePath("/admin/careers");
  return { success: true, id: copy.id };
}

export async function reorderJobOpeningAction(id: string, direction: "up" | "down") {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const jobs = await prisma.jobOpening.findMany({
    where: { deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });

  const index = jobs.findIndex((j) => j.id === id);
  if (index === -1) return { error: "Job opening not found." };

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= jobs.length) return { success: true };

  const current = jobs[index];
  const swap = jobs[swapIndex];

  await prisma.$transaction([
    prisma.jobOpening.update({ where: { id: current.id }, data: { sortOrder: swap.sortOrder } }),
    prisma.jobOpening.update({ where: { id: swap.id }, data: { sortOrder: current.sortOrder } }),
  ]);

  revalidatePath("/admin/careers");
  return { success: true };
}
