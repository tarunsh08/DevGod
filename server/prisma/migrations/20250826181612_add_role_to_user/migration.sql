/*
  Warnings:

  - You are about to drop the column `clerkId` on the `Developer` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `Developer` table. All the data in the column will be lost.
  - You are about to drop the column `clerkId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Developer_clerkId_idx";

-- DropIndex
DROP INDEX "public"."Developer_clerkId_key";

-- DropIndex
DROP INDEX "public"."User_clerkId_idx";

-- DropIndex
DROP INDEX "public"."User_clerkId_key";

-- AlterTable
ALTER TABLE "public"."Developer" DROP COLUMN "clerkId",
DROP COLUMN "passwordHash";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "clerkId",
DROP COLUMN "passwordHash",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
