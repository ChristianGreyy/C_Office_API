-- CreateEnum
CREATE TYPE "EUserRole" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "EUserRole";
