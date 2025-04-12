/*
  Warnings:

  - You are about to drop the column `vairantId` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "vairantId",
ADD COLUMN     "variantId" TEXT;
