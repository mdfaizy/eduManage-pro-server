/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subject` ADD COLUMN `code` VARCHAR(191) NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Subject_code_key` ON `Subject`(`code`);
