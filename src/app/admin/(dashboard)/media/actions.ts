"use server";

import path from "path";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isAllowedMimeType, MAX_UPLOAD_BYTES, sanitizeFilename, type MediaCategory } from "@/lib/media";
import { uploadToCloudinary, replaceOnCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export async function uploadMediaAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Not authorized." };
  }

  const file = formData.get("file");
  const category = String(formData.get("category") || "other") as MediaCategory;
  const altText = String(formData.get("altText") || "").trim() || null;

  if (!(file instanceof File)) {
    return { error: "No file provided." };
  }
  if (!isAllowedMimeType(file.type)) {
    return { error: `Unsupported file type: ${file.type || "unknown"}.` };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: "File exceeds the 15MB upload limit." };
  }

  const ext = path.extname(file.name);
  const publicIdHint = sanitizeFilename(path.basename(file.name, ext)) || "file";
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await uploadToCloudinary(buffer, category, file.type, publicIdHint);

  const asset = await prisma.mediaAsset.create({
    data: {
      filename: result.publicId,
      originalName: file.name,
      url: result.url,
      mimeType: file.type,
      size: result.bytes,
      category,
      altText,
      provider: "cloudinary",
      cloudinaryPublicId: result.publicId,
      width: result.width ?? null,
      height: result.height ?? null,
      resourceType: result.resourceType,
      uploadedById: session.user.id ?? null,
    },
  });

  revalidatePath("/admin/media");
  return { asset };
}

export async function replaceMediaAction(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Not authorized." };
  }

  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) {
    return { error: "Asset not found." };
  }
  if (!asset.cloudinaryPublicId) {
    return { error: "This asset predates the Cloudinary migration and can't be replaced in place." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "No file provided." };
  }
  if (!isAllowedMimeType(file.type)) {
    return { error: `Unsupported file type: ${file.type || "unknown"}.` };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: "File exceeds the 15MB upload limit." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await replaceOnCloudinary(asset.cloudinaryPublicId, buffer, file.type);

  const updated = await prisma.mediaAsset.update({
    where: { id },
    data: {
      originalName: file.name,
      mimeType: file.type,
      size: result.bytes,
      url: result.url,
      width: result.width ?? null,
      height: result.height ?? null,
      resourceType: result.resourceType,
    },
  });

  revalidatePath("/admin/media");
  return { asset: updated };
}

export async function deleteMediaAction(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Not authorized." };
  }

  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) {
    return { error: "Asset not found." };
  }

  await prisma.mediaAsset.delete({ where: { id } });

  if (asset.cloudinaryPublicId) {
    const resourceType = asset.mimeType === "application/pdf" ? "raw" : "image";
    await deleteFromCloudinary(asset.cloudinaryPublicId, resourceType).catch(() => {});
  }

  revalidatePath("/admin/media");
  return { success: true };
}

export async function updateMediaAction(
  id: string,
  data: { altText?: string; category?: MediaCategory }
) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Not authorized." };
  }

  await prisma.mediaAsset.update({
    where: { id },
    data: {
      altText: data.altText?.trim() || null,
      ...(data.category ? { category: data.category } : {}),
    },
  });

  revalidatePath("/admin/media");
  return { success: true };
}
