-- CreateTable
CREATE TABLE `Album` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlobsOnAlbum` (
    `albumId` VARCHAR(191) NOT NULL,
    `blobId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`albumId`, `blobId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Blobs` (
    `id` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(255) NOT NULL,
    `mimetype` VARCHAR(255) NOT NULL,
    `size` INTEGER UNSIGNED NOT NULL,
    `metadata` JSON NULL,
    `checksum` VARCHAR(255) NOT NULL,
    `disk` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BlobsOnAlbum` ADD CONSTRAINT `BlobsOnAlbum_albumId_fkey` FOREIGN KEY (`albumId`) REFERENCES `Album`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlobsOnAlbum` ADD CONSTRAINT `BlobsOnAlbum_blobId_fkey` FOREIGN KEY (`blobId`) REFERENCES `Blobs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
