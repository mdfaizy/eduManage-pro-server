/*
  Warnings:

  - A unique constraint covering the columns `[name,gradeId]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `subject` DROP FOREIGN KEY `Subject_classId_fkey`;

-- DropIndex
DROP INDEX `Subject_classId_fkey` ON `subject`;

-- DropIndex
DROP INDEX `Subject_name_classId_key` ON `subject`;

-- AlterTable
ALTER TABLE `student` MODIFY `sectionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `subject` ADD COLUMN `gradeId` INTEGER NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `maxMarks` INTEGER NULL,
    ADD COLUMN `passMarks` INTEGER NULL,
    MODIFY `classId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Subject_name_gradeId_key` ON `Subject`(`name`, `gradeId`);

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
