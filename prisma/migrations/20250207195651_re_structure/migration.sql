/*
  Warnings:

  - You are about to drop the `ProductVariationOption` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `attributeValueId` to the `ProductVariation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductVariationOption" DROP CONSTRAINT "ProductVariationOption_attributeValueId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariationOption" DROP CONSTRAINT "ProductVariationOption_variationId_fkey";

-- AlterTable
ALTER TABLE "Attribute" ALTER COLUMN "slug" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariation" ADD COLUMN     "attributeValueId" UUID NOT NULL;

-- DropTable
DROP TABLE "ProductVariationOption";

-- CreateTable
CREATE TABLE "_AttributeToProduct" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_AttributeToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AttributeToProduct_B_index" ON "_AttributeToProduct"("B");

-- AddForeignKey
ALTER TABLE "ProductVariation" ADD CONSTRAINT "ProductVariation_attributeValueId_fkey" FOREIGN KEY ("attributeValueId") REFERENCES "AttributeValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeToProduct" ADD CONSTRAINT "_AttributeToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeToProduct" ADD CONSTRAINT "_AttributeToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
