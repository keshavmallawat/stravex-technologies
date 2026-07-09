"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { HomepageItem } from "@/lib/homepage-data";

export interface HomepageSectionUpdateValues {
  heading: string;
  body: string;
  eyebrow: string;
  items: HomepageItem[];
  missionText: string;
  visionText: string;
  badgeLabel: string;
  badgeSubline: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  imageUrl: string;
  mediaUrls: string[];
  enabled: boolean;
}

export async function updateHomepageSectionAction(
  key: string,
  values: HomepageSectionUpdateValues
) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.homepageSection.update({
    where: { key },
    data: {
      heading: values.heading || null,
      body: values.body || null,
      content: {
        eyebrow: values.eyebrow,
        items: values.items,
        missionText: values.missionText,
        visionText: values.visionText,
        badgeLabel: values.badgeLabel,
        badgeSubline: values.badgeSubline,
      } as object,
      ctaLabel: values.ctaLabel || null,
      ctaHref: values.ctaHref || null,
      secondaryCtaLabel: values.secondaryCtaLabel || null,
      secondaryCtaHref: values.secondaryCtaHref || null,
      imageUrl: values.imageUrl || null,
      mediaUrls: values.mediaUrls as object,
      enabled: values.enabled,
    },
  });

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { success: true };
}

export async function reorderHomepageSectionAction(key: string, direction: "up" | "down") {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const sections = await prisma.homepageSection.findMany({ orderBy: { sortOrder: "asc" } });
  const index = sections.findIndex((s) => s.key === key);
  if (index === -1) return { error: "Section not found." };

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= sections.length) return { success: true };

  const current = sections[index];
  const swap = sections[swapIndex];

  await prisma.$transaction([
    prisma.homepageSection.update({ where: { key: current.key }, data: { sortOrder: swap.sortOrder } }),
    prisma.homepageSection.update({ where: { key: swap.key }, data: { sortOrder: current.sortOrder } }),
  ]);

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { success: true };
}
