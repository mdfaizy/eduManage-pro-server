-- AddForeignKey
ALTER TABLE `Section` ADD CONSTRAINT `Section_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `School`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
