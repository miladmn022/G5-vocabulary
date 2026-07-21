import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function jsonResponse(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...init?.headers,
    },
  });
}

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: "demo@g5.local",
      },
    });

    if (!user) {
      return jsonResponse(
        { error: "Demo user not found" },
        { status: 404 }
      );
    }

    const userWord = await prisma.userWord.findFirst({
      where: {
        userId: user.id,
        nextReviewAt: {
          lte: new Date(),
        },
      },
      include: {
        word: true,
      },
      orderBy: [
        {
          nextReviewAt: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
    });

    if (!userWord) {
      return jsonResponse({
        userWord: null,
        message: "No words ready for review",
      });
    }

    return jsonResponse({
      userWord: {
        id: userWord.id,
        g5Level: userWord.g5Level,
        interval: userWord.interval,
        reviewCount: userWord.reviewCount,
        correctCount: userWord.correctCount,
        wrongCount: userWord.wrongCount,
        nextReviewAt: userWord.nextReviewAt,
        word: {
          id: userWord.word.id,
          text: userWord.word.text,
          meaning: userWord.word.meaning,
          synonyms: userWord.word.synonyms,
          antonyms: userWord.word.antonyms,
          example: userWord.word.example,
          level: userWord.word.level,
        },
      },
    });
  } catch (error) {
    console.error("Next word API error:", error);

    return jsonResponse(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
