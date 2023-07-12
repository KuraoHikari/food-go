-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "profileBanner" TEXT NOT NULL DEFAULT 'default.jpg',
ADD COLUMN     "profileImage" TEXT NOT NULL DEFAULT 'default.jpg';
