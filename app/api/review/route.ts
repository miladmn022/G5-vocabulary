import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateG5Review, type ReviewRating } from "@/lib/g5-engine";
import { getSession } from "@/lib/session";

type ReviewRequestBody = {
  userWordId?: string;
  rating?: ReviewRating;
};

const validRatings: ReviewRating[] = ["AGAIN", "HARD", "GOOD", "EASY"];
const SESSION_WINDOW_HOURS = 6;

function getSessionWindow() {
  const now = new Date();
  const windowStart = new Date(now);
  windowStart.setHours(windowStart.getHours() - SESSION_WINDOW_HOURS);

  return {
    now,
    windowStart,
    resetAt: new Date(now.getTime() + SESSION_WINDOW_HOURS * 60 * 60 * 1000),
  };
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

    const userWord = await prisma.userWord.findFirst({
      where: {
        id: body.userWordId,
        userId: session.user.id,
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

    const { windowStart, resetAt } = getSessionWindow();

    const reviewedInWindow = await prisma.reviewHistory.count({
      where: {
        userId: session.user.id,
        reviewedAt: {
          gte: windowStart,
        },
      },
    });

    const dailyGoal = userWord.user.dailyGoal || 20;

    if (reviewedInWindow >= dailyGoal) {
      return NextResponse.json(
        {
          error: "Daily goal completed",
          limitReached: true,
          progress: {
            current: dailyGoal,
            total: dailyGoal,
            reviewedInWindow,
            remaining: 0,
            resetAt,
          },
        },
        { status: 429 }
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

    const nextReviewedInWindow = reviewedInWindow + 1;

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
      progress: {
        current: Math.min(nextReviewedInWindow, dailyGoal),
        total: dailyGoal,
        reviewedInWindow: nextReviewedInWindow,
        remaining: Math.max(0, dailyGoal - nextReviewedInWindow),
        resetAt,
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
