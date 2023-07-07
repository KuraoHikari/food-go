/*
  Warnings:

  - You are about to drop the column `stok` on the `menus` table. All the data in the column will be lost.
  - Added the required column `stock` to the `menus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "menus" DROP COLUMN "stok",
ADD COLUMN     "stock" INTEGER NOT NULL;
