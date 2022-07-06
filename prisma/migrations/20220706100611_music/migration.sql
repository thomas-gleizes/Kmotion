-- CreateTable
CREATE TABLE `musics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `artist` VARCHAR(255) NOT NULL,
    `album` VARCHAR(255) NOT NULL,
    `youtube_id` VARCHAR(255) NOT NULL,
    `release_date` DATETIME NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `musics_youtube_id_key`(`youtube_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
