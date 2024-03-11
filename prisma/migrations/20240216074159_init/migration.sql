-- CreateEnum
CREATE TYPE "EUserProjectRole" AS ENUM ('qc', 'developer', 'tester', 'leader', 'sale');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EUserRole" ADD VALUE 'staff';
ALTER TYPE "EUserRole" ADD VALUE 'manager';

-- CreateTable
CREATE TABLE "UserProject" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "projectId" INTEGER,
    "userId" INTEGER,
    "role" "EUserProjectRole",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
