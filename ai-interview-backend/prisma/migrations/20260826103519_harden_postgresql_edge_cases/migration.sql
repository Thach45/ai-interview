-- DropForeignKey
ALTER TABLE "user_cvs" DROP CONSTRAINT "fk_user_cvs_cv_analysis_id";

-- DropEnum
DROP TYPE "analysis_priority";

-- DropEnum
DROP TYPE "score_category";

-- AddForeignKey
ALTER TABLE "user_cvs" ADD CONSTRAINT "fk_user_cvs_cv_analysis_id" FOREIGN KEY ("cv_analysis_id") REFERENCES "cv_analyses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
