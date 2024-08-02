/*
  Warnings:

  - Made the column `location` on table `Community` required. This step will fail if there are existing NULL values in that column.
  - Made the column `method` on table `Community` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Community" ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "method" SET NOT NULL;
