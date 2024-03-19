-- CreateEnum
CREATE TYPE "EUserGender" AS ENUM ('female', 'male');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" "EUserGender";
