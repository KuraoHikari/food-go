/*
  Warnings:

  - Added the required column `image` to the `menus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `banner` to the `shops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo` to the `shops` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "menus" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "banner" TEXT NOT NULL,
ADD COLUMN     "logo" TEXT NOT NULL;
