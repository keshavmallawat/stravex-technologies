import type { MetadataRoute } from "next";
import { getAllBlogSlugs } from "@/lib/blog-data";
import { getAllNewsSlugs } from "@/lib/news-data";
import { getAllProductSlugs } from "@/lib/products-data";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://stravextechnologies.com";

const STATIC_PATHS = [
  "",
  "/about",
  "/team",
  "/products",
  "/technologies",
  "/solutions",
  "/blog",
  "/news",
  "/careers",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogSlugs, newsSlugs, productSlugs] = await Promise.all([
    getAllBlogSlugs(),
    getAllNewsSlugs(),
    getAllProductSlugs(),
  ]);

  const now = new Date();

  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...productSlugs.map((slug) => ({
      url: `${BASE_URL}/products/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...blogSlugs.map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...newsSlugs.map((slug) => ({
      url: `${BASE_URL}/news/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
