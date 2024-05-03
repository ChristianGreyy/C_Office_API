/*
  Warnings:

  - You are about to drop the column `avatarId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `levelId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `positionId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `universityId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[avatar_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_avatarId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_levelId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_positionId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_universityId_fkey";

-- DropIndex
DROP INDEX "User_avatarId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarId",
DROP COLUMN "levelId",
DROP COLUMN "positionId",
DROP COLUMN "roleId",
DROP COLUMN "universityId",
ADD COLUMN     "avatar_id" INTEGER,
ADD COLUMN     "level_id" INTEGER,
ADD COLUMN     "position_id" INTEGER,
ADD COLUMN     "role_id" INTEGER,
ADD COLUMN     "university_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_avatar_id_key" ON "User"("avatar_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "Level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
