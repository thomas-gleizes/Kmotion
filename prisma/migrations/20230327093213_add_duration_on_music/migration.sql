/*
  Warnings:

  - Added the required column `duration` to the `musics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `musics`
    ADD COLUMN `duration` FLOAT NOT NULL AFTER downloader_id;
