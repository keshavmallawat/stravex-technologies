import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBlogSlugs, getPublishedBlogPostBySlug } from "@/lib/blog-data";
import { BlogPostView } from "@/components/blog/blog-post-view";

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seoTitle || `${post.title} | Stravex Technologies`,
    description: post.seoDescription || post.excerpt || undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) notFound();

  return <BlogPostView post={post} />;
}
