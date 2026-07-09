export const MEDIA_CATEGORIES = [
  "product-poster",
  "product-gallery",
  "datasheet",
  "og-image",
  "founder-photo",
  "team-photo",
  "blog-image",
  "news-image",
  "incubator-logo",
  "partner-logo",
  "resume",
  "site-logo",
  "favicon",
  "other",
] as const;

export type MediaCategory = (typeof MEDIA_CATEGORIES)[number];

export const MEDIA_CATEGORY_LABELS: Record<MediaCategory, string> = {
  "product-poster": "Product Poster",
  "product-gallery": "Product Gallery",
  datasheet: "Datasheet",
  "og-image": "OG Image",
  "founder-photo": "Founder Photo",
  "team-photo": "Team Photo",
  "blog-image": "Blog Image",
  "news-image": "News Image",
  "incubator-logo": "Incubator Logo",
  "partner-logo": "Partner Logo",
  resume: "Resume",
  "site-logo": "Site Logo",
  favicon: "Favicon",
  other: "Other",
};

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "application/pdf",
]);

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB

export function isAllowedMimeType(mimeType: string) {
  return ALLOWED_MIME_TYPES.has(mimeType);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function sanitizeFilename(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
