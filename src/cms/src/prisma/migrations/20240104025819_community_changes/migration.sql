-- CreateTable
CREATE TABLE "Communitytype" (
    "communitytypeId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Communitytype_pkey" PRIMARY KEY ("communitytypeId")
);

-- CreateTable
CREATE TABLE "Community" (
    "communityId" SERIAL NOT NULL,
    "councilId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT,
    "location" TEXT,
    "frequency" TEXT,
    "method" TEXT,
    "notes" TEXT,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("communityId")
);

-- CreateTable
CREATE TABLE "Community_communitytype_mapping" (
    "communityId" INTEGER NOT NULL,
    "communitytypeId" INTEGER NOT NULL,

    CONSTRAINT "Community_communitytype_mapping_pkey" PRIMARY KEY ("communityId","communitytypeId")
);

-- CreateTable
CREATE TABLE "Community_item_mapping" (
    "communityId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "Community_item_mapping_pkey" PRIMARY KEY ("communityId","itemId")
);

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_councilId_fkey" FOREIGN KEY ("councilId") REFERENCES "Council"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Community_communitytype_mapping" ADD CONSTRAINT "Community_communitytype_mapping_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("communityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Community_communitytype_mapping" ADD CONSTRAINT "Community_communitytype_mapping_communitytypeId_fkey" FOREIGN KEY ("communitytypeId") REFERENCES "Communitytype"("communitytypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Community_item_mapping" ADD CONSTRAINT "Community_item_mapping_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("communityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Community_item_mapping" ADD CONSTRAINT "Community_item_mapping_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
