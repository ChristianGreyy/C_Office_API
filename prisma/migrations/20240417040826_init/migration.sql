-- CreateTable
CREATE TABLE "EmployeeAttendance" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "checkInTime" TIMESTAMP(3) NOT NULL,
    "checkOutTime" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeAttendance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EmployeeAttendance" ADD CONSTRAINT "EmployeeAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
