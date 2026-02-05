/*
  Warnings:

  - You are about to drop the column `grade` on the `class` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `mastersubject` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `MasterSubject_name_grade_schoolId_key` ON `mastersubject`;

-- AlterTable
ALTER TABLE `class` DROP COLUMN `grade`,
    ADD COLUMN `gradeId` INTEGER NULL;

-- AlterTable
ALTER TABLE `mastersubject` DROP COLUMN `grade`,
    ADD COLUMN `gradeId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Grade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `level` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `schoolId` INTEGER NOT NULL,

    UNIQUE INDEX `Grade_name_schoolId_key`(`name`, `schoolId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Class` ADD CONSTRAINT `Class_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MasterSubject` ADD CONSTRAINT `MasterSubject_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
