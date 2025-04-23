/*
  Warnings:

  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `variantId` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
-- Drop the existing constraint first
ALTER TABLE "OrderItem" DROP CONSTRAINT "orderitems_orderId_productId_pk";

-- Add the new composite primary key constraint
ALTER TABLE "OrderItem"
ALTER COLUMN "variantId" SET NOT NULL,
ADD CONSTRAINT "orderitems_orderId_variantId_productId_pk" PRIMARY KEY ("orderId", "productId", "variantId");

