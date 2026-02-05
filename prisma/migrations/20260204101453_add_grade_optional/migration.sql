/*
  Warnings:

  - Made the column `gradeId` on table `class` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gradeId` on table `mastersubject` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `class` DROP FOREIGN KEY `Class_gradeId_fkey`;

-- DropForeignKey
ALTER TABLE `mastersubject` DROP FOREIGN KEY `MasterSubject_gradeId_fkey`;

-- DropIndex
DROP INDEX `Class_gradeId_fkey` ON `class`;

-- DropIndex
DROP INDEX `MasterSubject_gradeId_fkey` ON `mastersubject`;

-- AlterTable
ALTER TABLE `class` MODIFY `gradeId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `mastersubject` MODIFY `gradeId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Class` ADD CONSTRAINT `Class_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MasterSubject` ADD CONSTRAINT `MasterSubject_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
