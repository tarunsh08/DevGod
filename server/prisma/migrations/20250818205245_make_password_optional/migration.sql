-- AlterTable
ALTER TABLE "public"."Developer" ADD COLUMN     "passwordHash" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "passwordHash" TEXT;
