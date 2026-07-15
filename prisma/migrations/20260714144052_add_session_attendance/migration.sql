/*
  Warnings:

  - A unique constraint covering the columns `[userId,date,session]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `session` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `Attendance_userId_fkey`;

-- DropIndex
DROP INDEX `Attendance_userId_date_key` ON `attendance`;

-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `checkInAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `session` ENUM('PAGI', 'MALAM') NOT NULL,
    MODIFY `date` DATE NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Attendance_userId_date_session_key` ON `Attendance`(`userId`, `date`, `session`);

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
