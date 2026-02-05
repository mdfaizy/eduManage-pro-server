-- AlterTable
ALTER TABLE `class` ADD COLUMN `grade` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `MasterSubject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `grade` INTEGER NOT NULL DEFAULT 1,
    `schoolId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MasterSubject_name_grade_schoolId_key`(`name`, `grade`, `schoolId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
