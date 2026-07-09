-- AlterTable
ALTER TABLE "Contact" ADD COLUMN "firestoreId" TEXT;

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN "authorName" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "firestoreId" TEXT;

-- AlterTable
ALTER TABLE "NewsPost" ADD COLUMN "authorName" TEXT;
ALTER TABLE "NewsPost" ADD COLUMN "firestoreId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Contact_firestoreId_key" ON "Contact"("firestoreId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_firestoreId_key" ON "BlogPost"("firestoreId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsPost_firestoreId_key" ON "NewsPost"("firestoreId");
