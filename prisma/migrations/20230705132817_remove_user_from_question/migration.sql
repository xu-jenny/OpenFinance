/*
  Warnings:

  - You are about to drop the column `uid` on the `Question` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_uid_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "uid";
