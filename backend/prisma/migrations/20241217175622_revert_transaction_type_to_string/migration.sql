/*
  Warnings:

  - Changed the type of `type` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- DropEnum
DROP TYPE "TransactionType";

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");
