import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type ImportBatchRow = {
  text: string;
  meaning: string;
  synonyms?: string;
  antonyms?: string;
  example?: string;
  level?: number;
};

type ImportBatchRequestBody = {
  rows?: ImportBatchRow[];
  scope?: "personal" | "global";
};

const MAX_BATCH_ROWS = 50;
const MAX_PERSONAL_WORDS = 1000;

function normalizeLevel(level: unknown) {
  const value = Number(level);

  if (!Number.isFinite(value) || value <= 1) {
    return 1;
  }

  if (value === 2) {
    return 2;
  }

  return 3;
}

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as ImportBatchRequestBody;
    const rows = body.rows || [];
    const isGlobalImport =
      session.user.role === "ADMIN" && body.scope === "global";

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "No rows provided" },
        { status: 400 }
      );
    }

    if (rows.length > MAX_BATCH_ROWS) {
      return NextResponse.json(
        { error: `Max batch size is ${MAX_BATCH_ROWS} rows.` },
        { status: 400 }
      );
    }

    const validRows = rows
      .map((row) => ({
        text: row.text?.trim(),
        meaning: row.meaning?.trim(),
        synonyms: row.synonyms?.trim() || "",
        antonyms: row.antonyms?.trim() || "",
        example: row.example?.trim() || "",
        level: normalizeLevel(row.level),
      }))
      .filter((row) => row.text && row.meaning);

    if (validRows.length === 0) {
      return NextResponse.json(
        { error: "No valid rows found" },
        { status: 400 }
      );
    }

    if (!isGlobalImport) {
      const personalWordsCount = await prisma.word.count({
        where: {
          isGlobal: false,
          createdByUserId: session.user.id,
        },
      });

      if (personalWordsCount + validRows.length > MAX_PERSONAL_WORDS) {
        return NextResponse.json(
          {
            error: `Personal word limit reached. You can have up to ${MAX_PERSONAL_WORDS} personal words.`,
          },
          { status: 400 }
        );
      }
    }

    const importedWords = await prisma.$transaction(
      validRows.map((row) =>
        prisma.word.upsert({
          where: {
            text: row.text,
          },
          update: {
            meaning: row.meaning,
            synonyms: row.synonyms,
            antonyms: row.antonyms,
            example: row.example,
            level: row.level,
            isGlobal: isGlobalImport,
            createdByUserId: isGlobalImport ? null : session.user.id,
          },
          create: {
            text: row.text,
            meaning: row.meaning,
            synonyms: row.synonyms,
            antonyms: row.antonyms,
            example: row.example,
            level: row.level,
            isGlobal: isGlobalImport,
            createdByUserId: isGlobalImport ? null : session.user.id,
          },
        })
      )
    );

    if (!isGlobalImport) {
      await prisma.$transaction(
        importedWords.map((word) =>
          prisma.userWord.upsert({
            where: {
              userId_wordId: {
                userId: session.user.id,
                wordId: word.id,
              },
            },
            update: {},
            create: {
              userId: session.user.id,
              wordId: word.id,
              g5Level: 0,
              easeFactor: 2.5,
              interval: 0,
              nextReviewAt: new Date(),
            },
          })
        )
      );
    }

    return NextResponse.json({
      importedCount: importedWords.length,
      scope: isGlobalImport ? "global" : "personal",
    });
  } catch (error) {
    console.error("Import batch API error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
