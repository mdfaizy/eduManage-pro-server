/*
  Warnings:

  - A unique constraint covering the columns `[order,schoolId]` on the table `Grade` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Grade_order_schoolId_key` ON `Grade`(`order`, `schoolId`);
