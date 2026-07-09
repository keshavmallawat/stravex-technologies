"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export interface PageSeoUpdateValues {
  title: string;
  metaDescription: string;
  ogImageUrl: string;
  canonicalUrl: string;
  robots: string;
  keywords: string[];
}

export async function updatePageSeoAction(pageKey: string, values: PageSeoUpdateValues) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.pageSeo.upsert({
    where: { pageKey },
    update: {
      title: values.title || null,
      metaDescription: values.metaDescription || null,
      ogImageUrl: values.ogImageUrl || null,
      canonicalUrl: values.canonicalUrl || null,
      robots: values.robots || "index,follow",
      keywords: values.keywords as object,
    },
    create: {
      pageKey,
      title: values.title || null,
      metaDescription: values.metaDescription || null,
      ogImageUrl: values.ogImageUrl || null,
      canonicalUrl: values.canonicalUrl || null,
      robots: values.robots || "index,follow",
      keywords: values.keywords as object,
    },
  });

  revalidatePath("/admin/seo");
  revalidatePath("/", "layout");
  return { success: true };
}
