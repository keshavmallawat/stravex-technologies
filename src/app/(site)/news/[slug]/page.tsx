import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllNewsSlugs, getPublishedNewsPostBySlug } from "@/lib/news-data";
import { NewsPostView } from "@/components/news/news-post-view";

export async function generateStaticParams() {
  const slugs = await getAllNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedNewsPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seoTitle || `${post.title} | Stravex Technologies`,
    description: post.seoDescription || post.excerpt || undefined,
  };
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedNewsPostBySlug(slug);
  if (!post) notFound();

  return <NewsPostView post={post} />;
}
