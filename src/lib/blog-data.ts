import { prisma } from "@/lib/prisma";

export interface PublicBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImageUrl: string | null;
  galleryUrls: string[];
  category: string | null;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
  viewCount: number;
  publishedAt: string | null;
}

function toPublicPost(post: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImageUrl: string | null;
  galleryUrls: unknown;
  category: string | null;
  tags: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
  viewCount: number;
  publishedAt: Date | null;
}): PublicBlogPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featuredImageUrl: post.featuredImageUrl,
    galleryUrls: post.galleryUrls as string[],
    category: post.category,
    tags: post.tags as string[],
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    ogImageUrl: post.ogImageUrl,
    viewCount: post.viewCount,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
  };
}

// Public queries filter by status "published" AND publishedAt <= now, so a
// "scheduled" post never leaks early even before an admin flips its status.
const publicWhere = {
  status: "published" as const,
  deletedAt: null,
  publishedAt: { lte: new Date() },
};

/** Admin-preview only: fetches by id regardless of status/publish date. */
export async function getBlogPostByIdForPreview(id: string): Promise<PublicBlogPost | null> {
  const post = await prisma.blogPost.findFirst({ where: { id, deletedAt: null } });
  return post ? toPublicPost(post) : null;
}

export async function getPublishedBlogPosts(): Promise<PublicBlogPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: publicWhere,
    orderBy: { publishedAt: "desc" },
  });
  return posts.map(toPublicPost);
}

export async function getPublishedBlogPostBySlug(
  slug: string
): Promise<PublicBlogPost | null> {
  const post = await prisma.blogPost.findFirst({
    where: { ...publicWhere, slug },
  });
  if (!post) return null;

  await prisma.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  return toPublicPost(post);
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const posts = await prisma.blogPost.findMany({
    where: publicWhere,
    select: { slug: true },
  });
  return posts.map((p) => p.slug);
}
