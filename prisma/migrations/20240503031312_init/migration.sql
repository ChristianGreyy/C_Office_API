/*
  Warnings:

  - You are about to drop the column `userId` on the `EmployeeAttendance` table. All the data in the column will be lost.
  - You are about to drop the column `assignId` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `priorityId` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `trackerId` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `permissionIds` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Sprint` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `UserProject` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserProject` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmployeeAttendance" DROP CONSTRAINT "EmployeeAttendance_userId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_assignId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_priorityId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_statusId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_trackerId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Sprint" DROP CONSTRAINT "Sprint_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UserProject" DROP CONSTRAINT "UserProject_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UserProject" DROP CONSTRAINT "UserProject_userId_fkey";

-- AlterTable
ALTER TABLE "EmployeeAttendance" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER;

-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "assignId",
DROP COLUMN "creatorId",
DROP COLUMN "priorityId",
DROP COLUMN "projectId",
DROP COLUMN "statusId",
DROP COLUMN "trackerId",
ADD COLUMN     "assign_id" INTEGER,
ADD COLUMN     "creator_id" INTEGER,
ADD COLUMN     "priority_id" INTEGER,
ADD COLUMN     "project_id" INTEGER,
ADD COLUMN     "status_id" INTEGER,
ADD COLUMN     "tracker_id" INTEGER;

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "creatorId",
ADD COLUMN     "creator_id" INTEGER;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "permissionIds",
ADD COLUMN     "permission_ids" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "Sprint" DROP COLUMN "projectId",
ADD COLUMN     "project_id" INTEGER;

-- AlterTable
ALTER TABLE "UserProject" DROP COLUMN "projectId",
DROP COLUMN "userId",
ADD COLUMN     "project_id" INTEGER,
ADD COLUMN     "user_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Sprint" ADD CONSTRAINT "Sprint_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_assign_id_fkey" FOREIGN KEY ("assign_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_priority_id_fkey" FOREIGN KEY ("priority_id") REFERENCES "Priority"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_tracker_id_fkey" FOREIGN KEY ("tracker_id") REFERENCES "Tracker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeAttendance" ADD CONSTRAINT "EmployeeAttendance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
