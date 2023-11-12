/*
  Warnings:

  - You are about to drop the column `is_active` on the `User` table. All the data in the column will be lost.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "EUserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_active",
ADD COLUMN     "status" "EUserStatus",
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "check_in_date" DROP NOT NULL,
ALTER COLUMN "check_in_date" SET DEFAULT CURRENT_TIMESTAMP;
