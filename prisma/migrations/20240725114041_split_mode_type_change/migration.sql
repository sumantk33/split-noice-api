/*
  Warnings:

  - The `splitType` column on the `Transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "splitType",
ADD COLUMN     "splitType" INTEGER NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "SplitMode";
