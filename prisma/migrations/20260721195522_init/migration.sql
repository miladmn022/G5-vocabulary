-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "synonyms" TEXT,
    "antonyms" TEXT,
    "example" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserWord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "g5Level" REAL NOT NULL DEFAULT 0,
    "easeFactor" REAL NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 0,
    "nextReviewAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewedAt" DATETIME,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "wrongCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserWord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReviewHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "userWordId" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "previousLevel" REAL NOT NULL,
    "nextLevel" REAL NOT NULL,
    "previousInterval" INTEGER NOT NULL,
    "nextInterval" INTEGER NOT NULL,
    "reviewedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReviewHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReviewHistory_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReviewHistory_userWordId_fkey" FOREIGN KEY ("userWordId") REFERENCES "UserWord" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

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
