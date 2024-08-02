-- CreateTable
CREATE TABLE "Notifications" (
    "notificationId" SERIAL NOT NULL,
    "heading" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "councilId" INTEGER NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("notificationId")
);

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_councilId_fkey" FOREIGN KEY ("councilId") REFERENCES "Council"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
