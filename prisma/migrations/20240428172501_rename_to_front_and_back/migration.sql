/*
  Warnings:

  - You are about to drop the column `native` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `translation` on the `Word` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[front]` on the table `Word` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `back` to the `Word` table without a default value. This is not possible if the table is not empty.
  - Added the required column `front` to the `Word` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Word_translation_key";

-- AlterTable
ALTER TABLE "Word" RENAME COLUMN "translation" TO "front";
ALTER TABLE "Word" RENAME COLUMN "native" TO "back";


-- CreateIndex
CREATE UNIQUE INDEX "Word_front_key" ON "Word"("front");
