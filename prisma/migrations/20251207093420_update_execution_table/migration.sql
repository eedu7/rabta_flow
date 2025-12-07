/*
  Warnings:

  - You are about to drop the column `errorType` on the `Execution` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Execution" DROP COLUMN "errorType",
ADD COLUMN     "errorStack" TEXT;
