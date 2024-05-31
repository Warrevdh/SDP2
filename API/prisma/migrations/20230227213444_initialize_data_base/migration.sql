-- CreateTable
CREATE TABLE `Order` (
    `orderId` INTEGER NOT NULL AUTO_INCREMENT,
    `syncId` INTEGER NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `orderReference` VARCHAR(191) NOT NULL,
    `orderDateTime` DATETIME(3) NOT NULL,
    `netAmount` VARCHAR(191) NOT NULL,
    `taxAmount` VARCHAR(191) NOT NULL,
    `totalAmount` VARCHAR(191) NOT NULL,
    `currencyId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`orderId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `orderItemId` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,
    `syncId` INTEGER NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` VARCHAR(191) NOT NULL,
    `unitOfMeasureId` VARCHAR(191) NOT NULL,
    `netPrice` VARCHAR(191) NOT NULL,
    `netAmount` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`orderItemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UnitOfMeasure` (
    `unitOfMeasureId` VARCHAR(191) NOT NULL,
    `syncId` INTEGER NOT NULL,
    `fromUnitOfMeasure` VARCHAR(191) NOT NULL,
    `toUnitOfMeasure` VARCHAR(191) NOT NULL,
    `fromQuantity` VARCHAR(191) NOT NULL,
    `toQuantity` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UnitOfMeasure_unitOfMeasureId_key`(`unitOfMeasureId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `productId` INTEGER NOT NULL,
    `syncId` INTEGER NOT NULL,
    `unitOfMeasureId` VARCHAR(191) NOT NULL,
    `productCategoryId` VARCHAR(191) NOT NULL,
    `productAvailability` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Description` (
    `description` VARCHAR(191) NOT NULL,
    `languageId` VARCHAR(191) NOT NULL,
    `syncId` INTEGER NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `productListerDescription` VARCHAR(191) NOT NULL,
    `productShortDescription` VARCHAR(191) NOT NULL,
    `productLongDescription` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Description_description_key`(`description`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Price` (
    `priceId` VARCHAR(191) NOT NULL,
    `syncId` INTEGER NOT NULL,
    `currencyId` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `unitOfMeasureId` VARCHAR(191) NOT NULL,
    `syncDateTime` DATETIME(3) NOT NULL,
    `quantity` INTEGER NOT NULL,

    UNIQUE INDEX `Price_priceId_key`(`priceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
