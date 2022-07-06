-- CreateTable
CREATE TABLE `users`
(
    `id`         INTEGER      NOT NULL AUTO_INCREMENT,
    `name`       VARCHAR(255) NOT NULL,
    `email`      VARCHAR(255) NOT NULL,
    `password`   VARCHAR(255) NOT NULL,
    `slug`       VARCHAR(255) NOT NULL,
    `is_admin`   BOOLEAN      NOT NULL DEFAULT false,
    `created_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key` (`email`),
    UNIQUE INDEX `users_slug_key` (`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
