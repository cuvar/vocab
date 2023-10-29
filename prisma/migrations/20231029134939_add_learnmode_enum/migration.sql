/*
  Warnings:

  - You are about to drop the column `learned` on the `Word` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LearnMode" AS ENUM ('UNLEARNED', 'LEARNED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Word" DROP COLUMN "learned",
ADD COLUMN     "mode" "LearnMode" NOT NULL DEFAULT 'UNLEARNED';
