import { notFound } from "next/navigation";
import { getBlogPostByIdForPreview } from "@/lib/blog-data";
import { BlogPostView } from "@/components/blog/blog-post-view";

export default async function BlogPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPostByIdForPreview(id);
  if (!post) notFound();

  return <BlogPostView post={post} isPreview />;
}
