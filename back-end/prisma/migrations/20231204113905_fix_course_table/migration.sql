/*
  Warnings:

  - You are about to drop the column `progress` on the `courses` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "courses_category_id_key";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "progress",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "image_url" DROP NOT NULL,
ALTER COLUMN "level" DROP NOT NULL;

-- CreateTable
CREATE TABLE "course_progress" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "material_id" INTEGER NOT NULL,
    "is_complete" BOOLEAN NOT NULL,

    CONSTRAINT "course_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_progress_user_id_key" ON "course_progress"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_progress_course_id_key" ON "course_progress"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_progress_material_id_key" ON "course_progress"("material_id");

-- AddForeignKey
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
