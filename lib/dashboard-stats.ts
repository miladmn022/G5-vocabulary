import { prisma } from "@/lib/prisma";

type GetDashboardStatsInput = {
  userId: string;
};

const SESSION_WINDOW_HOURS = 6;

export async function getDashboardStats({
  userId,
}: GetDashboardStatsInput) {
  const now = new Date();

  const windowStart = new Date(now);
  windowStart.setHours(windowStart.getHours() - SESSION_WINDOW_HOURS);

  const [
    user,
    totalWords,
    learnedWords,
    dueWords,
    reviewedToday,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        dailyGoal: true,
      },
    }),

    prisma.userWord.count({
      where: {
        userId,
      },
    }),

    prisma.userWord.count({
      where: {
        userId,
        g5Level: {
          gte: 5,
        },
      },
    }),

    prisma.userWord.count({
      where: {
        userId,
        g5Level: {
          lt: 5,
        },
        nextReviewAt: {
          lte: now,
        },
      },
    }),

    prisma.reviewHistory.count({
      where: {
        userId,
        reviewedAt: {
          gte: windowStart,
        },
      },
    }),
  ]);

  return {
    totalWords,
    learnedWords,
    dueWords,
    reviewedToday,
    dailyGoal: user?.dailyGoal || 20,
  };
}
