/*
  Warnings:

  - You are about to drop the column `c1business` on the `Word` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Word" DROP COLUMN "c1business";

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordTags" (
    "wordId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "WordTags_pkey" PRIMARY KEY ("wordId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "WordTags" ADD CONSTRAINT "WordTags_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordTags" ADD CONSTRAINT "WordTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
