/*
  Warnings:

  - You are about to drop the column `banner` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "banner",
DROP COLUMN "isFeatured";

-- AlterTable
ALTER TABLE "ProductVariation" ALTER COLUMN "productId" DROP NOT NULL;
