/*
  Warnings:

  - You are about to drop the column `developerId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `developerId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `developerId` on the `Post` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_developerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Like" DROP CONSTRAINT "Like_developerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_developerId_fkey";

-- DropIndex
DROP INDEX "public"."Comment_developerId_idx";

-- DropIndex
DROP INDEX "public"."Like_developerId_idx";

-- DropIndex
DROP INDEX "public"."Like_postId_developerId_key";

-- DropIndex
DROP INDEX "public"."Post_developerId_idx";

-- AlterTable
ALTER TABLE "public"."Comment" DROP COLUMN "developerId";

-- AlterTable
ALTER TABLE "public"."Like" DROP COLUMN "developerId";

-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "developerId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Post_userId_idx" ON "public"."Post"("userId");

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
