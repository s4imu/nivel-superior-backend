/*
  Warnings:

  - You are about to drop the column `user_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `replys` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `comments_user_id_fkey` ON `comments`;

-- DropIndex
DROP INDEX `replys_user_id_fkey` ON `replys`;

-- AlterTable
ALTER TABLE `comments` DROP COLUMN `user_id`;

-- AlterTable
ALTER TABLE `replys` DROP COLUMN `user_id`;
