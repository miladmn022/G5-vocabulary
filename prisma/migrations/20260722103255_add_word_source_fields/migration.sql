-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Word" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "synonyms" TEXT,
    "antonyms" TEXT,
    "example" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "isGlobal" BOOLEAN NOT NULL DEFAULT true,
    "createdByUserId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Word" ("antonyms", "createdAt", "example", "id", "level", "meaning", "synonyms", "text", "updatedAt") SELECT "antonyms", "createdAt", "example", "id", "level", "meaning", "synonyms", "text", "updatedAt" FROM "Word";
DROP TABLE "Word";
ALTER TABLE "new_Word" RENAME TO "Word";
CREATE UNIQUE INDEX "Word_text_key" ON "Word"("text");
CREATE INDEX "Word_isGlobal_idx" ON "Word"("isGlobal");
CREATE INDEX "Word_createdByUserId_idx" ON "Word"("createdByUserId");
CREATE INDEX "Word_source_idx" ON "Word"("source");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
