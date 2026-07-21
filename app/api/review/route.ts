import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateG5Review, type ReviewRating } from "@/lib/g5-engine";

type ReviewRequestBody = {
  userWordId?: string;
  rating?: ReviewRating;
};

const validRatings: ReviewRating[] = ["AGAIN", "HARD", "GOOD", "EASY"];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ReviewRequestBody;

    if (!body.userWordId) {
      return NextResponse.json(
        { error: "userWordId is required" },
        { status: 400 }
      );
    }

    if (!body.rating || !validRatings.includes(body.rating)) {
      return NextResponse.json(
        { error: "rating is invalid" },
        { status: 400 }
      );
    }

    const userWord = await prisma.userWord.findUnique({
      where: {
        id: body.userWordId,
      },
      include: {
        word: true,
        user: true,
      },
    });

    if (!userWord) {
      return NextResponse.json(
        { error: "User word not found" },
        { status: 404 }
      );
    }

    if (!userWord.user.isActive) {
      return NextResponse.json(
        { error: "User is not active" },
        { status: 403 }
      );
    }

    const result = calculateG5Review({
      currentLevel: userWord.g5Level,
      currentInterval: userWord.interval,
      rating: body.rating,
    });

    const isCorrect = body.rating !== "AGAIN";

    const updatedUserWord = await prisma.userWord.update({
      where: {
        id: userWord.id,
      },
      data: {
        g5Level: result.nextLevel,
        interval: result.nextInterval,
        nextReviewAt: result.nextReviewAt,
        lastReviewedAt: new Date(),
        reviewCount: {
          increment: 1,
        },
        correctCount: isCorrect
          ? {
              increment: 1,
            }
          : undefined,
        wrongCount: !isCorrect
          ? {
              increment: 1,
            }
          : undefined,
      },
      include: {
        word: true,
      },
    });

    await prisma.reviewHistory.create({
      data: {
        userId: userWord.userId,
        wordId: userWord.wordId,
        userWordId: userWord.id,
        rating: body.rating,
        previousLevel: userWord.g5Level,
        nextLevel: result.nextLevel,
        previousInterval: userWord.interval,
        nextInterval: result.nextInterval,
      },
    });

    return NextResponse.json({
      userWord: updatedUserWord,
      review: {
        rating: body.rating,
        previousLevel: userWord.g5Level,
        nextLevel: result.nextLevel,
        previousInterval: userWord.interval,
        nextInterval: result.nextInterval,
        nextReviewAt: result.nextReviewAt,
      },
    });
  } catch (error) {
    console.error("Review API error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
