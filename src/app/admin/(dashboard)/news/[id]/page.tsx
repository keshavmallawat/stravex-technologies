import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentPostForm } from "@/components/admin/content/content-post-form";
import { createNewsPostAction, updateNewsPostAction } from "@/app/admin/(dashboard)/news/actions";
import type { ContentPostFormValues } from "@/lib/content-post-types";

export const metadata = {
  title: "Edit News Item | Stravex CMS",
};

function toDatetimeLocal(date: Date | null) {
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function EditNewsPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.newsPost.findUnique({ where: { id } });

  if (!post) notFound();

  const initialValues: ContentPostFormValues = {
    title: post.title,
    slug: post.slug,
    status: post.status as ContentPostFormValues["status"],
    excerpt: post.excerpt ?? "",
    content: post.content,
    featuredImageUrl: post.featuredImageUrl ?? "",
    galleryUrls: post.galleryUrls as string[],
    category: post.category ?? "",
    tags: post.tags as string[],
    seoTitle: post.seoTitle ?? "",
    seoDescription: post.seoDescription ?? "",
    ogImageUrl: post.ogImageUrl ?? "",
    publishedAt: toDatetimeLocal(post.publishedAt),
    outlet: post.outlet ?? "",
    externalUrl: post.externalUrl ?? "",
  };

  return (
    <div>
      <span className="font-mono-label text-[10px] uppercase text-ink/40">
        [ News / Edit ]
      </span>
      <h2 className="mt-2 text-2xl font-semibold text-ink">{post.title}</h2>

      <div className="mt-6">
        <ContentPostForm
          kind="news"
          postId={post.id}
          initialValues={initialValues}
          createAction={createNewsPostAction}
          updateAction={updateNewsPostAction}
          previewHref={`/admin/preview/news/${post.id}`}
        />
      </div>
    </div>
  );
}
