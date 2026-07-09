/*
  Warnings:

  - You are about to drop the column `fullDescription` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `heroTagline` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `Product` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "displayStatus" TEXT NOT NULL DEFAULT 'In Development',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "heroImageAspect" TEXT NOT NULL DEFAULT '16 / 10',
    "tagline" TEXT,
    "positioning" TEXT,
    "purpose" TEXT,
    "problemStatement" TEXT,
    "missionProfile" TEXT,
    "designGoals" JSONB NOT NULL DEFAULT [],
    "workflow" JSONB NOT NULL DEFAULT [],
    "coreCapabilities" JSONB NOT NULL DEFAULT [],
    "keyFeatures" JSONB NOT NULL DEFAULT [],
    "technicalSpecs" JSONB NOT NULL DEFAULT [],
    "applications" JSONB NOT NULL DEFAULT [],
    "relatedTechnologies" JSONB NOT NULL DEFAULT [],
    "extraFeatureLists" JSONB NOT NULL DEFAULT [],
    "heroPosterUrl" TEXT,
    "galleryUrls" JSONB NOT NULL DEFAULT [],
    "datasheetUrl" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImageUrl" TEXT,
    "authorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Product_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("applications", "authorId", "category", "createdAt", "datasheetUrl", "deletedAt", "featured", "galleryUrls", "heroPosterUrl", "id", "keyFeatures", "missionProfile", "name", "ogImageUrl", "seoDescription", "seoTitle", "slug", "sortOrder", "status", "technicalSpecs", "updatedAt") SELECT "applications", "authorId", "category", "createdAt", "datasheetUrl", "deletedAt", "featured", "galleryUrls", "heroPosterUrl", "id", "keyFeatures", "missionProfile", "name", "ogImageUrl", "seoDescription", "seoTitle", "slug", "sortOrder", "status", "technicalSpecs", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_status_idx" ON "Product"("status");
CREATE INDEX "Product_sortOrder_idx" ON "Product"("sortOrder");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
