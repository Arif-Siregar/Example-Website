-- AlterTable
ALTER TABLE "Bin" ADD COLUMN     "bintypeId" INTEGER;

-- AddForeignKey
ALTER TABLE "Bin" ADD CONSTRAINT "Bin_bintypeId_fkey" FOREIGN KEY ("bintypeId") REFERENCES "BinType"("bintypeid") ON DELETE SET NULL ON UPDATE CASCADE;
