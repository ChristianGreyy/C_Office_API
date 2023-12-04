/*
  Warnings:

  - The values [ADMIN,USER] on the enum `EUserRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACTIVE,INACTIVE] on the enum `EUserStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EUserRole_new" AS ENUM ('admin', 'user');
ALTER TYPE "EUserRole" RENAME TO "EUserRole_old";
ALTER TYPE "EUserRole_new" RENAME TO "EUserRole";
DROP TYPE "EUserRole_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EUserStatus_new" AS ENUM ('active', 'inactive');
ALTER TABLE "User" ALTER COLUMN "status" TYPE "EUserStatus_new" USING ("status"::text::"EUserStatus_new");
ALTER TYPE "EUserStatus" RENAME TO "EUserStatus_old";
ALTER TYPE "EUserStatus_new" RENAME TO "EUserStatus";
DROP TYPE "EUserStatus_old";
COMMIT;
