/*
  Warnings:

  - You are about to drop the column `duration` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "duration",
DROP COLUMN "title";
