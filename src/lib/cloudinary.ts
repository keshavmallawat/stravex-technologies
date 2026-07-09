import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import type { MediaCategory } from "@/lib/media";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Hierarchical Cloudinary folder per media category. Grouped by logical
 * parent (products/*, team/*, partners/*, brand/*) rather than one flat
 * namespace.
 */
const CATEGORY_FOLDERS: Record<MediaCategory, string> = {
  "product-poster": "stravex/products/posters",
  "product-gallery": "stravex/products/gallery",
  datasheet: "stravex/products/datasheets",
  "og-image": "stravex/seo/og-images",
  "founder-photo": "stravex/team/founders",
  "team-photo": "stravex/team/members",
  "blog-image": "stravex/blogs",
  "news-image": "stravex/news",
  "incubator-logo": "stravex/partners/incubators",
  "partner-logo": "stravex/partners/logos",
  // Manual Media Library uploads only — distinct from the applicant-submitted
  // resume pipeline (src/app/api/careers/apply/route.ts), which stays local.
  resume: "stravex/careers/resumes",
  "site-logo": "stravex/brand/logos",
  favicon: "stravex/brand/favicons",
  other: "stravex/other",
};

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
  width?: number;
  height?: number;
  resourceType: string;
}

function resourceTypeFor(mimeType: string): "image" | "raw" {
  return mimeType === "application/pdf" ? "raw" : "image";
}

function toResult(result: UploadApiResponse): CloudinaryUploadResult {
  return {
    url: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
    format: result.format,
    width: result.width,
    height: result.height,
    resourceType: result.resource_type,
  };
}

async function resourceExists(publicId: string, resourceType: "image" | "raw"): Promise<boolean> {
  try {
    await cloudinary.api.resource(publicId, { resource_type: resourceType });
    return true;
  } catch {
    // Cloudinary's admin API throws (404) when the resource doesn't exist.
    return false;
  }
}

function uploadStream(
  buffer: Buffer,
  publicId: string,
  resourceType: "image" | "raw"
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: resourceType,
        transformation:
          resourceType === "image" ? [{ fetch_format: "auto", quality: "auto" }] : undefined,
      },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error("Cloudinary upload returned no result"));
        resolve(toResult(result));
      }
    );
    stream.end(buffer);
  });
}

/**
 * Uploads a new asset with a deterministic public_id derived from the file's
 * own sanitized name — human-readable and stable, rather than a random
 * string, since the Media Library doesn't know which entity (if any) will
 * end up referencing this asset at upload time. Checks for an existing
 * asset at that exact public_id first (Cloudinary's own overwrite/collision
 * behavior is ambiguous — it can silently return existing metadata rather
 * than erroring — so this app decides explicitly instead) and only appends
 * a short disambiguating suffix if a genuine collision is found.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  category: MediaCategory,
  mimeType: string,
  publicIdHint: string
): Promise<CloudinaryUploadResult> {
  const resourceType = resourceTypeFor(mimeType);
  const folder = CATEGORY_FOLDERS[category];
  const base = `${folder}/${publicIdHint}`;

  let candidate = base;
  for (let attempt = 1; attempt <= 5; attempt++) {
    if (!(await resourceExists(candidate, resourceType))) {
      return uploadStream(buffer, candidate, resourceType);
    }
    candidate = `${base}-${attempt}`;
  }
  // Extremely unlikely fallback after 5 deterministic collisions.
  return uploadStream(buffer, `${base}-${randomSuffix()}`, resourceType);
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

/** Re-uploads to the same public_id, preserving the existing URL/reference. */
export async function replaceOnCloudinary(
  publicId: string,
  buffer: Buffer,
  mimeType: string
): Promise<CloudinaryUploadResult> {
  const resourceType = resourceTypeFor(mimeType);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: resourceType,
        overwrite: true,
        invalidate: true,
        transformation:
          resourceType === "image" ? [{ fetch_format: "auto", quality: "auto" }] : undefined,
      },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error("Cloudinary replace returned no result"));
        resolve(toResult(result));
      }
    );
    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "raw" = "image"
): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
