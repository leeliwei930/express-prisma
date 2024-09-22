/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Blobs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `Blobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Blobs` ADD COLUMN `key` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Blobs_key_key` ON `Blobs`(`key`);
