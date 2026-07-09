-- CreateTable
CREATE TABLE "ProductContentBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "content" JSONB NOT NULL DEFAULT [],
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductContentBlock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "JobOpening" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "department" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "experience" TEXT,
    "location" TEXT NOT NULL,
    "workMode" TEXT NOT NULL DEFAULT 'onsite',
    "responsibilities" JSONB NOT NULL DEFAULT [],
    "requirements" JSONB NOT NULL DEFAULT [],
    "skills" JSONB NOT NULL DEFAULT [],
    "salary" TEXT,
    "expiryDate" DATETIME,
    "authorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "JobOpening_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CareerApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicantName" TEXT NOT NULL,
    "appliedRole" TEXT NOT NULL,
    "jobOpeningId" TEXT,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "resumeUrl" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "CareerApplication_jobOpeningId_fkey" FOREIGN KEY ("jobOpeningId") REFERENCES "JobOpening" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "excerpt" TEXT,
    "content" TEXT NOT NULL DEFAULT '',
    "featuredImageUrl" TEXT,
    "galleryUrls" JSONB NOT NULL DEFAULT [],
    "category" TEXT,
    "tags" JSONB NOT NULL DEFAULT [],
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImageUrl" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" DATETIME,
    "authorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NewsPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "excerpt" TEXT,
    "content" TEXT NOT NULL DEFAULT '',
    "featuredImageUrl" TEXT,
    "galleryUrls" JSONB NOT NULL DEFAULT [],
    "category" TEXT,
    "tags" JSONB NOT NULL DEFAULT [],
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImageUrl" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" DATETIME,
    "outlet" TEXT,
    "externalUrl" TEXT,
    "authorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "NewsPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "companyName" TEXT NOT NULL DEFAULT 'Stravex Technologies',
    "addressLines" JSONB NOT NULL DEFAULT [],
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "phoneHref" TEXT NOT NULL DEFAULT '',
    "businessHoursDays" TEXT NOT NULL DEFAULT '',
    "businessHoursTime" TEXT NOT NULL DEFAULT '',
    "socialLinks" JSONB NOT NULL DEFAULT [],
    "navLinks" JSONB NOT NULL DEFAULT [],
    "footerTagline" TEXT NOT NULL DEFAULT '',
    "seoDefaultTitle" TEXT,
    "seoDefaultDescription" TEXT,
    "ogDefaultImageUrl" TEXT,
    "faviconUrl" TEXT,
    "logoLightUrl" TEXT,
    "logoDarkUrl" TEXT,
    "analyticsIds" JSONB NOT NULL DEFAULT [],
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HomepageSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "heading" TEXT,
    "body" TEXT,
    "content" JSONB NOT NULL DEFAULT [],
    "ctaLabel" TEXT,
    "ctaHref" TEXT,
    "secondaryCtaLabel" TEXT,
    "secondaryCtaHref" TEXT,
    "imageUrl" TEXT,
    "mediaUrls" JSONB NOT NULL DEFAULT [],
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT,
    "bio" TEXT,
    "photoUrl" TEXT,
    "expertiseTags" JSONB NOT NULL DEFAULT [],
    "socialLinks" JSONB NOT NULL DEFAULT [],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "TeamMember_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "category" TEXT NOT NULL DEFAULT 'partner',
    "status" TEXT NOT NULL DEFAULT 'active',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Partner_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Technology" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "appliedInProductSlugs" JSONB NOT NULL DEFAULT [],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "authorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Technology_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Solution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "relatedProductSlugs" JSONB NOT NULL DEFAULT [],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "authorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Solution_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PageSeo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageKey" TEXT NOT NULL,
    "title" TEXT,
    "metaDescription" TEXT,
    "ogImageUrl" TEXT,
    "canonicalUrl" TEXT,
    "robots" TEXT NOT NULL DEFAULT 'index,follow',
    "keywords" JSONB NOT NULL DEFAULT [],
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "linkHref" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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
    "heroTitle" TEXT,
    "ctaLabel" TEXT,
    "ctaHref" TEXT,
    "relatedProductSlugs" JSONB NOT NULL DEFAULT [],
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImageUrl" TEXT,
    "authorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Product_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("applications", "authorId", "category", "coreCapabilities", "createdAt", "datasheetUrl", "deletedAt", "designGoals", "displayStatus", "extraFeatureLists", "featured", "galleryUrls", "heroImageAspect", "heroPosterUrl", "id", "keyFeatures", "missionProfile", "name", "ogImageUrl", "positioning", "problemStatement", "purpose", "relatedTechnologies", "seoDescription", "seoTitle", "slug", "sortOrder", "status", "tagline", "technicalSpecs", "updatedAt", "workflow") SELECT "applications", "authorId", "category", "coreCapabilities", "createdAt", "datasheetUrl", "deletedAt", "designGoals", "displayStatus", "extraFeatureLists", "featured", "galleryUrls", "heroImageAspect", "heroPosterUrl", "id", "keyFeatures", "missionProfile", "name", "ogImageUrl", "positioning", "problemStatement", "purpose", "relatedTechnologies", "seoDescription", "seoTitle", "slug", "sortOrder", "status", "tagline", "technicalSpecs", "updatedAt", "workflow" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_status_idx" ON "Product"("status");
CREATE INDEX "Product_sortOrder_idx" ON "Product"("sortOrder");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ProductContentBlock_productId_idx" ON "ProductContentBlock"("productId");

-- CreateIndex
CREATE INDEX "Contact_status_idx" ON "Contact"("status");

-- CreateIndex
CREATE INDEX "Contact_createdAt_idx" ON "Contact"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "JobOpening_slug_key" ON "JobOpening"("slug");

-- CreateIndex
CREATE INDEX "JobOpening_status_idx" ON "JobOpening"("status");

-- CreateIndex
CREATE INDEX "JobOpening_sortOrder_idx" ON "JobOpening"("sortOrder");

-- CreateIndex
CREATE INDEX "CareerApplication_status_idx" ON "CareerApplication"("status");

-- CreateIndex
CREATE INDEX "CareerApplication_archived_idx" ON "CareerApplication"("archived");

-- CreateIndex
CREATE INDEX "CareerApplication_createdAt_idx" ON "CareerApplication"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_status_idx" ON "BlogPost"("status");

-- CreateIndex
CREATE INDEX "BlogPost_publishedAt_idx" ON "BlogPost"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "NewsPost_slug_key" ON "NewsPost"("slug");

-- CreateIndex
CREATE INDEX "NewsPost_status_idx" ON "NewsPost"("status");

-- CreateIndex
CREATE INDEX "NewsPost_publishedAt_idx" ON "NewsPost"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "HomepageSection_key_key" ON "HomepageSection"("key");

-- CreateIndex
CREATE INDEX "TeamMember_status_idx" ON "TeamMember"("status");

-- CreateIndex
CREATE INDEX "TeamMember_sortOrder_idx" ON "TeamMember"("sortOrder");

-- CreateIndex
CREATE INDEX "Partner_category_idx" ON "Partner"("category");

-- CreateIndex
CREATE INDEX "Partner_status_idx" ON "Partner"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Technology_slug_key" ON "Technology"("slug");

-- CreateIndex
CREATE INDEX "Technology_status_idx" ON "Technology"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Solution_slug_key" ON "Solution"("slug");

-- CreateIndex
CREATE INDEX "Solution_status_idx" ON "Solution"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PageSeo_pageKey_key" ON "PageSeo"("pageKey");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");
