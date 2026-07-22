import { prisma } from "@/lib/prisma";

type GetDashboardStatsInput = {
  userId: string;
};

export async function getDashboardStats({
  userId,
}: GetDashboardStatsInput) {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

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
        nextReviewAt: {
          lte: now,
        },
      },
    }),

    prisma.reviewHistory.count({
      where: {
        userId,
        reviewedAt: {
          gte: startOfToday,
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
