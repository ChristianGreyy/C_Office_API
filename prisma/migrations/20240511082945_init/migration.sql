/*
  Warnings:

  - You are about to drop the column `output` on the `Issue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "output";

-- AlterTable
ALTER TABLE "IssueOutput" ADD COLUMN     "issue_id" INTEGER;

-- AddForeignKey
ALTER TABLE "IssueOutput" ADD CONSTRAINT "IssueOutput_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "Issue"("id") ON DELETE SET NULL ON UPDATE CASCADE;
