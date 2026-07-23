import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type LearningLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
type LearnScope = "global" | "personal";

const SESSION_WINDOW_HOURS = 6;

function jsonResponse(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...init?.headers,
    },
  });
}

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

function getWordLevel(learningLevel: string | null | undefined) {
  if (learningLevel === "BEGINNER") {
    return 1;
  }

  if (learningLevel === "ADVANCED") {
    return 3;
  }

  return 2;
}

function getScope(request: Request): LearnScope {
  const url = new URL(request.url);
  return url.searchParams.get("scope") === "personal" ? "personal" : "global";
}

export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return jsonResponse(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const scope = getScope(request);

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        isActive: true,
        dailyGoal: true,
        learningLevel: true,
      },
    });

    if (!user || !user.isActive) {
      return jsonResponse(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { now, windowStart, resetAt } = getSessionWindow();

    const reviewedInWindow = await prisma.reviewHistory.count({
      where: {
        userId: user.id,
        reviewedAt: {
          gte: windowStart,
        },
      },
    });

    const dailyGoal = user.dailyGoal || 20;
    const remaining = Math.max(0, dailyGoal - reviewedInWindow);
    const currentStep = Math.min(reviewedInWindow + 1, dailyGoal);

    if (remaining <= 0) {
      return jsonResponse({
        userWord: null,
        message: "Daily goal completed",
        limitReached: true,
        scope,
        progress: {
          current: dailyGoal,
          total: dailyGoal,
          reviewedInWindow,
          remaining,
          resetAt,
        },
      });
    }

    const wordLevel = getWordLevel(user.learningLevel as LearningLevel);

    const wordScopeWhere =
      scope === "personal"
        ? {
            isGlobal: false,
            createdByUserId: user.id,
          }
        : {
            isGlobal: true,
          };

    const baseWhere = {
      userId: user.id,
      g5Level: {
        lt: 5,
      },
      nextReviewAt: {
        lte: now,
      },
      word: {
        level: wordLevel,
        ...wordScopeWhere,
      },
    };

    const againWord = await prisma.userWord.findFirst({
      where: {
        ...baseWhere,
        wrongCount: {
          gt: 0,
        },
      },
      include: {
        word: true,
      },
      orderBy: [
        {
          wrongCount: "desc",
        },
        {
          nextReviewAt: "asc",
        },
      ],
    });

    const userWord =
      againWord ||
      (await prisma.userWord.findFirst({
        where: baseWhere,
        include: {
          word: true,
        },
        orderBy: [
          {
            g5Level: "asc",
          },
          {
            nextReviewAt: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
      }));

    if (!userWord) {
      return jsonResponse({
        userWord: null,
        message:
          scope === "personal"
            ? "No personal words ready for review"
            : "No global words ready for review",
        limitReached: false,
        scope,
        progress: {
          current: Math.min(reviewedInWindow, dailyGoal),
          total: dailyGoal,
          reviewedInWindow,
          remaining,
          resetAt,
        },
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
      limitReached: false,
      scope,
      progress: {
        current: currentStep,
        total: dailyGoal,
        reviewedInWindow,
        remaining,
        resetAt,
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
