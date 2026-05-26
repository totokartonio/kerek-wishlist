-- Migrate existing placeholder values to NULL
UPDATE "Item" SET "image" = NULL WHERE "image" = 'Image';

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "image" DROP DEFAULT;