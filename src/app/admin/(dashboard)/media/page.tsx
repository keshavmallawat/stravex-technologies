import { prisma } from "@/lib/prisma";
import { MediaLibraryClient } from "@/components/admin/media/media-library-client";
import { MEDIA_CATEGORIES } from "@/lib/media";

export const metadata = {
  title: "Media Library | Stravex CMS",
};

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory =
    category && (MEDIA_CATEGORIES as readonly string[]).includes(category)
      ? category
      : null;

  const assets = await prisma.mediaAsset.findMany({
    where: activeCategory ? { category: activeCategory } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <MediaLibraryClient
      assets={assets.map((a) => ({
        id: a.id,
        filename: a.filename,
        originalName: a.originalName,
        url: a.url,
        mimeType: a.mimeType,
        size: a.size,
        category: a.category,
        altText: a.altText,
        createdAt: a.createdAt.toISOString(),
      }))}
      activeCategory={activeCategory}
    />
  );
}
