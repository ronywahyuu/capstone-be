-- AlterTable
ALTER TABLE `Blog` MODIFY `published` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `PostDonasi` MODIFY `published` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `profession` VARCHAR(191) NULL;
