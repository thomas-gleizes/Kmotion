-- CreateTable
CREATE TABLE `playlists`
(
    `id`          INTEGER      NOT NULL AUTO_INCREMENT,
    `title`       VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `slug`        VARCHAR(255) NOT NULL,
    `author_id`   INTEGER      NOT NULL,
    `created_at`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `playlists_slug_key` (`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `playlist_musics`
(
    `playlist_id` INTEGER NOT NULL,
    `music_id`    INTEGER NOT NULL,
    `position`    INTEGER NOT NULL,
    `userId`      INTEGER NULL,

    UNIQUE INDEX `playlist_musics_playlist_id_position_key` (`playlist_id`, `position`),
    PRIMARY KEY (`playlist_id`, `music_id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `playlists`
    ADD CONSTRAINT `playlists_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `playlist_musics`
    ADD CONSTRAINT `playlist_musics_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `playlist_musics`
    ADD CONSTRAINT `playlist_musics_music_id_fkey` FOREIGN KEY (`music_id`) REFERENCES `musics` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `playlist_musics`
    ADD CONSTRAINT `playlist_musics_playlist_id_fkey` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
