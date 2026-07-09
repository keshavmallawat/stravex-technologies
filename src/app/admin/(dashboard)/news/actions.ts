"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notifications";
import type { ContentPostFormValues, ContentStatus } from "@/lib/content-post-types";

function toData(values: ContentPostFormValues) {
  return {
    title: values.title,
    slug: values.slug,
    status: values.status,
    excerpt: values.excerpt || null,
    content: values.content,
    featuredImageUrl: values.featuredImageUrl || null,
    galleryUrls: values.galleryUrls as object,
    category: values.category || null,
    tags: values.tags as object,
    seoTitle: values.seoTitle || null,
    seoDescription: values.seoDescription || null,
    ogImageUrl: values.ogImageUrl || null,
    publishedAt: values.publishedAt ? new Date(values.publishedAt) : null,
    outlet: values.outlet || null,
    externalUrl: values.externalUrl || null,
  };
}

export async function createNewsPostAction(values: ContentPostFormValues) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const existing = await prisma.newsPost.findUnique({ where: { slug: values.slug } });
  if (existing) return { error: "A news post with this slug already exists." };

  const post = await prisma.newsPost.create({
    data: { ...toData(values), authorId: session.user.id ?? null },
  });

  revalidatePath("/admin/news");
  redirect(`/admin/news/${post.id}`);
}

export async function updateNewsPostAction(id: string, values: ContentPostFormValues) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const existing = await prisma.newsPost.findUnique({ where: { slug: values.slug } });
  if (existing && existing.id !== id) {
    return { error: "A news post with this slug already exists." };
  }

  await prisma.newsPost.update({ where: { id }, data: toData(values) });

  revalidatePath("/admin/news");
  revalidatePath(`/admin/news/${id}`);
  return { success: true };
}

export async function setNewsPostStatusAction(id: string, status: ContentStatus) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const post = await prisma.newsPost.update({ where: { id }, data: { status } });
  if (status === "published") {
    await notify({
      type: "news_published",
      message: `News item published: ${post.title}`,
      linkHref: `/admin/news/${post.id}`,
    });
  }
  revalidatePath("/admin/news");
  return { success: true };
}

export async function softDeleteNewsPostAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.newsPost.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath("/admin/news");
  return { success: true };
}

export async function restoreNewsPostAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.newsPost.update({ where: { id }, data: { deletedAt: null } });
  revalidatePath("/admin/news");
  return { success: true };
}

export async function permanentlyDeleteNewsPostAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.newsPost.delete({ where: { id } });
  revalidatePath("/admin/news");
  return { success: true };
}

export async function duplicateNewsPostAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const source = await prisma.newsPost.findUnique({ where: { id } });
  if (!source) return { error: "News post not found." };

  let slug = `${source.slug}-copy`;
  let suffix = 2;
  while (await prisma.newsPost.findUnique({ where: { slug } })) {
    slug = `${source.slug}-copy-${suffix}`;
    suffix += 1;
  }

  const copy = await prisma.newsPost.create({
    data: {
      title: `${source.title} (Copy)`,
      slug,
      status: "draft",
      excerpt: source.excerpt,
      content: source.content,
      featuredImageUrl: source.featuredImageUrl,
      galleryUrls: source.galleryUrls as object,
      category: source.category,
      tags: source.tags as object,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      ogImageUrl: source.ogImageUrl,
      outlet: source.outlet,
      externalUrl: source.externalUrl,
      authorId: session.user.id ?? null,
    },
  });

  revalidatePath("/admin/news");
  return { success: true, id: copy.id };
}
