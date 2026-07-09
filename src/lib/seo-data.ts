import { prisma } from "@/lib/prisma";

export const PAGE_SEO_KEYS = [
  "home",
  "about",
  "technologies",
  "solutions",
  "contact",
  "careers",
  "team",
  "products",
  "blog",
  "news",
] as const;
export type PageSeoKey = (typeof PAGE_SEO_KEYS)[number];

export const PAGE_SEO_LABELS: Record<PageSeoKey, string> = {
  home: "Home",
  about: "About",
  technologies: "Technologies",
  solutions: "Solutions",
  contact: "Contact",
  careers: "Careers",
  team: "Team",
  products: "Products Hub",
  blog: "Blog Hub",
  news: "News Hub",
};

export interface PageSeoData {
  pageKey: string;
  title: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  canonicalUrl: string | null;
  robots: string;
  keywords: string[];
}

export async function getPageSeo(pageKey: PageSeoKey): Promise<PageSeoData | null> {
  const row = await prisma.pageSeo.findUnique({ where: { pageKey } });
  if (!row) return null;
  return {
    pageKey: row.pageKey,
    title: row.title,
    metaDescription: row.metaDescription,
    ogImageUrl: row.ogImageUrl,
    canonicalUrl: row.canonicalUrl,
    robots: row.robots,
    keywords: row.keywords as string[],
  };
}

export async function getAllPageSeoOverrides(): Promise<Record<string, PageSeoData>> {
  const rows = await prisma.pageSeo.findMany();
  return Object.fromEntries(
    rows.map((row) => [
      row.pageKey,
      {
        pageKey: row.pageKey,
        title: row.title,
        metaDescription: row.metaDescription,
        ogImageUrl: row.ogImageUrl,
        canonicalUrl: row.canonicalUrl,
        robots: row.robots,
        keywords: row.keywords as string[],
      },
    ])
  );
}

/** Merges a PageSeo override onto fallback title/description, for use in generateMetadata(). */
export function applySeoOverride(
  override: PageSeoData | null,
  fallback: { title: string; description: string }
) {
  return {
    title: override?.title || fallback.title,
    description: override?.metaDescription || fallback.description,
    ...(override?.ogImageUrl ? { openGraph: { images: [override.ogImageUrl] } } : {}),
    ...(override?.canonicalUrl ? { alternates: { canonical: override.canonicalUrl } } : {}),
    ...(override?.robots ? { robots: override.robots } : {}),
  };
}
