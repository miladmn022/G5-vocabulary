-- CreateEnum
CREATE TYPE "ReviewRating" AS ENUM ('AGAIN', 'HARD', 'GOOD', 'EASY');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "WordSource" AS ENUM ('MANUAL', 'EXCEL_IMPORT', 'DEFAULT_SEED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "synonyms" TEXT,
    "antonyms" TEXT,
    "example" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "isGlobal" BOOLEAN NOT NULL DEFAULT true,
    "createdByUserId" TEXT,
    "source" "WordSource" NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "g5Level" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 0,
    "nextReviewAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewedAt" TIMESTAMP(3),
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "wrongCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "userWordId" TEXT NOT NULL,
    "rating" "ReviewRating" NOT NULL,
    "previousLevel" DOUBLE PRECISION NOT NULL,
    "nextLevel" DOUBLE PRECISION NOT NULL,
    "previousInterval" INTEGER NOT NULL,
    "nextInterval" INTEGER NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Word_text_key" ON "Word"("text");

-- CreateIndex
CREATE INDEX "Word_isGlobal_idx" ON "Word"("isGlobal");

-- CreateIndex
CREATE INDEX "Word_createdByUserId_idx" ON "Word"("createdByUserId");

-- CreateIndex
CREATE INDEX "Word_source_idx" ON "Word"("source");

-- CreateIndex
CREATE INDEX "UserWord_userId_idx" ON "UserWord"("userId");

-- CreateIndex
CREATE INDEX "UserWord_wordId_idx" ON "UserWord"("wordId");

-- CreateIndex
CREATE INDEX "UserWord_nextReviewAt_idx" ON "UserWord"("nextReviewAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserWord_userId_wordId_key" ON "UserWord"("userId", "wordId");

-- CreateIndex
CREATE INDEX "ReviewHistory_userId_idx" ON "ReviewHistory"("userId");

-- CreateIndex
CREATE INDEX "ReviewHistory_wordId_idx" ON "ReviewHistory"("wordId");

-- CreateIndex
CREATE INDEX "ReviewHistory_userWordId_idx" ON "ReviewHistory"("userWordId");

-- CreateIndex
CREATE INDEX "ReviewHistory_reviewedAt_idx" ON "ReviewHistory"("reviewedAt");

-- AddForeignKey
ALTER TABLE "UserWord" ADD CONSTRAINT "UserWord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWord" ADD CONSTRAINT "UserWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewHistory" ADD CONSTRAINT "ReviewHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewHistory" ADD CONSTRAINT "ReviewHistory_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewHistory" ADD CONSTRAINT "ReviewHistory_userWordId_fkey" FOREIGN KEY ("userWordId") REFERENCES "UserWord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
