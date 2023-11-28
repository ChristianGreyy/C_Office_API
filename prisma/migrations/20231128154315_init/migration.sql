/*
  Warnings:

  - You are about to drop the column `slug` on the `Role` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Role_slug_key";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "slug";
