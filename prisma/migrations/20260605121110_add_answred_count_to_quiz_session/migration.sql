/*
  Warnings:

  - Added the required column `answredCount` to the `QuizSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuizSession" ADD COLUMN     "answredCount" INTEGER NOT NULL;
