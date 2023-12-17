/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `Wotd` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Wotd_date_key" ON "Wotd"("date");
