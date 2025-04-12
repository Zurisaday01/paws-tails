/*
  Warnings:

  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `variantId` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP CONSTRAINT "orderitems_orderId_productId_pk",
RENAME CONSTRAINT "orderitems_orderId_productId_pk" TO "orderitems_orderId_variantId_productId_pk",
ALTER COLUMN "variantId" SET NOT NULL,
ADD CONSTRAINT "orderitems_orderId_variantId_productId_pk" PRIMARY KEY ("orderId", "productId", "variantId");
