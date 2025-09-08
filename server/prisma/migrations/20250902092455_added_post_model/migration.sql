/*
  Warnings:

  - You are about to drop the column `projectId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[postId,userId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postId,developerId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Like" DROP CONSTRAINT "Like_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_developerId_fkey";

-- DropIndex
DROP INDEX "public"."Comment_projectId_idx";

-- DropIndex
DROP INDEX "public"."Like_projectId_developerId_key";

-- DropIndex
DROP INDEX "public"."Like_projectId_idx";

-- DropIndex
DROP INDEX "public"."Like_projectId_userId_key";

-- AlterTable
ALTER TABLE "public"."Comment" DROP COLUMN "projectId",
ADD COLUMN     "postId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Like" DROP COLUMN "projectId",
ADD COLUMN     "postId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Project";

-- CreateTable
CREATE TABLE "public"."Post" (
    "id" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "useCase" TEXT NOT NULL,
    "howToUse" TEXT NOT NULL,
    "techStack" TEXT[],
    "category" TEXT NOT NULL,
    "demoLink" TEXT NOT NULL,
    "repoLink" TEXT NOT NULL,
    "images" TEXT[],
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Post_developerId_idx" ON "public"."Post"("developerId");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "public"."Post"("createdAt");

-- CreateIndex
CREATE INDEX "Comment_postId_idx" ON "public"."Comment"("postId");

-- CreateIndex
CREATE INDEX "Like_postId_idx" ON "public"."Like"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_postId_userId_key" ON "public"."Like"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_postId_developerId_key" ON "public"."Like"("postId", "developerId");

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "public"."Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
