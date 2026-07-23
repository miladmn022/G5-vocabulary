import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type CreateWordRequestBody = {
  text?: string;
  meaning?: string;
  synonyms?: string;
  antonyms?: string;
  example?: string;
  level?: number;
};

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

    const body = (await request.json()) as CreateWordRequestBody;

    const text = body.text?.trim();
    const meaning = body.meaning?.trim();
    const synonyms = body.synonyms?.trim() || "";
    const antonyms = body.antonyms?.trim() || "";
    const example = body.example?.trim() || "";
    const level = normalizeLevel(body.level);
    const isAdmin = session.user.role === "ADMIN";

    if (!text || !meaning) {
      return NextResponse.json(
        { error: "Word and meaning are required" },
        { status: 400 }
      );
    }

    const word = await prisma.word.upsert({
      where: {
        text,
      },
      update: {
        meaning,
        synonyms,
        antonyms,
        example,
        level,
        isGlobal: isAdmin,
        createdByUserId: isAdmin ? null : session.user.id,
        source: "MANUAL",
      },
      create: {
        text,
        meaning,
        synonyms,
        antonyms,
        example,
        level,
        isGlobal: isAdmin,
        createdByUserId: isAdmin ? null : session.user.id,
        source: "MANUAL",
      },
    });

    if (isAdmin) {
      const users = await prisma.user.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
        },
      });

      if (users.length > 0) {
        await prisma.userWord.createMany({
          data: users.map((user) => ({
            userId: user.id,
            wordId: word.id,
            g5Level: 0,
            easeFactor: 2.5,
            interval: 0,
            nextReviewAt: new Date(),
          })),
          skipDuplicates: true,
        });
      }
    } else {
      await prisma.userWord.upsert({
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
      });
    }

    return NextResponse.json({
      word,
    });
  } catch (error) {
    console.error("Create word API error:", error);

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
