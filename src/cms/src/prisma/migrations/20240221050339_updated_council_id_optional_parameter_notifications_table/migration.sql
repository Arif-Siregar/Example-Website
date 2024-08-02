-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_councilId_fkey";

-- AlterTable
ALTER TABLE "Notifications" ALTER COLUMN "councilId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_councilId_fkey" FOREIGN KEY ("councilId") REFERENCES "Council"("id") ON DELETE SET NULL ON UPDATE CASCADE;
