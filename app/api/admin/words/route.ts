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

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== "ADMIN") {
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
    const level = body.level ?? 0;

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
      },
      create: {
        text,
        meaning,
        synonyms,
        antonyms,
        example,
        level,
      },
    });

    const users = await prisma.user.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    await Promise.all(
      users.map((user) =>
        prisma.userWord.upsert({
          where: {
            userId_wordId: {
              userId: user.id,
              wordId: word.id,
            },
          },
          update: {},
          create: {
            userId: user.id,
            wordId: word.id,
            g5Level: 0,
            easeFactor: 2.5,
            interval: 0,
            nextReviewAt: new Date(),
          },
        })
      )
    );

    return NextResponse.json({
      word,
    });
  } catch (error) {
    console.error("Create word API error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
