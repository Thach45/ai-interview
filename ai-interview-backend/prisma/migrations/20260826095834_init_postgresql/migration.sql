-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CANDIDATE', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'EVALUATING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('AI', 'USER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('INTERN', 'FRESHER', 'JUNIOR', 'MIDDLE', 'SENIOR', 'MANAGER', 'DIRECTOR');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GOOGLE', 'LOCAL');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('GROUP', 'INDUSTRY', 'POSITION');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "InterviewMode" AS ENUM ('VIDEO', 'TEXT');

-- CreateEnum
CREATE TYPE "InterviewLanguage" AS ENUM ('VIETNAMESE', 'ENGLISH', 'BILINGUAL');

-- CreateEnum
CREATE TYPE "InterviewPersona" AS ENUM ('PROFESSIONAL', 'FRIENDLY', 'STRICT', 'CHEERFUL');

-- CreateEnum
CREATE TYPE "CvSourceType" AS ENUM ('UPLOADED', 'BUILDER');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'COMPENSATION', 'PROMOTION');

-- CreateEnum
CREATE TYPE "AnalysisPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "ScoreCategory" AS ENUM ('TECHNICAL_SKILLS', 'EXPERIENCE', 'SOFT_SKILLS', 'EDUCATION', 'PROJECT_RELEVANCE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('AI_PROCESS', 'BILLING', 'REMINDER', 'SYSTEM_UPDATE', 'EMAIL');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CANDIDATE',
    "password" TEXT,
    "provider" "Provider" NOT NULL DEFAULT 'LOCAL',
    "googleId" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "emailVerifiedAt" TIMESTAMP(3),
    "creditsBalance" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCv" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "sourceType" "CvSourceType" NOT NULL DEFAULT 'UPLOADED',
    "cvData" JSONB,
    "templateId" UUID,
    "renderedHtml" TEXT,
    "fileUrl" TEXT,
    "cvAnalysisId" UUID,
    "aiModifications" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobCategory" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CategoryType" NOT NULL,
    "parentId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobTemplate" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyLogo" TEXT,
    "location" TEXT,
    "salaryRange" TEXT,
    "employmentType" TEXT,
    "experienceLevel" "ExperienceLevel" NOT NULL DEFAULT 'JUNIOR',
    "isRemote" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" UUID,
    "responsibilities" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "benefits" TEXT NOT NULL,
    "aiExtractedContext" TEXT NOT NULL,
    "isHotJob" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewSession" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'PENDING',
    "mode" "InterviewMode" NOT NULL DEFAULT 'VIDEO',
    "level" "ExperienceLevel" NOT NULL DEFAULT 'JUNIOR',
    "persona" "InterviewPersona" NOT NULL DEFAULT 'PROFESSIONAL',
    "language" "InterviewLanguage" NOT NULL DEFAULT 'VIETNAMESE',
    "difficulty" INTEGER NOT NULL DEFAULT 3,
    "duration" INTEGER NOT NULL DEFAULT 30,
    "focusSkills" TEXT[],
    "companyName" TEXT,
    "jobTitle" TEXT NOT NULL,
    "coreQuestions" JSONB NOT NULL DEFAULT '[]',
    "jobTemplateId" UUID,
    "customJdText" TEXT,
    "cvId" UUID,
    "recruiterRoomId" UUID,
    "startedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewMessage" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "audioUrl" TEXT,
    "questionIndex" INTEGER,
    "isFollowUp" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewResult" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "generalEvaluation" JSONB NOT NULL,
    "recommendation" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "learningPath" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionEvaluation" (
    "id" UUID NOT NULL,
    "interviewResultId" UUID NOT NULL,
    "questionIndex" INTEGER NOT NULL,
    "questionTitle" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "criteriaMatches" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "QuestionEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPackage" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "price" INTEGER NOT NULL,
    "oldPrice" INTEGER,
    "durationDays" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "features" TEXT[],
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "TransactionType" NOT NULL DEFAULT 'DEPOSIT',
    "packageId" UUID,
    "amount" INTEGER NOT NULL,
    "creditsAdded" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentRefId" TEXT,
    "sepayTransactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CvAnalysis" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "cvId" UUID NOT NULL,
    "jobTemplateId" UUID,
    "externalJobDescription" TEXT,
    "matchScore" INTEGER NOT NULL,
    "summary" TEXT,
    "scoringDetails" JSONB NOT NULL DEFAULT '[]',
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "skillsAnalysis" JSONB NOT NULL DEFAULT '[]',
    "foundKeywords" TEXT[],
    "missingKeywords" TEXT[],
    "improvementSuggestions" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CvAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecruiterRoom" (
    "id" UUID NOT NULL,
    "hrId" UUID NOT NULL,
    "roomName" TEXT NOT NULL,
    "jdContext" TEXT NOT NULL,
    "invitationToken" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecruiterRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationCode" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CvTemplate" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "htmlStructure" TEXT NOT NULL,
    "cssStyles" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CvTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "User_role_status_idx" ON "User"("role", "status");

-- CreateIndex
CREATE INDEX "UserCv_userId_createdAt_idx" ON "UserCv"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "UserCv_templateId_idx" ON "UserCv"("templateId");

-- CreateIndex
CREATE INDEX "UserCv_cvAnalysisId_idx" ON "UserCv"("cvAnalysisId");

-- CreateIndex
CREATE INDEX "JobCategory_type_idx" ON "JobCategory"("type");

-- CreateIndex
CREATE INDEX "JobCategory_parentId_idx" ON "JobCategory"("parentId");

-- CreateIndex
CREATE INDEX "JobTemplate_categoryId_idx" ON "JobTemplate"("categoryId");

-- CreateIndex
CREATE INDEX "JobTemplate_createdAt_idx" ON "JobTemplate"("createdAt");

-- CreateIndex
CREATE INDEX "JobTemplate_isHotJob_createdAt_idx" ON "JobTemplate"("isHotJob", "createdAt");

-- CreateIndex
CREATE INDEX "InterviewSession_userId_status_createdAt_idx" ON "InterviewSession"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "InterviewSession_cvId_idx" ON "InterviewSession"("cvId");

-- CreateIndex
CREATE INDEX "InterviewSession_jobTemplateId_idx" ON "InterviewSession"("jobTemplateId");

-- CreateIndex
CREATE INDEX "InterviewSession_recruiterRoomId_idx" ON "InterviewSession"("recruiterRoomId");

-- CreateIndex
CREATE INDEX "InterviewMessage_sessionId_createdAt_idx" ON "InterviewMessage"("sessionId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewResult_sessionId_key" ON "InterviewResult"("sessionId");

-- CreateIndex
CREATE INDEX "QuestionEvaluation_interviewResultId_questionIndex_idx" ON "QuestionEvaluation"("interviewResultId", "questionIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_sepayTransactionId_key" ON "Transaction"("sepayTransactionId");

-- CreateIndex
CREATE INDEX "Transaction_userId_status_createdAt_idx" ON "Transaction"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Transaction_status_createdAt_idx" ON "Transaction"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Transaction_packageId_idx" ON "Transaction"("packageId");

-- CreateIndex
CREATE INDEX "Transaction_paymentRefId_idx" ON "Transaction"("paymentRefId");

-- CreateIndex
CREATE INDEX "CvAnalysis_userId_createdAt_idx" ON "CvAnalysis"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CvAnalysis_cvId_idx" ON "CvAnalysis"("cvId");

-- CreateIndex
CREATE INDEX "CvAnalysis_jobTemplateId_idx" ON "CvAnalysis"("jobTemplateId");

-- CreateIndex
CREATE UNIQUE INDEX "RecruiterRoom_invitationToken_key" ON "RecruiterRoom"("invitationToken");

-- CreateIndex
CREATE INDEX "RecruiterRoom_hrId_isActive_idx" ON "RecruiterRoom"("hrId", "isActive");

-- CreateIndex
CREATE INDEX "VerificationCode_email_createdAt_idx" ON "VerificationCode"("email", "createdAt");

-- CreateIndex
CREATE INDEX "VerificationCode_expiresAt_idx" ON "VerificationCode"("expiresAt");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "UserCv" ADD CONSTRAINT "UserCv_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCv" ADD CONSTRAINT "UserCv_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "CvTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCv" ADD CONSTRAINT "UserCv_cvAnalysisId_fkey" FOREIGN KEY ("cvAnalysisId") REFERENCES "CvAnalysis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "JobCategory" ADD CONSTRAINT "JobCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "JobCategory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "JobTemplate" ADD CONSTRAINT "JobTemplate_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "JobCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "UserCv"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_jobTemplateId_fkey" FOREIGN KEY ("jobTemplateId") REFERENCES "JobTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_recruiterRoomId_fkey" FOREIGN KEY ("recruiterRoomId") REFERENCES "RecruiterRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewMessage" ADD CONSTRAINT "InterviewMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewResult" ADD CONSTRAINT "InterviewResult_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionEvaluation" ADD CONSTRAINT "QuestionEvaluation_interviewResultId_fkey" FOREIGN KEY ("interviewResultId") REFERENCES "InterviewResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "SubscriptionPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvAnalysis" ADD CONSTRAINT "CvAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvAnalysis" ADD CONSTRAINT "CvAnalysis_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "UserCv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvAnalysis" ADD CONSTRAINT "CvAnalysis_jobTemplateId_fkey" FOREIGN KEY ("jobTemplateId") REFERENCES "JobTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecruiterRoom" ADD CONSTRAINT "RecruiterRoom_hrId_fkey" FOREIGN KEY ("hrId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
