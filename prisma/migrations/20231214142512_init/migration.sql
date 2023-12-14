-- AlterTable
ALTER TABLE "User" ADD COLUMN     "universityId" INTEGER;

-- CreateTable
CREATE TABLE "University" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30),
    "university_name" VARCHAR(50),
    "color" VARCHAR(30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;
