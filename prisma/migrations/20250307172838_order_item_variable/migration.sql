/*
  Warnings:

  - You are about to drop the column `variantName` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "variantName",
ADD COLUMN     "vairantId" TEXT,
ADD COLUMN     "variant" TEXT;
