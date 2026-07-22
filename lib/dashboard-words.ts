import { prisma } from "@/lib/prisma";

type WordScope = "global" | "personal";
type LearningLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

type GetDashboardWordsInput = {
  userId: string;
  scope: WordScope;
  query?: string;
  take?: number;
  learningLevel?: LearningLevel;
};

function getLevelWhere(learningLevel?: LearningLevel) {
  if (!learningLevel) {
    return {};
  }

  if (learningLevel === "BEGINNER") {
    return {
      level: {
        lte: 1,
      },
    };
  }

  if (learningLevel === "INTERMEDIATE") {
    return {
      level: 2,
    };
  }

  return {
    level: {
      gte: 2,
    },
  };
}

function getWhere({
  userId,
  scope,
  query,
  learningLevel,
}: {
  userId: string;
  scope: WordScope;
  query?: string;
  learningLevel?: LearningLevel;
}) {
  const scopeWhere =
    scope === "global"
      ? {
          isGlobal: true,
          ...getLevelWhere(learningLevel),
        }
      : {
          isGlobal: false,
          createdByUserId: userId,
        };

  const search = query?.trim();

  if (!search) {
    return scopeWhere;
  }

  return {
    AND: [
      scopeWhere,
      {
        OR: [
          {
            text: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            meaning: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      },
    ],
  };
}

export async function getDashboardWords({
  userId,
  scope,
  query,
  take = 12,
  learningLevel,
}: GetDashboardWordsInput) {
  const words = await prisma.word.findMany({
    where: getWhere({
      userId,
      scope,
      query,
      learningLevel,
    }),
    orderBy: {
      createdAt: "desc",
    },
    take,
    select: {
      id: true,
      text: true,
      meaning: true,
      synonyms: true,
      antonyms: true,
      example: true,
      level: true,
      isGlobal: true,
      createdByUserId: true,
    },
  });

  return words;
}

export async function getWordCounts(userId: string) {
  const [globalWordsCount, personalWordsCount] = await Promise.all([
    prisma.word.count({
      where: {
        isGlobal: true,
      },
    }),
    prisma.word.count({
      where: {
        isGlobal: false,
        createdByUserId: userId,
      },
    }),
  ]);

  return {
    globalWordsCount,
    personalWordsCount,
  };
}
