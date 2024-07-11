-- DropForeignKey
ALTER TABLE `medias` DROP FOREIGN KEY `medias_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `subjects` DROP FOREIGN KEY `subjects_course_id_fkey`;

-- AddForeignKey
ALTER TABLE `medias` ADD CONSTRAINT `medias_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
