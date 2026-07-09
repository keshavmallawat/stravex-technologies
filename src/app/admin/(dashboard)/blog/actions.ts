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
  };
}

export async function createBlogPostAction(values: ContentPostFormValues) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const existing = await prisma.blogPost.findUnique({ where: { slug: values.slug } });
  if (existing) return { error: "A blog post with this slug already exists." };

  const post = await prisma.blogPost.create({
    data: { ...toData(values), authorId: session.user.id ?? null },
  });

  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${post.id}`);
}

export async function updateBlogPostAction(id: string, values: ContentPostFormValues) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const existing = await prisma.blogPost.findUnique({ where: { slug: values.slug } });
  if (existing && existing.id !== id) {
    return { error: "A blog post with this slug already exists." };
  }

  await prisma.blogPost.update({ where: { id }, data: toData(values) });

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  return { success: true };
}

export async function setBlogPostStatusAction(id: string, status: ContentStatus) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const post = await prisma.blogPost.update({ where: { id }, data: { status } });
  if (status === "published") {
    await notify({
      type: "blog_published",
      message: `Blog post published: ${post.title}`,
      linkHref: `/admin/blog/${post.id}`,
    });
  }
  revalidatePath("/admin/blog");
  return { success: true };
}

export async function softDeleteBlogPostAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.blogPost.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath("/admin/blog");
  return { success: true };
}

export async function restoreBlogPostAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.blogPost.update({ where: { id }, data: { deletedAt: null } });
  revalidatePath("/admin/blog");
  return { success: true };
}

export async function permanentlyDeleteBlogPostAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  return { success: true };
}

export async function duplicateBlogPostAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const source = await prisma.blogPost.findUnique({ where: { id } });
  if (!source) return { error: "Blog post not found." };

  let slug = `${source.slug}-copy`;
  let suffix = 2;
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${source.slug}-copy-${suffix}`;
    suffix += 1;
  }

  const copy = await prisma.blogPost.create({
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
      authorId: session.user.id ?? null,
    },
  });

  revalidatePath("/admin/blog");
  return { success: true, id: copy.id };
}
