-- AlterTable
ALTER TABLE "MediaAsset" ADD COLUMN "provider" TEXT NOT NULL DEFAULT 'cloudinary';
ALTER TABLE "MediaAsset" ADD COLUMN "cloudinaryPublicId" TEXT;
ALTER TABLE "MediaAsset" ADD COLUMN "width" INTEGER;
ALTER TABLE "MediaAsset" ADD COLUMN "height" INTEGER;
ALTER TABLE "MediaAsset" ADD COLUMN "resourceType" TEXT;
