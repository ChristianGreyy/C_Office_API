-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "permissionIds" JSONB NOT NULL DEFAULT '[]';

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "module" VARCHAR(30) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "slug" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);
