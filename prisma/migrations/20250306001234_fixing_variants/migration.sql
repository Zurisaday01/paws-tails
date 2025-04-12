/*
  Warnings:

  - You are about to drop the column `attributeValueId` on the `ProductVariation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductVariation" DROP CONSTRAINT "ProductVariation_attributeValueId_fkey";

-- AlterTable
ALTER TABLE "ProductVariation" DROP COLUMN "attributeValueId";

-- CreateTable
CREATE TABLE "_AttributeValueToProductVariation" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_AttributeValueToProductVariation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AttributeValueToProductVariation_B_index" ON "_AttributeValueToProductVariation"("B");

-- AddForeignKey
ALTER TABLE "_AttributeValueToProductVariation" ADD CONSTRAINT "_AttributeValueToProductVariation_A_fkey" FOREIGN KEY ("A") REFERENCES "AttributeValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeValueToProductVariation" ADD CONSTRAINT "_AttributeValueToProductVariation_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
