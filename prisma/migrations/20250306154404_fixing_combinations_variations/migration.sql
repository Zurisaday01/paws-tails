-- CreateTable
CREATE TABLE "_AttributeValueToProduct" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_AttributeValueToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AttributeValueToProduct_B_index" ON "_AttributeValueToProduct"("B");

-- AddForeignKey
ALTER TABLE "_AttributeValueToProduct" ADD CONSTRAINT "_AttributeValueToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "AttributeValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeValueToProduct" ADD CONSTRAINT "_AttributeValueToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
