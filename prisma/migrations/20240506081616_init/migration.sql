/*
  Warnings:

  - The `type` column on the `Request` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ERequestStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "ERequestType" AS ENUM ('over_time', 'absence');

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "status" "ERequestStatus",
DROP COLUMN "type",
ADD COLUMN     "type" "ERequestType";

-- DropEnum
DROP TYPE "ERequest";
