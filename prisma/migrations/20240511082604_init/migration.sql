-- CreateTable
CREATE TABLE "IssueOutput" (
    "id" SERIAL NOT NULL,
    "comment" TEXT,
    "user_id" INTEGER,

    CONSTRAINT "IssueOutput_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IssueOutput" ADD CONSTRAINT "IssueOutput_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
