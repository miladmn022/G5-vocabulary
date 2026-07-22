import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const MAX_IMPORT_ROWS = 500;
const MAX_PERSONAL_WORDS = 1000;

type CsvWordRow = {
  text: string;
  meaning: string;
  synonyms: string;
  antonyms: string;
  example: string;
  level: number;
};

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index++) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      current += '"';
      index++;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());

  return values;
}

function parseCsv(content: string) {
  const cleanContent = content.replace(/^\uFEFF/, "");
  const lines = cleanContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("CSV file has no rows.");
  }

  const headers = parseCsvLine(lines[0]).map((header) =>
    header.trim().toLowerCase()
  );

  const requiredHeaders = ["text", "meaning"];

  for (const header of requiredHeaders) {
    if (!headers.includes(header)) {
      throw new Error(`Missing required column: ${header}`);
    }
  }

  const rows: CsvWordRow[] = [];

  for (const line of lines.slice(1)) {
    const values = parseCsvLine(line);

    const getValue = (name: string) => {
      const index = headers.indexOf(name);
      return index >= 0 ? values[index]?.trim() || "" : "";
    };

    const text = getValue("text");
    const meaning = getValue("meaning");

    if (!text || !meaning) {
      continue;
    }

    const levelValue = Number(getValue("level") || 0);
    const level = Number.isFinite(levelValue)
      ? Math.max(0, Math.min(5, levelValue))
      : 0;

    rows.push({
      text,
      meaning,
      synonyms: getValue("synonyms"),
      antonyms: getValue("antonyms"),
      example: getValue("example"),
      level,
    });
  }

  return rows;
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

    const formData = await request.formData();
    const file = formData.get("file");
    const scope = formData.get("scope");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "CSV file is required" },
        { status: 400 }
      );
    }

    const isGlobalImport =
      session.user.role === "ADMIN" && scope === "global";

    const content = await file.text();
    const rows = parseCsv(content);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "No valid rows found. Text and meaning are required." },
        { status: 400 }
      );
    }

    if (rows.length > MAX_IMPORT_ROWS) {
      return NextResponse.json(
        {
          error: `Too many rows. Please import up to ${MAX_IMPORT_ROWS} rows at a time.`,
          rowCount: rows.length,
          maxRows: MAX_IMPORT_ROWS,
        },
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

      if (personalWordsCount + rows.length > MAX_PERSONAL_WORDS) {
        return NextResponse.json(
          {
            error: `Personal word limit reached. You can have up to ${MAX_PERSONAL_WORDS} personal words.`,
            personalWordsCount,
            incomingRows: rows.length,
            maxPersonalWords: MAX_PERSONAL_WORDS,
          },
          { status: 400 }
        );
      }
    }

    const operations = rows.map((row) =>
      prisma.word.upsert({
        where: {
          text: row.text,
        },
        update: {
          meaning: row.meaning,
          synonyms: row.synonyms || "",
          antonyms: row.antonyms || "",
          example: row.example || "",
          level: Number(row.level) || 0,
          isGlobal: isGlobalImport,
          createdByUserId: isGlobalImport ? null : session.user.id,
        },
        create: {
          text: row.text,
          meaning: row.meaning,
          synonyms: row.synonyms || "",
          antonyms: row.antonyms || "",
          example: row.example || "",
          level: Number(row.level) || 0,
          isGlobal: isGlobalImport,
          createdByUserId: isGlobalImport ? null : session.user.id,
        },
      })
    );

    const importedWords = await prisma.$transaction(operations);

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

    const importedCount = importedWords.length;
    const skippedCount = 0;

    return NextResponse.json({
      importedCount,
      skippedCount,
      scope: isGlobalImport ? "global" : "personal",
    });
  } catch (error) {
    console.error("Import words API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
