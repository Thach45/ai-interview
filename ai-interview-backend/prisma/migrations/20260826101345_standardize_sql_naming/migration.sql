-- Normalize PostgreSQL enum type names without changing their values.
ALTER TYPE "Role" RENAME TO "user_role";
ALTER TYPE "SessionStatus" RENAME TO "interview_session_status";
ALTER TYPE "MessageRole" RENAME TO "interview_message_role";
ALTER TYPE "PaymentStatus" RENAME TO "payment_status";
ALTER TYPE "ExperienceLevel" RENAME TO "experience_level";
ALTER TYPE "Provider" RENAME TO "auth_provider";
ALTER TYPE "CategoryType" RENAME TO "job_category_type";
ALTER TYPE "UserStatus" RENAME TO "user_status";
ALTER TYPE "InterviewMode" RENAME TO "interview_mode";
ALTER TYPE "InterviewLanguage" RENAME TO "interview_language";
ALTER TYPE "InterviewPersona" RENAME TO "interview_persona";
ALTER TYPE "CvSourceType" RENAME TO "cv_source_type";
ALTER TYPE "TransactionType" RENAME TO "transaction_type";
ALTER TYPE "AnalysisPriority" RENAME TO "analysis_priority";
ALTER TYPE "ScoreCategory" RENAME TO "score_category";
ALTER TYPE "NotificationType" RENAME TO "notification_type";

-- Use plural snake_case table names.
ALTER TABLE "User" RENAME TO "users";
ALTER TABLE "UserCv" RENAME TO "user_cvs";
ALTER TABLE "JobCategory" RENAME TO "job_categories";
ALTER TABLE "JobTemplate" RENAME TO "job_templates";
ALTER TABLE "InterviewSession" RENAME TO "interview_sessions";
ALTER TABLE "InterviewMessage" RENAME TO "interview_messages";
ALTER TABLE "InterviewResult" RENAME TO "interview_results";
ALTER TABLE "QuestionEvaluation" RENAME TO "question_evaluations";
ALTER TABLE "SubscriptionPackage" RENAME TO "subscription_packages";
ALTER TABLE "Transaction" RENAME TO "transactions";
ALTER TABLE "CvAnalysis" RENAME TO "cv_analyses";
ALTER TABLE "RecruiterRoom" RENAME TO "recruiter_rooms";
ALTER TABLE "VerificationCode" RENAME TO "verification_codes";
ALTER TABLE "CvTemplate" RENAME TO "cv_templates";
ALTER TABLE "Notification" RENAME TO "notifications";

-- Use snake_case column names while Prisma keeps camelCase field names.
ALTER TABLE "users" RENAME COLUMN "fullName" TO "full_name";
ALTER TABLE "users" RENAME COLUMN "avatarUrl" TO "avatar_url";
ALTER TABLE "users" RENAME COLUMN "googleId" TO "google_id";
ALTER TABLE "users" RENAME COLUMN "emailVerifiedAt" TO "email_verified_at";
ALTER TABLE "users" RENAME COLUMN "creditsBalance" TO "credits_balance";
ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "user_cvs" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "user_cvs" RENAME COLUMN "sourceType" TO "source_type";
ALTER TABLE "user_cvs" RENAME COLUMN "cvData" TO "cv_data";
ALTER TABLE "user_cvs" RENAME COLUMN "templateId" TO "template_id";
ALTER TABLE "user_cvs" RENAME COLUMN "renderedHtml" TO "rendered_html";
ALTER TABLE "user_cvs" RENAME COLUMN "fileUrl" TO "file_url";
ALTER TABLE "user_cvs" RENAME COLUMN "cvAnalysisId" TO "cv_analysis_id";
ALTER TABLE "user_cvs" RENAME COLUMN "aiModifications" TO "ai_modifications";
ALTER TABLE "user_cvs" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "user_cvs" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "job_categories" RENAME COLUMN "parentId" TO "parent_id";
ALTER TABLE "job_categories" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "job_categories" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "job_templates" RENAME COLUMN "companyName" TO "company_name";
ALTER TABLE "job_templates" RENAME COLUMN "companyLogo" TO "company_logo";
ALTER TABLE "job_templates" RENAME COLUMN "salaryRange" TO "salary_range";
ALTER TABLE "job_templates" RENAME COLUMN "employmentType" TO "employment_type";
ALTER TABLE "job_templates" RENAME COLUMN "experienceLevel" TO "experience_level";
ALTER TABLE "job_templates" RENAME COLUMN "isRemote" TO "is_remote";
ALTER TABLE "job_templates" RENAME COLUMN "categoryId" TO "category_id";
ALTER TABLE "job_templates" RENAME COLUMN "aiExtractedContext" TO "ai_extracted_context";
ALTER TABLE "job_templates" RENAME COLUMN "isHotJob" TO "is_hot_job";
ALTER TABLE "job_templates" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "job_templates" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "interview_sessions" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "interview_sessions" RENAME COLUMN "focusSkills" TO "focus_skills";
ALTER TABLE "interview_sessions" RENAME COLUMN "companyName" TO "company_name";
ALTER TABLE "interview_sessions" RENAME COLUMN "jobTitle" TO "job_title";
ALTER TABLE "interview_sessions" RENAME COLUMN "coreQuestions" TO "core_questions";
ALTER TABLE "interview_sessions" RENAME COLUMN "jobTemplateId" TO "job_template_id";
ALTER TABLE "interview_sessions" RENAME COLUMN "customJdText" TO "custom_jd_text";
ALTER TABLE "interview_sessions" RENAME COLUMN "cvId" TO "cv_id";
ALTER TABLE "interview_sessions" RENAME COLUMN "recruiterRoomId" TO "recruiter_room_id";
ALTER TABLE "interview_sessions" RENAME COLUMN "startedAt" TO "started_at";
ALTER TABLE "interview_sessions" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "interview_sessions" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "interview_messages" RENAME COLUMN "sessionId" TO "session_id";
ALTER TABLE "interview_messages" RENAME COLUMN "audioUrl" TO "audio_url";
ALTER TABLE "interview_messages" RENAME COLUMN "questionIndex" TO "question_index";
ALTER TABLE "interview_messages" RENAME COLUMN "isFollowUp" TO "is_follow_up";
ALTER TABLE "interview_messages" RENAME COLUMN "createdAt" TO "created_at";

ALTER TABLE "interview_results" RENAME COLUMN "sessionId" TO "session_id";
ALTER TABLE "interview_results" RENAME COLUMN "overallScore" TO "overall_score";
ALTER TABLE "interview_results" RENAME COLUMN "generalEvaluation" TO "general_evaluation";
ALTER TABLE "interview_results" RENAME COLUMN "learningPath" TO "learning_path";
ALTER TABLE "interview_results" RENAME COLUMN "createdAt" TO "created_at";

ALTER TABLE "question_evaluations" RENAME COLUMN "interviewResultId" TO "interview_result_id";
ALTER TABLE "question_evaluations" RENAME COLUMN "questionIndex" TO "question_index";
ALTER TABLE "question_evaluations" RENAME COLUMN "questionTitle" TO "question_title";
ALTER TABLE "question_evaluations" RENAME COLUMN "criteriaMatches" TO "criteria_matches";

ALTER TABLE "subscription_packages" RENAME COLUMN "oldPrice" TO "old_price";
ALTER TABLE "subscription_packages" RENAME COLUMN "durationDays" TO "duration_days";
ALTER TABLE "subscription_packages" RENAME COLUMN "isPopular" TO "is_popular";
ALTER TABLE "subscription_packages" RENAME COLUMN "isActive" TO "is_active";
ALTER TABLE "subscription_packages" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "subscription_packages" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "transactions" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "transactions" RENAME COLUMN "packageId" TO "package_id";
ALTER TABLE "transactions" RENAME COLUMN "creditsAdded" TO "credits_added";
ALTER TABLE "transactions" RENAME COLUMN "paymentRefId" TO "payment_ref_id";
ALTER TABLE "transactions" RENAME COLUMN "sepayTransactionId" TO "sepay_transaction_id";
ALTER TABLE "transactions" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "transactions" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "cv_analyses" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "cv_analyses" RENAME COLUMN "cvId" TO "cv_id";
ALTER TABLE "cv_analyses" RENAME COLUMN "jobTemplateId" TO "job_template_id";
ALTER TABLE "cv_analyses" RENAME COLUMN "externalJobDescription" TO "external_job_description";
ALTER TABLE "cv_analyses" RENAME COLUMN "matchScore" TO "match_score";
ALTER TABLE "cv_analyses" RENAME COLUMN "scoringDetails" TO "scoring_details";
ALTER TABLE "cv_analyses" RENAME COLUMN "skillsAnalysis" TO "skills_analysis";
ALTER TABLE "cv_analyses" RENAME COLUMN "foundKeywords" TO "found_keywords";
ALTER TABLE "cv_analyses" RENAME COLUMN "missingKeywords" TO "missing_keywords";
ALTER TABLE "cv_analyses" RENAME COLUMN "improvementSuggestions" TO "improvement_suggestions";
ALTER TABLE "cv_analyses" RENAME COLUMN "createdAt" TO "created_at";

ALTER TABLE "recruiter_rooms" RENAME COLUMN "hrId" TO "hr_id";
ALTER TABLE "recruiter_rooms" RENAME COLUMN "roomName" TO "room_name";
ALTER TABLE "recruiter_rooms" RENAME COLUMN "jdContext" TO "jd_context";
ALTER TABLE "recruiter_rooms" RENAME COLUMN "invitationToken" TO "invitation_token";
ALTER TABLE "recruiter_rooms" RENAME COLUMN "isActive" TO "is_active";
ALTER TABLE "recruiter_rooms" RENAME COLUMN "expiresAt" TO "expires_at";
ALTER TABLE "recruiter_rooms" RENAME COLUMN "createdAt" TO "created_at";

ALTER TABLE "verification_codes" RENAME COLUMN "expiresAt" TO "expires_at";
ALTER TABLE "verification_codes" RENAME COLUMN "createdAt" TO "created_at";

ALTER TABLE "cv_templates" RENAME COLUMN "thumbnailUrl" TO "thumbnail_url";
ALTER TABLE "cv_templates" RENAME COLUMN "htmlStructure" TO "html_structure";
ALTER TABLE "cv_templates" RENAME COLUMN "cssStyles" TO "css_styles";
ALTER TABLE "cv_templates" RENAME COLUMN "isActive" TO "is_active";
ALTER TABLE "cv_templates" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "cv_templates" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "notifications" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "notifications" RENAME COLUMN "isRead" TO "is_read";
ALTER TABLE "notifications" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "notifications" RENAME COLUMN "updatedAt" TO "updated_at";

-- Give primary keys predictable names.
ALTER TABLE "users" RENAME CONSTRAINT "User_pkey" TO "pk_users";
ALTER TABLE "user_cvs" RENAME CONSTRAINT "UserCv_pkey" TO "pk_user_cvs";
ALTER TABLE "job_categories" RENAME CONSTRAINT "JobCategory_pkey" TO "pk_job_categories";
ALTER TABLE "job_templates" RENAME CONSTRAINT "JobTemplate_pkey" TO "pk_job_templates";
ALTER TABLE "interview_sessions" RENAME CONSTRAINT "InterviewSession_pkey" TO "pk_interview_sessions";
ALTER TABLE "interview_messages" RENAME CONSTRAINT "InterviewMessage_pkey" TO "pk_interview_messages";
ALTER TABLE "interview_results" RENAME CONSTRAINT "InterviewResult_pkey" TO "pk_interview_results";
ALTER TABLE "question_evaluations" RENAME CONSTRAINT "QuestionEvaluation_pkey" TO "pk_question_evaluations";
ALTER TABLE "subscription_packages" RENAME CONSTRAINT "SubscriptionPackage_pkey" TO "pk_subscription_packages";
ALTER TABLE "transactions" RENAME CONSTRAINT "Transaction_pkey" TO "pk_transactions";
ALTER TABLE "cv_analyses" RENAME CONSTRAINT "CvAnalysis_pkey" TO "pk_cv_analyses";
ALTER TABLE "recruiter_rooms" RENAME CONSTRAINT "RecruiterRoom_pkey" TO "pk_recruiter_rooms";
ALTER TABLE "verification_codes" RENAME CONSTRAINT "VerificationCode_pkey" TO "pk_verification_codes";
ALTER TABLE "cv_templates" RENAME CONSTRAINT "CvTemplate_pkey" TO "pk_cv_templates";
ALTER TABLE "notifications" RENAME CONSTRAINT "Notification_pkey" TO "pk_notifications";

-- Normalize unique and regular index names.
ALTER INDEX "User_email_key" RENAME TO "uq_users_email";
ALTER INDEX "InterviewResult_sessionId_key" RENAME TO "uq_interview_results_session_id";
ALTER INDEX "Transaction_sepayTransactionId_key" RENAME TO "uq_transactions_sepay_transaction_id";
ALTER INDEX "RecruiterRoom_invitationToken_key" RENAME TO "uq_recruiter_rooms_invitation_token";

ALTER INDEX "User_createdAt_idx" RENAME TO "idx_users_created_at";
ALTER INDEX "User_role_status_idx" RENAME TO "idx_users_role_status";
ALTER INDEX "UserCv_userId_createdAt_idx" RENAME TO "idx_user_cvs_user_created_at";
ALTER INDEX "UserCv_templateId_idx" RENAME TO "idx_user_cvs_template_id";
ALTER INDEX "UserCv_cvAnalysisId_idx" RENAME TO "idx_user_cvs_cv_analysis_id";
ALTER INDEX "JobCategory_type_idx" RENAME TO "idx_job_categories_type";
ALTER INDEX "JobCategory_parentId_idx" RENAME TO "idx_job_categories_parent_id";
ALTER INDEX "JobTemplate_categoryId_idx" RENAME TO "idx_job_templates_category_id";
ALTER INDEX "JobTemplate_createdAt_idx" RENAME TO "idx_job_templates_created_at";
ALTER INDEX "JobTemplate_isHotJob_createdAt_idx" RENAME TO "idx_job_templates_hot_created_at";
ALTER INDEX "InterviewSession_userId_status_createdAt_idx" RENAME TO "idx_interview_sessions_user_status_created_at";
ALTER INDEX "InterviewSession_cvId_idx" RENAME TO "idx_interview_sessions_cv_id";
ALTER INDEX "InterviewSession_jobTemplateId_idx" RENAME TO "idx_interview_sessions_job_template_id";
ALTER INDEX "InterviewSession_recruiterRoomId_idx" RENAME TO "idx_interview_sessions_recruiter_room_id";
ALTER INDEX "InterviewMessage_sessionId_createdAt_idx" RENAME TO "idx_interview_messages_session_created_at";
ALTER INDEX "QuestionEvaluation_interviewResultId_questionIndex_idx" RENAME TO "idx_question_evaluations_result_question";
ALTER INDEX "Transaction_userId_status_createdAt_idx" RENAME TO "idx_transactions_user_status_created_at";
ALTER INDEX "Transaction_status_createdAt_idx" RENAME TO "idx_transactions_status_created_at";
ALTER INDEX "Transaction_packageId_idx" RENAME TO "idx_transactions_package_id";
ALTER INDEX "Transaction_paymentRefId_idx" RENAME TO "idx_transactions_payment_ref_id";
ALTER INDEX "CvAnalysis_userId_createdAt_idx" RENAME TO "idx_cv_analyses_user_created_at";
ALTER INDEX "CvAnalysis_cvId_idx" RENAME TO "idx_cv_analyses_cv_id";
ALTER INDEX "CvAnalysis_jobTemplateId_idx" RENAME TO "idx_cv_analyses_job_template_id";
ALTER INDEX "RecruiterRoom_hrId_isActive_idx" RENAME TO "idx_recruiter_rooms_hr_active";
ALTER INDEX "VerificationCode_email_createdAt_idx" RENAME TO "idx_verification_codes_email_created_at";
ALTER INDEX "VerificationCode_expiresAt_idx" RENAME TO "idx_verification_codes_expires_at";
ALTER INDEX "Notification_userId_createdAt_idx" RENAME TO "idx_notifications_user_created_at";

-- Normalize foreign key constraint names.
ALTER TABLE "user_cvs" RENAME CONSTRAINT "UserCv_userId_fkey" TO "fk_user_cvs_user_id";
ALTER TABLE "user_cvs" RENAME CONSTRAINT "UserCv_templateId_fkey" TO "fk_user_cvs_template_id";
ALTER TABLE "user_cvs" RENAME CONSTRAINT "UserCv_cvAnalysisId_fkey" TO "fk_user_cvs_cv_analysis_id";
ALTER TABLE "job_categories" RENAME CONSTRAINT "JobCategory_parentId_fkey" TO "fk_job_categories_parent_id";
ALTER TABLE "job_templates" RENAME CONSTRAINT "JobTemplate_categoryId_fkey" TO "fk_job_templates_category_id";
ALTER TABLE "interview_sessions" RENAME CONSTRAINT "InterviewSession_userId_fkey" TO "fk_interview_sessions_user_id";
ALTER TABLE "interview_sessions" RENAME CONSTRAINT "InterviewSession_cvId_fkey" TO "fk_interview_sessions_cv_id";
ALTER TABLE "interview_sessions" RENAME CONSTRAINT "InterviewSession_jobTemplateId_fkey" TO "fk_interview_sessions_job_template_id";
ALTER TABLE "interview_sessions" RENAME CONSTRAINT "InterviewSession_recruiterRoomId_fkey" TO "fk_interview_sessions_recruiter_room_id";
ALTER TABLE "interview_messages" RENAME CONSTRAINT "InterviewMessage_sessionId_fkey" TO "fk_interview_messages_session_id";
ALTER TABLE "interview_results" RENAME CONSTRAINT "InterviewResult_sessionId_fkey" TO "fk_interview_results_session_id";
ALTER TABLE "question_evaluations" RENAME CONSTRAINT "QuestionEvaluation_interviewResultId_fkey" TO "fk_question_evaluations_result_id";
ALTER TABLE "transactions" RENAME CONSTRAINT "Transaction_packageId_fkey" TO "fk_transactions_package_id";
ALTER TABLE "transactions" RENAME CONSTRAINT "Transaction_userId_fkey" TO "fk_transactions_user_id";
ALTER TABLE "cv_analyses" RENAME CONSTRAINT "CvAnalysis_userId_fkey" TO "fk_cv_analyses_user_id";
ALTER TABLE "cv_analyses" RENAME CONSTRAINT "CvAnalysis_cvId_fkey" TO "fk_cv_analyses_cv_id";
ALTER TABLE "cv_analyses" RENAME CONSTRAINT "CvAnalysis_jobTemplateId_fkey" TO "fk_cv_analyses_job_template_id";
ALTER TABLE "recruiter_rooms" RENAME CONSTRAINT "RecruiterRoom_hrId_fkey" TO "fk_recruiter_rooms_hr_id";
ALTER TABLE "notifications" RENAME CONSTRAINT "Notification_userId_fkey" TO "fk_notifications_user_id";
