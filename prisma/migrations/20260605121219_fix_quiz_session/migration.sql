/*
  Warnings:

  - You are about to drop the column `answredCount` on the `QuizSession` table. All the data in the column will be lost.
  - Added the required column `answerdCount` to the `QuizSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuizSession" DROP COLUMN "answredCount",
ADD COLUMN     "answerdCount" INTEGER NOT NULL;
