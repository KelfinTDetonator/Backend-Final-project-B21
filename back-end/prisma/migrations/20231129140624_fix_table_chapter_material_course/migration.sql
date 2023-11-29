/*
  Warnings:

  - A unique constraint covering the columns `[course_id]` on the table `chapters` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `duration` to the `chapters` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `course_id` on the `chapters` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "chapters" ADD COLUMN     "duration" INTEGER NOT NULL,
DROP COLUMN "course_id",
ADD COLUMN     "course_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "chapters_course_id_key" ON "chapters"("course_id");

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
