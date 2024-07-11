/*
  Warnings:

  - You are about to drop the `replys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `replys` DROP FOREIGN KEY `replys_comentario_id_fkey`;

-- DropTable
DROP TABLE `replys`;
