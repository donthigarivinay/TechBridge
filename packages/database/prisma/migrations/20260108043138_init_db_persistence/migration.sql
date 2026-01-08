-- AlterTable
ALTER TABLE "Project" ADD COLUMN "deadline" DATETIME;
ALTER TABLE "Project" ADD COLUMN "githubRepoName" TEXT;
ALTER TABLE "Project" ADD COLUMN "githubRepoUrl" TEXT;

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN "githubUsername" TEXT;
