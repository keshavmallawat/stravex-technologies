import { notFound } from "next/navigation";
import { getNewsPostByIdForPreview } from "@/lib/news-data";
import { NewsPostView } from "@/components/news/news-post-view";

export default async function NewsPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getNewsPostByIdForPreview(id);
  if (!post) notFound();

  return <NewsPostView post={post} isPreview />;
}
