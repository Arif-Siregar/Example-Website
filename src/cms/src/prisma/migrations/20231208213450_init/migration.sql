-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- CreateTable
CREATE TABLE "Council" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isLiscencing" BOOLEAN DEFAULT false,
    "councilImage" TEXT,

    CONSTRAINT "Council_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suburb" (
    "postcode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "councilId" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "Suburb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "councilId" INTEGER,
    "role" "UserRole",
    "authId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bin" (
    "id" SERIAL NOT NULL,
    "colorCode" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "image" TEXT,
    "can" TEXT NOT NULL,
    "cannot" TEXT NOT NULL,
    "councilId" INTEGER NOT NULL,

    CONSTRAINT "Bin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Method" (
    "id" SERIAL NOT NULL,
    "councilId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "method" TEXT,
    "binId" INTEGER,
    "note" TEXT,

    CONSTRAINT "Method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subCategoryId" INTEGER,
    "code" TEXT,
    "image" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "primaryMaterialId" INTEGER NOT NULL,
    "code" TEXT,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrimaryMaterial" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,

    CONSTRAINT "PrimaryMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_code_key" ON "SubCategory"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PrimaryMaterial_code_key" ON "PrimaryMaterial"("code");

-- AddForeignKey
ALTER TABLE "Suburb" ADD CONSTRAINT "Suburb_councilId_fkey" FOREIGN KEY ("councilId") REFERENCES "Council"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_councilId_fkey" FOREIGN KEY ("councilId") REFERENCES "Council"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bin" ADD CONSTRAINT "Bin_councilId_fkey" FOREIGN KEY ("councilId") REFERENCES "Council"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Method" ADD CONSTRAINT "Method_binId_fkey" FOREIGN KEY ("binId") REFERENCES "Bin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Method" ADD CONSTRAINT "Method_councilId_fkey" FOREIGN KEY ("councilId") REFERENCES "Council"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Method" ADD CONSTRAINT "Method_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_primaryMaterialId_fkey" FOREIGN KEY ("primaryMaterialId") REFERENCES "PrimaryMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
