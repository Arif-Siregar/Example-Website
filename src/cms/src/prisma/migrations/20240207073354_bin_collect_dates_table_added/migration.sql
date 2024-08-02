-- CreateTable
CREATE TABLE "BinCollectDates" (
    "id" SERIAL NOT NULL,
    "councilId" INTEGER NOT NULL,
    "dayName" TEXT NOT NULL,
    "binType" INTEGER NOT NULL,
    "frequency" TEXT NOT NULL,
    "collectDate" TEXT NOT NULL,

    CONSTRAINT "BinCollectDates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BinCollectDates" ADD CONSTRAINT "BinCollectDates_councilId_fkey" FOREIGN KEY ("councilId") REFERENCES "Council"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BinCollectDates" ADD CONSTRAINT "BinCollectDates_binType_fkey" FOREIGN KEY ("binType") REFERENCES "BinType"("bintypeid") ON DELETE RESTRICT ON UPDATE CASCADE;
